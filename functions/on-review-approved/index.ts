// Edge Function: on-review-approved
// Hook que dispara recálculo de Trust Score cuando se aprueba una reseña.
// Puede invocarse manualmente tras UPDATE reviews SET status='approved',
// o vía webhook si Insforge soporta triggers de DB → function.
// Input:  { clinic_id }  (o { review_id } para resolver)
// Output: 204
// @ts-ignore deno import
import { createClient } from 'npm:@insforge/sdk@latest';

export default async function (req: Request): Promise<Response> {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

  let body: any = {};
  try {
    body = await req.json();
  } catch {}

  // @ts-ignore deno
  const admin = createClient({
    baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
    apiKey: Deno.env.get('API_KEY'),
  });

  let clinicId: string | undefined = body.clinic_id;
  if (!clinicId && body.review_id) {
    const { data } = await admin.database
      .from('reviews')
      .select('clinic_id')
      .eq('id', body.review_id)
      .single();
    clinicId = data?.clinic_id;
  }
  if (!clinicId)
    return new Response(JSON.stringify({ error: 'clinic_id_or_review_id_required' }), {
      status: 400,
      headers: cors,
    });

  // Invocar compute-trust-score (misma red, mismo project)
  const baseUrl = Deno.env.get('INSFORGE_BASE_URL');
  await fetch(`${baseUrl}/api/functions/compute-trust-score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Deno.env.get('API_KEY')}`,
    },
    body: JSON.stringify({ clinic_id: clinicId }),
  });

  return new Response(null, { status: 204, headers: cors });
}
