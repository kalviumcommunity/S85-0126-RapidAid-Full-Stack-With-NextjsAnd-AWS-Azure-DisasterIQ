import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { prisma } from "@/app/prisma/prisma";

export async function GET(req: NextRequest) {
  try {
    const user = await authMiddleware(req);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    if (user.role !== "NGO") {
      return NextResponse.json(
        { success: false, message: "Unauthorized - NGO role required" },
        { status: 403 }
      );
    }

    if (!user.ngoId) {
      return NextResponse.json(
        { success: false, message: "NGO user not linked to an NGO" },
        { status: 403 }
      );
    }

    const requests = await prisma.nGORequest.findMany({
      where: { ngoId: user.ngoId },
      include: { disaster: true },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({
      success: true,
      data: requests
    });
  } catch (err: any) {
    console.error("Error in NGO me route:", err);
    return NextResponse.json(
      { success: false, message: "Authentication required" },
      { status: 401 }
    );
  }
}
