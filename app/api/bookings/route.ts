import { NextResponse } from "next/server";
import { handleCreateBooking } from "@/lib/clinic-api";
import { DEMO_CLINIC_ID } from "@/lib/demo-data";
import { getSupabaseClinicStore } from "@/lib/supabase-admin";
import { isUnauthenticatedDemoApiAllowed } from "@/lib/api-guards";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const { allowed } = rateLimit(`bookings-${ip}`, 10, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { error: 'تم تجاوز حد المحاولات. حاول مرة أخرى لاحقاً' },
        { status: 429 }
      );
    }

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
