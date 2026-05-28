import { NextResponse } from "next/server";
import { handleSendMessage } from "@/lib/clinic-api";
import { DEMO_CLINIC_ID } from "@/lib/demo-data";
import { getSupabaseClinicStore } from "@/lib/supabase-admin";
import { getAiProvider } from "@/lib/ai-provider";
import { getBoundedString, isUnauthenticatedDemoApiAllowed } from "@/lib/api-guards";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`send-msg-${ip}`, 5, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'تم تجاوز حد المحاولات. حاول مرة أخرى لاحقاً' },
        { status: 429 }
      );
    }

    if (!isUnauthenticatedDemoApiAllowed()) {
      return NextResponse.json({ error: "Authentication is required" }, { status: 401 });
    }

    const body = (await request.json()) as {
      to?: string;
      message?: string;
      conversationId?: string;
      customerId?: string;
      useRealAi?: boolean;
    };

    const to = getBoundedString(body.to, { max: 32 });
    const message = getBoundedString(body.message, { max: 4096 });

    if (!to || !message) {
      return NextResponse.json(
        { error: "Invalid required fields: to, message" },
        { status: 400 },
      );
    }

    const store = getSupabaseClinicStore();

    // If useRealAi, generate contextual reply first
    let messageBody = message;
    if (body.useRealAi) {
      try {
        const ai = await getAiProvider().analyze(message);
        messageBody = ai.reply;
      } catch {
        // Fall back to original message
      }
    }

    const result = await handleSendMessage({
      clinicId: process.env.DEMO_CLINIC_ID ?? DEMO_CLINIC_ID,
      to,
      body: messageBody,
      conversationId: body.conversationId ?? "demo-conv-1",
      customerId: body.customerId ?? "demo-cust-1",
      store,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Send message error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
