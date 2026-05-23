import { NextResponse } from "next/server";
import { getRuntimeConfigStatus } from "@/lib/runtime-config";

export async function GET() {
  try {
    return NextResponse.json(getRuntimeConfigStatus());
  } catch (error) {
    console.error("Config status error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
