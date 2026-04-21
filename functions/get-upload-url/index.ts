// Edge Function: get-upload-url
// Crea metadata en medical_vault_files (status=uploading) y devuelve la URL
// donde el cliente debe hacer PUT del binario (Insforge Storage signed).
// Input:  { filename, mime, size_bytes, file_type }
// Output: { file_id, upload_url, storage_path }
// @ts-ignore deno import
import { createClient } from 'npm:@insforge/sdk@latest';

const BUCKET = 'medical-vault';
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB (§F-05)
const ALLOWED_MIME = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/dicom',
]);

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
  if (!token)
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: cors });
  }

  const { filename, mime, size_bytes, file_type } = body || {};
  if (!filename || !mime || !size_bytes || !file_type)
    return new Response(
      JSON.stringify({ error: 'missing_fields', required: ['filename', 'mime', 'size_bytes', 'file_type'] }),
      { status: 400, headers: cors }
    );
  if (!ALLOWED_MIME.has(mime))
    return new Response(JSON.stringify({ error: 'mime_not_allowed', mime }), { status: 415, headers: cors });
  if (size_bytes > MAX_BYTES)
    return new Response(JSON.stringify({ error: 'too_large', max: MAX_BYTES }), { status: 413, headers: cors });

  // @ts-ignore deno
  const userClient = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    edgeFunctionToken: token,
  });
  const { data: userData } = await userClient.auth.getCurrentUser();
  if (!userData?.user?.id)
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });
  const userId = userData.user.id;

  // @ts-ignore deno
  const admin = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    apiKey: Deno.env.get('API_KEY'),
  });

  const fileId = crypto.randomUUID();
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const storagePath = `${userId}/${fileId}-${safeName}`;

  const { error: insErr } = await admin.database.from('medical_vault_files').insert([
    {
      id: fileId,
      user_id: userId,
      file_type,
      original_filename: filename,
      storage_bucket: BUCKET,
      storage_path: storagePath,
      size_bytes,
      mime_type: mime,
      status: 'uploading',
    },
  ]);
  if (insErr) {
    return new Response(JSON.stringify({ error: 'db_insert_failed', detail: insErr.message }), {
      status: 500,
      headers: cors,
    });
  }

  await admin.database.from('vault_access_log').insert([
    { file_id: fileId, actor_id: userId, actor_type: 'patient', action: 'upload' },
  ]);

  // Insforge Storage: PUT directo con el JWT del usuario
  const baseUrl = Deno.env.get('INSFORGE_BASE_URL');
  const uploadUrl = `${baseUrl}/api/storage/buckets/${BUCKET}/objects/${encodeURIComponent(storagePath)}`;

  return new Response(JSON.stringify({ file_id: fileId, upload_url: uploadUrl, storage_path: storagePath }), {
    status: 200,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}
