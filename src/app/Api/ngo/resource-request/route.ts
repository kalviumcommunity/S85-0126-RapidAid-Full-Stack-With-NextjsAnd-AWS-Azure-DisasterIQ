import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { VolunteerResourceRequestService } from "@/app/Service/volunteerResourceRequest.service";

export const dynamic = "force-dynamic";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

interface JwtPayload {
  userId: string;
  role: string;
  ngoId?: string;
}

function isUUID(value: string) {
  return /^[0-9a-fA-F-]{36}$/.test(value);
}

export async function POST(req: NextRequest) {
  try {
    let token: string | undefined;

    /* ================= 1️⃣ GET TOKEN ================= */

    // 🔹 Bearer token (Postman)
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 🔹 Cookie (Browser)
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("accessToken")?.value;
    }

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    /* ================= 2️⃣ VERIFY JWT ================= */

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;

    if (decoded.role !== "NGO_ADMIN" || !decoded.ngoId) {
      return NextResponse.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    if (!isUUID(decoded.ngoId) || !isUUID(decoded.userId)) {
      return NextResponse.json(
        { success: false, message: "Invalid token data" },
        { status: 400 }
      );
    }

    /* ================= 3️⃣ BODY ================= */

    const body = await req.json();
    const { disasterId, resourceType, quantity, unit } = body;

    if (disasterId && !isUUID(disasterId)) {
      return NextResponse.json(
        { success: false, message: "Invalid disasterId" },
        { status: 400 }
      );
    }

    if (!resourceType || !quantity || !unit) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    /* ================= 4️⃣ CREATE ================= */

    const request =
      await VolunteerResourceRequestService.createRequest({
        ngoId: decoded.ngoId,
        userId: decoded.userId,
        disasterId,
        resourceType,
        quantity,
        unit,
      });

    return NextResponse.json(
      { success: true, data: request },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message:
          error.name === "JsonWebTokenError"
            ? "Invalid token"
            : error.message || "Failed to create resource request",
      },
      { status: 400 }
    );
  }
}
