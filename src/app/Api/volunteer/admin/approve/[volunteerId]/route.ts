import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { RolePreferenceService } from "@/app/Service/rolePreference.service";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ volunteerId: string }> }
) {
  try {
    // ✅ Await params (Next.js App Router requirement)
    const { volunteerId: targetUserId } = await params;

    console.log("APPROVE ROLE PARAM volunteerId =", targetUserId);

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, message: "volunteerId param missing" },
        { status: 400 }
      );
    }

    // ✅ Auth
    const auth = await authMiddleware(req);

    const result = await RolePreferenceService.approveByNGOAdmin({
      adminUserId: auth.id,
      adminRole: auth.role,
      adminNgoId: auth.ngoId,
      targetUserId, // USER ID
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Approve role error:", error.message);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
