import { NextResponse } from "next/server";
import {
  demoAiDecision,
  demoBooking,
  demoClinic,
  demoConversation,
  demoReminders,
  demoReportStats,
} from "@/lib/demo-clinic";

export async function GET() {
  try {
    return NextResponse.json({
      clinic: demoClinic,
      conversation: demoConversation,
      ai: demoAiDecision,
      booking: demoBooking,
      reminders: demoReminders,
      report: demoReportStats,
    });
  } catch (error) {
    console.error("Demo flow error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
