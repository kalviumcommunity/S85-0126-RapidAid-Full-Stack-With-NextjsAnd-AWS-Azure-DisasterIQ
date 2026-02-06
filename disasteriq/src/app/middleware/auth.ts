import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { GovernmentRepository } from "@/app/repositories/government.repository";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

interface JwtPayload {
  userId: string;
  role: string;
  ngoId?: string;
  hospitalId?: string;
  policeId?: string;
  governmentId?: string;
  governmentState:string;
}

export async function authMiddleware() {
  // -------------------------
  // TOKEN FROM COOKIE
  // -------------------------
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("NO_TOKEN");
  }

  try {
    const decoded = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    let governmentName: string | null = null;
    let governmentState: string | null = null;

    if (decoded.governmentId) {
      const government = await GovernmentRepository.findById(
        decoded.governmentId
      );

      governmentName = government?.name ?? null;
      governmentState = government?.state ?? null;
    }

    // ✅ RETURN USER CONTEXT
    return {
      id: decoded.userId,
      role: decoded.role,

      governmentId: decoded.governmentId,
      governmentName,
      governmentState,

      ngoId: decoded.ngoId,
      policeId: decoded.policeId,
      hospitalId: decoded.hospitalId,
    };
  } catch (error: any) {
    console.error("JWT verification error:", error.message);
    console.error("ACCESS_TOKEN_SECRET present:", !!ACCESS_TOKEN_SECRET);
    console.error("ACCESS_TOKEN_SECRET length:", ACCESS_TOKEN_SECRET?.length);
    throw error;
  }
}
