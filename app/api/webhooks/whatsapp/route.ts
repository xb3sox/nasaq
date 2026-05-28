import { NextResponse } from 'next/server';
import { handleWhatsAppWebhook } from '@/lib/clinic-api';
import { DEMO_CLINIC_ID } from '@/lib/demo-data';
import { getSupabaseClinicStore } from '@/lib/supabase-admin';
import { getWhatsAppVerifyToken, verifyMetaWebhookSignature } from '@/lib/api-guards';

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();

    if (process.env.NODE_ENV === 'production') {
      const isVerified = await verifyMetaWebhookSignature({
        rawBody,
        signatureHeader: request.headers.get('x-hub-signature-256'),
        appSecret: process.env.WHATSAPP_APP_SECRET,
      });

      if (!isVerified) {
        return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);
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

  const verifyToken = getWhatsAppVerifyToken();

  if (!verifyToken) {
    return new NextResponse('Webhook verify token is not configured', { status: 500 });
  }

  if (mode === 'subscribe' && token === verifyToken) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
}
