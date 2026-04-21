// Edge Function: create-share-token
// El paciente autoriza a una clínica a ver un archivo del Vault durante TTL días.
// Genera token + OTP (6 dígitos) para la clínica, lo loguea y actualiza shared_with_clinic_ids.
// Input:  { file_id, clinic_id, ttl_days? (default 7) }
// Output: { token, expires_at }
// @ts-ignore deno import
import { createClient } from 'npm:@insforge/sdk@latest';

export default async function (req: Request): Promise<Response> {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST')
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405, headers: cors });

  const token = (req.headers.get('Authorization') || '').replace('Bearer ', '');
  if (!token) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: cors });
  }
  const { file_id, clinic_id } = body || {};
  const ttlDays = Math.max(1, Math.min(30, Number(body?.ttl_days ?? 7)));
  if (!file_id || !clinic_id)
    return new Response(JSON.stringify({ error: 'file_id_and_clinic_id_required' }), {
      status: 400,
      headers: cors,
    });

  // @ts-ignore deno
  const userClient = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    edgeFunctionToken: token,
  });
  const { data: userData } = await userClient.auth.getCurrentUser();
  if (!userData?.user?.id) return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });
  const userId = userData.user.id;

  // @ts-ignore deno
  const admin = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    apiKey: Deno.env.get('API_KEY'),
  });

  // Verificar ownership del archivo
  const { data: file, error: fileErr } = await admin.database
    .from('medical_vault_files')
    .select('*')
    .eq('id', file_id)
    .single();
  if (fileErr || !file || file.user_id !== userId)
    return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: cors });
  if (file.status !== 'available')
    return new Response(JSON.stringify({ error: 'file_not_ready', status: file.status }), {
      status: 400,
      headers: cors,
    });

  // Verificar que la clínica existe y está activa
  const { data: clinic, error: clinicErr } = await admin.database
    .from('clinics')
    .select('id, status')
    .eq('id', clinic_id)
    .single();
  if (clinicErr || !clinic || clinic.status !== 'active')
    return new Response(JSON.stringify({ error: 'clinic_not_found_or_inactive' }), {
      status: 404,
      headers: cors,
    });

  const shareToken = crypto.randomUUID().replace(/-/g, '') + crypto.randomUUID().replace(/-/g, '');
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000).toISOString();

  const { error: insErr } = await admin.database.from('vault_share_tokens').insert([
    {
      token: shareToken,
      file_id,
      clinic_id,
      issued_by: userId,
      otp_code: otp,
      expires_at: expiresAt,
    },
  ]);
  if (insErr)
    return new Response(JSON.stringify({ error: 'db_error', detail: insErr.message }), {
      status: 500,
      headers: cors,
    });

  // Añadir clinic_id al array shared_with_clinic_ids si no está
  const current: string[] = file.shared_with_clinic_ids || [];
  if (!current.includes(clinic_id)) {
    await admin.database
      .from('medical_vault_files')
      .update({ shared_with_clinic_ids: [...current, clinic_id] })
      .eq('id', file_id);
  }

  await admin.database.from('vault_access_log').insert([
    {
      file_id,
      actor_id: userId,
      actor_type: 'patient',
      action: 'share',
      metadata: { clinic_id, ttl_days: ttlDays },
    },
  ]);

  // TODO: enviar email con OTP a la clínica vía Resend (env RESEND_API_KEY).
  // Por ahora devolvemos el OTP en dev para poder probar (NO en prod).
  const devMode = Deno.env.get('INSFORGE_DEV_MODE') === 'true';

  return new Response(
    JSON.stringify({
      token: shareToken,
      expires_at: expiresAt,
      ...(devMode ? { _dev_otp: otp } : {}),
    }),
    { status: 200, headers: { ...cors, 'Content-Type': 'application/json' } }
  );
}
