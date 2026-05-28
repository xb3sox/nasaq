import { NextResponse } from "next/server";
import {
  DEMO_CLINIC_ID,
  DEMO_CLINICS,
  DEMO_CONVERSATIONS,
  DEMO_AI_DECISION,
  DEMO_BOOKING,
  DEMO_REPORT_STATS,
} from "@/lib/demo-data";
import { buildReminderDrafts } from "@/lib/clinic-workflow";

export async function GET() {
  try {
    const defaultClinic = DEMO_CLINICS[0];
    const clinic = {
      id: DEMO_CLINIC_ID,
      name: defaultClinic.name,
      branch: defaultClinic.branchName,
      phone: defaultClinic.phone,
    };

    return NextResponse.json({
      clinic,
      conversation: DEMO_CONVERSATIONS[0],
      ai: DEMO_AI_DECISION,
      booking: DEMO_BOOKING,
      reminders: buildReminderDrafts(DEMO_BOOKING),
      report: DEMO_REPORT_STATS,
    });
  } catch (error) {
    console.error("Demo flow error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
