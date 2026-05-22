import { NextResponse } from 'next/server';
import { analyzeClinicMessage } from '@/lib/clinic-workflow';

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;
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
