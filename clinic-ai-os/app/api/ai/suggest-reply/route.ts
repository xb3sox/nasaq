import { NextResponse } from 'next/server';
import { analyzeClinicMessage } from '@/lib/clinic-workflow';
import { extractLastMessageContent, isUnauthenticatedDemoApiAllowed } from '@/lib/api-guards';

export async function POST(request: Request) {
  try {
    if (!isUnauthenticatedDemoApiAllowed()) {
      return NextResponse.json({ error: 'Authentication is required' }, { status: 401 });
    }

    const body = await request.json();
    const lastMessage = extractLastMessageContent(body);

    if (!lastMessage) {
      return NextResponse.json({ error: 'Invalid messages payload' }, { status: 400 });
    }

    const decision = analyzeClinicMessage(lastMessage);

    return NextResponse.json({ 
      success: true,
      suggestedReply: decision.reply,
      intent: decision.intent,
      confidence: decision.confidence,
      humanNeeded: decision.humanNeeded,
      nextAction: decision.nextAction,
      serviceCode: decision.serviceCode,
      serviceName: decision.serviceName,
      availableSlots: decision.availableSlots ?? [],
    });

  } catch (error) {
    console.error('AI suggestion error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
