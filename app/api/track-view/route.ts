import { NextResponse } from "next/server";
import { incrementTotalViews } from "@/lib/stats";

export async function POST() {
  const totalViews = await incrementTotalViews();
  return NextResponse.json({ totalViews });
}
