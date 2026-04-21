// Edge Function: validate-upload
// Tras el PUT del binario, marca el archivo como 'available' (o rechaza).
// V1: valida que el objeto exista en storage y calcula SHA-256.
// TODO (post-MVP): integrar ClamAV.
// Input:  { file_id }
// Output: { ok, sha256, status }
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
  if (!token)
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: cors });
  }
  if (!body.file_id)
    return new Response(JSON.stringify({ error: 'file_id_required' }), { status: 400, headers: cors });

  // @ts-ignore deno
  const userClient = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    edgeFunctionToken: token,
  });
  const { data: userData } = await userClient.auth.getCurrentUser();
  if (!userData?.user?.id)
    return new Response(JSON.stringify({ error: 'unauthorized' }), { status: 401, headers: cors });

  // @ts-ignore deno
  const admin = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    apiKey: Deno.env.get('API_KEY'),
  });

  const { data: file, error: fetchErr } = await admin.database
    .from('medical_vault_files')
    .select('*')
    .eq('id', body.file_id)
    .single();
  if (fetchErr || !file)
    return new Response(JSON.stringify({ error: 'file_not_found' }), { status: 404, headers: cors });
  if (file.user_id !== userData.user.id)
    return new Response(JSON.stringify({ error: 'forbidden' }), { status: 403, headers: cors });

  const baseUrl = Deno.env.get('INSFORGE_BASE_URL');
  const objectUrl = `${baseUrl}/api/storage/buckets/${file.storage_bucket}/objects/${encodeURIComponent(file.storage_path)}`;
  const res = await fetch(objectUrl, {
    headers: { Authorization: `Bearer ${Deno.env.get('API_KEY')}` },
  });
  if (!res.ok) {
    await admin.database
      .from('medical_vault_files')
      .update({ status: 'rejected' })
      .eq('id', body.file_id);
    return new Response(JSON.stringify({ error: 'object_not_found', status: 'rejected' }), {
      status: 400,
      headers: cors,
    });
  }
  const buf = new Uint8Array(await res.arrayBuffer());
  const hash = await crypto.subtle.digest('SHA-256', buf);
  const sha256 = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // MIME sniff básico (magic numbers)
  const detectedMime = sniffMime(buf);
  const expected = file.mime_type;
  if (detectedMime && expected && detectedMime !== expected && !(detectedMime === 'image/jpeg' && expected === 'image/jpg')) {
    await admin.database.from('medical_vault_files').update({ status: 'rejected', sha256 }).eq('id', body.file_id);
    return new Response(JSON.stringify({ error: 'mime_mismatch', declared: expected, detected: detectedMime }), {
      status: 400,
      headers: cors,
    });
  }

  await admin.database
    .from('medical_vault_files')
    .update({ status: 'available', sha256 })
    .eq('id', body.file_id);

  return new Response(JSON.stringify({ ok: true, status: 'available', sha256 }), {
    status: 200,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

function sniffMime(bytes: Uint8Array): string | null {
  if (bytes.length < 8) return null;
  // PDF: %PDF
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return 'application/pdf';
  // PNG
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return 'image/png';
  // JPEG
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  // DICOM: bytes 128..132 = "DICM"
  if (bytes.length > 132 && bytes[128] === 0x44 && bytes[129] === 0x49 && bytes[130] === 0x43 && bytes[131] === 0x4d)
    return 'application/dicom';
  return null;
}
