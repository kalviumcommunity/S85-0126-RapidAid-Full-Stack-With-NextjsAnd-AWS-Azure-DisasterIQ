import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/prisma/prisma";

/**
 * DEBUG ENDPOINT - See ALL volunteers in system
 * Do NOT use in production!
 */
export async function GET(req: NextRequest) {
  try {
    const allVolunteers = await prisma.volunteer.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        ngo: { select: { id: true, name: true, state: true } },
      },
      orderBy: { joinedAt: 'desc' },
    });

    const allNGOs = await prisma.nGO.findMany({
      select: { id: true, name: true, state: true, _count: { select: { volunteers: true } } },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalVolunteers: allVolunteers.length,
        totalNGOs: allNGOs.length,
      },
      allVolunteers,
      allNGOs,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
