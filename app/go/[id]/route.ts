import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const streamer = await prisma.streamer.findUnique({
    where: { id },
    select: { id: true, url: true, status: true },
  });

  if (!streamer || streamer.status !== "PAID") {
    return NextResponse.redirect(new URL("/", _req.url));
  }

  await prisma.streamer
    .update({ where: { id }, data: { clicks: { increment: 1 } } })
    .catch(() => {});

  return NextResponse.redirect(streamer.url);
}
