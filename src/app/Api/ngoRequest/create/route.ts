import { NextRequest, NextResponse } from "next/server";
import { NGORequestService } from "@/app/Service/ngoRequest_service";
import { authMiddleware } from "@/app/middleware/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // -------------------------
    // AUTH + CONTEXT
    // -------------------------
    const user = await authMiddleware(req);

    if (user.role !== "GOVERNMENT_ADMIN") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { disasterId, ngoId } = body;

    if (!disasterId || !ngoId) {
      return NextResponse.json({ success: false, message: "disasterId and ngoId are required" }, { status: 400 });
    }

    const ngoRequest = await NGORequestService.createRequest({
      disasterId,
      ngoId,
      governmentId: user.governmentId!,
      userId: user.id,
    });

    return NextResponse.json({ success: true, message: "NGO request created", data: ngoRequest }, { status: 201 });
  } catch (err: any) {
    console.error("ngoRequest create error:", err?.message || err);

    if (err.message === "NO_TOKEN") {
      return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    }

    if (err.message === "Disaster not found or not owned by government" || err.message === "NGO not found") {
      return NextResponse.json({ success: false, message: err.message }, { status: 404 });
    }

    if (err.message === "NGO already requested for this disaster") {
      return NextResponse.json({ success: false, message: err.message }, { status: 409 });
    }

    return NextResponse.json({ success: false, message: err.message || "Internal server error" }, { status: 500 });
  }
}
