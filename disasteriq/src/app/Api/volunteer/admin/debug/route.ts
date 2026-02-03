import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { prisma } from "@/app/prisma/prisma";

/**
 * DEBUG ENDPOINT - Do NOT use in production
 * Lists all volunteers for an NGO admin to help diagnose filtering issues
 */
export async function GET(req: NextRequest) {
  try {
    const user = await authMiddleware(req);

    if (user.role !== "NGO_ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const ngoId = user.ngoId;
    if (!ngoId) return NextResponse.json({ success: false, message: "NGO context missing" }, { status: 400 });

    // Get ALL volunteers for this NGO (no filters)
    const allVolunteers = await prisma.volunteer.findMany({
      where: { ngoId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Get PENDING volunteers (filter: verified=false, rolePreference!=null)
    const pendingVolunteers = await prisma.volunteer.findMany({
      where: {
        ngoId,
        verified: false,
        rolePreference: { not: null },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      ngoId,
      debug: {
        allVolunteersCount: allVolunteers.length,
        pendingVolunteersCount: pendingVolunteers.length,
        allVolunteers,
        pendingVolunteers,
      },
    });
  } catch (err: any) {
    console.error("Debug error:", err?.message || err);
    return NextResponse.json({ success: false, message: err.message || "Internal server error" }, { status: 500 });
  }
}
