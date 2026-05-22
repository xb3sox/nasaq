import { NextResponse } from "next/server";
import { handleSendMessage } from "@/lib/clinic-api";
import { DEMO_CLINIC_ID } from "@/lib/demo-clinic";
import { getSupabaseClinicStore } from "@/lib/supabase-admin";
import { getAiProvider } from "@/lib/ai-provider";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      to?: string;
      message?: string;
      conversationId?: string;
      customerId?: string;
      useRealAi?: boolean;
    };

    if (!body.to || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields: to, message" },
        { status: 400 },
      );
    }

    const store = getSupabaseClinicStore();

    // If useRealAi, generate contextual reply first
    let messageBody = body.message;
    if (body.useRealAi) {
      try {
        const ai = await getAiProvider().analyze(body.message);
        messageBody = ai.reply;
      } catch {
        // Fall back to original message
      }
    }

    const result = await handleSendMessage({
      clinicId: process.env.DEMO_CLINIC_ID ?? DEMO_CLINIC_ID,
      to: body.to,
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