import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { RolePreferenceService } from "@/app/Service/rolePreference.service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { volunteerId: string } }
) {
  try {
    // ✅ param comes from folder name
    // `params` may be a Promise in Next.js App Router — await it before use
    const { volunteerId: targetUserId } = (await params) as {
      volunteerId?: string;
    };

    console.log("REJECT ROLE PARAM volunteerId =", targetUserId);

    if (!targetUserId) {
      return NextResponse.json(
        { success: false, message: "volunteerId param missing" },
        { status: 400 }
      );
    }

    const auth = await authMiddleware(req);

    const result = await RolePreferenceService.rejectByNGOAdmin({
      adminUserId: auth.id,
      adminRole: auth.role,
      adminNgoId: auth.ngoId,
      targetUserId, // this is USER ID
    });

    return NextResponse.json({
      success: true,
      message: "Role request rejected successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Reject role error:", error.message);

    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
