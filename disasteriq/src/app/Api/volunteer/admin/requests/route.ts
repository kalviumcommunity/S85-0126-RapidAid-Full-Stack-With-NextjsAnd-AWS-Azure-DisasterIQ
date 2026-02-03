import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { VolunteerAdminService } from "@/app/Service/volunteerAdmin_service";

export async function GET(req: NextRequest) {
  try {
    // Debug: log incoming headers
    const authHeader = req.headers.get("authorization");
    console.log("Authorization header:", authHeader ? "Present" : "Missing");
    
    const user = await authMiddleware(req);

    // Only NGO admins allowed
    if (user.role !== "NGO_ADMIN") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }

    const ngoId = user.ngoId;
    if (!ngoId) return NextResponse.json({ success: false, message: "NGO context missing" }, { status: 400 });

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Number(url.searchParams.get("pageSize") || "10");

    const res = await VolunteerAdminService.listRoleRequests(ngoId, page, pageSize);

    return NextResponse.json({ success: true, data: res }, { status: 200 });
  } catch (err: any) {
    console.error("List role requests error:", err?.message || err);
    if (err.message === "NO_TOKEN") return NextResponse.json({ success: false, message: "Authentication required" }, { status: 401 });
    if (err.message?.includes("jwt")) return NextResponse.json({ success: false, message: `JWT Error: ${err.message}` }, { status: 401 });
    return NextResponse.json({ success: false, message: err.message || "Internal server error" }, { status: 500 });
  }
}
