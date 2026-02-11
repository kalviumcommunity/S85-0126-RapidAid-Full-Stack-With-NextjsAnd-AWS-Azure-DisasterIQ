import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { prisma } from "@/app/prisma/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await authMiddleware(req);

    if (user.role !== "NGO_ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const ngoId = user.ngoId;
    if (!ngoId) {
      return NextResponse.json({ success: false, message: "NGO context missing" }, { status: 400 });
    }

    const requests = await prisma.rolePreferenceRequest.findMany({
      where: { ngoId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return NextResponse.json({ success: true, data: requests }, { status: 200 });
  } catch (err: any) {
    console.error("GET /Api/volunteer/admin/role-requests error:", err?.message || err);
    if (err.message === "NO_TOKEN") return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    if (err.message?.includes("jwt")) return NextResponse.json({ success: false, message: `JWT Error: ${err.message}` }, { status: 401 });
    return NextResponse.json({ success: false, message: err.message || "Internal server error" }, { status: 500 });
  }
}
