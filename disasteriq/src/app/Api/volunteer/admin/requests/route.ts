import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { VolunteerAdminService } from "@/app/Service/volunteerAdmin_service";
import { RolePreferenceRequestRepository } from "@/app/repositories/rolePreferenceRequest.repository";

export async function GET(req: NextRequest) {
  try {
    const user = await authMiddleware(req);

    if (user.role !== "NGO_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    if (!user.ngoId) {
      return NextResponse.json(
        { success: false, message: "NGO context missing" },
        { status: 400 }
      );
    }

    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") || "1");
    const pageSize = Number(url.searchParams.get("pageSize") || "10");

    const data = await VolunteerAdminService.listRoleRequests(
      user.ngoId,
      page,
      pageSize
    );

    return NextResponse.json(
      { success: true, data },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("List role requests error:", err?.message || err);

    if (err.message === "NO_TOKEN") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    if (err.message?.includes("jwt")) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await authMiddleware(req);

    // Verify user is NGO admin
    if (user.role !== "NGO_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Only NGO admins can approve role requests" },
        { status: 403 }
      );
    }

    if (!user.ngoId || !user.state) {
      return NextResponse.json(
        { success: false, message: "NGO context missing" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { requestId, approvedRole } = body;

    // Validate required fields
    if (!requestId || !approvedRole) {
      return NextResponse.json(
        { success: false, message: "requestId and approvedRole are required" },
        { status: 400 }
      );
    }

    // Approve the role preference request
    const approvedRequest = await RolePreferenceRequestRepository.approve(
      { requestId, approvedRole, approvedBy: user.id },
      user.ngoId,
      user.state
    );

    return NextResponse.json(
      {
        success: true,
        message: "Role request approved successfully",
        approvedRequest: {
          id: approvedRequest.id,
          userId: approvedRequest.userId,
          userName: approvedRequest.user?.name,
          userEmail: approvedRequest.user?.email,
          preferredRole: approvedRequest.preferredRole,
          approvedRole: approvedRequest.approvedRole,
          status: approvedRequest.status,
          approvedAt: approvedRequest.approvedAt,
          ngoName: approvedRequest.ngo?.name,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Approve role request error:", err?.message || err);

    if (err.message === "NO_TOKEN") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    if (err.message?.includes("jwt")) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (err.message?.includes("Unauthorized")) {
      return NextResponse.json(
        { success: false, message: "Cannot approve requests from other NGOs" },
        { status: 403 }
      );
    }

    if (err.message?.includes("not found")) {
      return NextResponse.json(
        { success: false, message: "Role request not found" },
        { status: 404 }
      );
    }

    if (err.message?.includes("PENDING")) {
      return NextResponse.json(
        { success: false, message: "Request is not in PENDING status" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
