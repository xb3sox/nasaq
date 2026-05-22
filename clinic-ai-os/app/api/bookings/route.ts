import { NextResponse } from "next/server";
import { handleCreateBooking } from "@/lib/clinic-api";
import { DEMO_CLINIC_ID } from "@/lib/demo-clinic";
import { getSupabaseClinicStore } from "@/lib/supabase-admin";
import { isUnauthenticatedDemoApiAllowed } from "@/lib/api-guards";

export async function POST(request: Request) {
  try {
    if (!isUnauthenticatedDemoApiAllowed()) {
      return NextResponse.json({ error: "Authentication is required" }, { status: 401 });
    }

    const body = await request.json();
    const response = await handleCreateBooking({
      clinicId: process.env.DEMO_CLINIC_ID ?? DEMO_CLINIC_ID,
      body,
      store: getSupabaseClinicStore(),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Create booking error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
