import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GovernmentRepository } from "@/app/repositories/government.repository";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

export async function authMiddleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      userId: string;
      role: string;
      ngoId?: string;
      hospitalId?: string;
      policeId?: string;
      governmentId?: string;
    };

    let governmentName: string | null = null;

    if (decoded.governmentId) {
      const government = await GovernmentRepository.findById(
        decoded.governmentId
      );
      governmentName = government?.name ?? null;
    }

    (req as any).user = {
      userId: decoded.userId,
      role: decoded.role,

      governmentId: decoded.governmentId ?? null,
      governmentName,

      policeId: decoded.policeId ?? null,
      ngoId: decoded.ngoId ?? null,
      hospitalId: decoded.hospitalId ?? null,
    };

    return null; // ✅ allow request
  } catch (err) {
    return NextResponse.json(
      { message: "Unauthorized: Invalid or expired token" },
      { status: 401 }
    );
  }
}
