// Edge Function: revoke-share-token
// El paciente invalida un token previamente emitido.
// Input:  { token }
// Output: { ok }
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
  const shareToken: string | undefined = body?.token;
  if (!shareToken)
    return new Response(JSON.stringify({ error: 'token_required' }), { status: 400, headers: cors });

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

  const { data: row, error } = await admin.database
    .from('vault_share_tokens')
    .select('*')
    .eq('token', shareToken)
    .single();
  if (error || !row)
    return new Response(JSON.stringify({ error: 'token_not_found' }), { status: 404, headers: cors });
  if (row.issued_by !== userId)
    return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: cors });

  await admin.database
    .from('vault_share_tokens')
    .update({ revoked_at: new Date().toISOString() })
    .eq('token', shareToken);

  await admin.database.from('vault_access_log').insert([
    {
      file_id: row.file_id,
      actor_id: userId,
      actor_type: 'patient',
      action: 'revoke',
      metadata: { token_prefix: shareToken.slice(0, 8), clinic_id: row.clinic_id },
    },
  ]);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
