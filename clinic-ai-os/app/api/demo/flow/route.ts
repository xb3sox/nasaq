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
  return NextResponse.json({
    clinic: demoClinic,
    conversation: demoConversation,
    ai: demoAiDecision,
    booking: demoBooking,
    reminders: demoReminders,
    report: demoReportStats,
  });
}
