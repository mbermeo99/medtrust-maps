// Edge Function: get-shared-file
// La clínica canjea (token + OTP) por una URL firmada de acceso de 15 min.
// Público (sin JWT de paciente); la autorización la provee el token + OTP.
// Input:  { token, otp }
// Output: { signed_url, expires_at }
// @ts-ignore deno import
import { createClient } from 'npm:@insforge/sdk@latest';

const SIGNED_TTL_SECONDS = 15 * 60;

export default async function (req: Request): Promise<Response> {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST')
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405, headers: cors });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: cors });
  }
  const { token: shareToken, otp } = body || {};
  if (!shareToken || !otp)
    return new Response(JSON.stringify({ error: 'token_and_otp_required' }), {
      status: 400,
      headers: cors,
    });

  // @ts-ignore deno
  const admin = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    apiKey: Deno.env.get('API_KEY'),
  });

  const { data: row, error } = await admin.database
    .from('vault_share_tokens')
    .select('*')
    .eq('token', shareToken)
    .single();
  if (error || !row)
    return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 403, headers: cors });
  if (row.revoked_at)
    return new Response(JSON.stringify({ error: 'revoked' }), { status: 403, headers: cors });
  if (new Date(row.expires_at).getTime() < Date.now())
    return new Response(JSON.stringify({ error: 'expired' }), { status: 403, headers: cors });
  if (row.otp_code !== otp)
    return new Response(JSON.stringify({ error: 'invalid_otp' }), { status: 403, headers: cors });

  // Marcar OTP consumido la primera vez
  if (!row.otp_consumed) {
    await admin.database
      .from('vault_share_tokens')
      .update({ otp_consumed: true })
      .eq('token', shareToken);
  }

  const { data: file, error: fileErr } = await admin.database
    .from('medical_vault_files')
    .select('*')
    .eq('id', row.file_id)
    .single();
  if (fileErr || !file)
    return new Response(JSON.stringify({ error: 'file_not_found' }), { status: 404, headers: cors });

  // Pedir a Insforge Storage una signed URL (TTL 15 min)
  const baseUrl = Deno.env.get('INSFORGE_BASE_URL');
  const signRes = await fetch(
    `${baseUrl}/api/storage/buckets/${file.storage_bucket}/objects/${encodeURIComponent(file.storage_path)}/signed-url?expiresIn=${SIGNED_TTL_SECONDS}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('API_KEY')}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!signRes.ok) {
    const txt = await signRes.text();
    return new Response(JSON.stringify({ error: 'signed_url_failed', detail: txt }), {
      status: 500,
      headers: cors,
    });
  }
  const signed = await signRes.json();
  const signedUrl: string = signed.url || signed.signedUrl || signed.signed_url;
  const signedExpiresAt = new Date(Date.now() + SIGNED_TTL_SECONDS * 1000).toISOString();

  await admin.database.from('vault_access_log').insert([
    {
      file_id: file.id,
      actor_id: row.clinic_id,
      actor_type: 'clinic_staff',
      action: 'view',
      metadata: { token_prefix: shareToken.slice(0, 8) },
    },
  ]);

  return new Response(JSON.stringify({ signed_url: signedUrl, expires_at: signedExpiresAt }), {
    status: 200,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
