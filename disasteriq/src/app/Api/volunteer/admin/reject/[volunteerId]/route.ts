import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { VolunteerAdminService } from "@/app/Service/volunteerAdmin_service";

export async function POST(req: NextRequest) {
  try {
    const user = await authMiddleware(req);
    if (user.role !== "NGO_ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const ngoId = user.ngoId;
    if (!ngoId) return NextResponse.json({ success: false, message: "NGO context missing" }, { status: 400 });

    const url = new URL(req.url);
    const volunteerId = url.pathname.split("/").pop();

    const updated = await VolunteerAdminService.rejectRole(volunteerId as string, { id: user.id, ngoId: user.ngoId, role: user.role });

    return NextResponse.json({ success: true, message: "Volunteer role request rejected", data: updated }, { status: 200 });
  } catch (err: any) {
    console.error("Reject role error:", err?.message || err);
    if (err.code === "UNAUTHORIZED" || err.message === "NO_TOKEN") return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    if (err.code === "FORBIDDEN") return NextResponse.json({ success: false, message: err.message }, { status: 403 });
    if (err.code === "NOT_FOUND") return NextResponse.json({ success: false, message: err.message }, { status: 404 });
    if (err.code === "VALIDATION_ERROR") return NextResponse.json({ success: false, message: err.message }, { status: 400 });
    return NextResponse.json({ success: false, message: err.message || "Internal server error" }, { status: 500 });
  }
}
