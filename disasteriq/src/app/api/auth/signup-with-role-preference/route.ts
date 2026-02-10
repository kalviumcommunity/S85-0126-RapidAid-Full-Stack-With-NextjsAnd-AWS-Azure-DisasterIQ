import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/app/prisma/prisma";
import { RolePreferenceRequestRepository } from "@/app/repositories/rolePreferenceRequest.repository";
import { verifyToken } from "@/app/lib/jwt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // -------------------------
    // 1. Extract token (Cookie OR Bearer)
    // -------------------------
    let token: string | undefined;

    // ✅ 1. Try Cookie (browser)
    const cookieStore = await cookies();
    token = cookieStore.get("accessToken")?.value;

    // ✅ 2. Fallback to Bearer (Postman / testing)
    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload || !payload.userId || !payload.state) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // -------------------------
    // 🔐 ROLE GUARD (CITIZEN ONLY)
    // -------------------------
    if (payload.role !== "CITIZEN") {
      return NextResponse.json(
        { error: "Only citizens can volunteer" },
        { status: 403 }
      );
    }

    const userId = payload.userId;
    const state = payload.state;

    // -------------------------
    // 2. Read & validate body
    // -------------------------
    const body = await req.json();
    const ngoId = body?.ngoId;
    const preferredRole = body?.preferredRole;

    if (!ngoId || !preferredRole) {
      return NextResponse.json(
        { error: "Missing required fields: ngoId, preferredRole" },
        { status: 400 }
      );
    }

    // -------------------------
    // 3. Verify NGO & state
    // -------------------------
    const ngo = await prisma.nGO.findUnique({
      where: { id: ngoId },
    });

    if (!ngo) {
      return NextResponse.json(
        { error: "NGO not found" },
        { status: 404 }
      );
    }

    // -------------------------
    // 4. Create role preference request
    // -------------------------
    const roleRequest =
      await RolePreferenceRequestRepository.create({
        userId,
        ngoId,
        state,
        preferredRole,
      });

    return NextResponse.json(
      {
        success: true,
        message: "Role preference request submitted successfully",
        rolePreferenceRequest: {
          id: roleRequest.id,
          status: roleRequest.status,
          preferredRole: roleRequest.preferredRole,
          createdAt: roleRequest.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error:
            "Role preference request already exists for this NGO",
        },
        { status: 409 }
      );
    }

    console.error("Role preference request error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
