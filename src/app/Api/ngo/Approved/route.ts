import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { NGORequestService } from "@/app/Service/ngoApproval.service";

export const dynamic = "force-dynamic";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

interface JwtPayload {
  userId: string;
  role: string;
  ngoId?: string;
  iat: number;
  exp: number;
}

function isUUID(value: string) {
  return /^[0-9a-fA-F-]{36}$/.test(value);
}

export async function GET(req: NextRequest) {
  try {
    let token: string | undefined;

    /* ================= 1️⃣ GET TOKEN ================= */

    // Bearer (Postman)
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Cookie (Browser)
     if (!token) {
      const cookieStore = await cookies(); // ✅ FIX
      token = cookieStore.get("accessToken")?.value;
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Access token missing" },
        { status: 401 }
      );
    }

    /* ================= 2️⃣ VERIFY JWT ================= */

    const decoded = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    const { ngoId, role } = decoded;

    /* ================= 3️⃣ VALIDATIONS ================= */

    if (!ngoId || !role) {
      return NextResponse.json(
        { success: false, message: "Invalid token payload" },
        { status: 401 }
      );
    }

    if (role !== "NGO_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    if (!isUUID(ngoId)) {
      return NextResponse.json(
        { success: false, message: "Invalid NGO ID" },
        { status: 400 }
      );
    }

    /* ================= 4️⃣ BUSINESS LOGIC ================= */

    const disasters =
      await NGORequestService.getApprovedDisastersForNgo(ngoId);

    return NextResponse.json({
      success: true,
      count: disasters.length,
      data: disasters,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          error.name === "JsonWebTokenError"
            ? "Invalid token"
            : error.message || "Failed to fetch disasters",
      },
      { status: 401 }
    );
  }
}
