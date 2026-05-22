import { NextResponse } from 'next/server';
import { handleWhatsAppWebhook } from '@/lib/clinic-api';
import { DEMO_CLINIC_ID } from '@/lib/demo-clinic';
import { getSupabaseClinicStore } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await handleWhatsAppWebhook({
      clinicId: process.env.DEMO_CLINIC_ID ?? DEMO_CLINIC_ID,
      payload: body,
      store: getSupabaseClinicStore(),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Meta requires GET endpoint for webhook verification
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'mock_verify_token';

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}
