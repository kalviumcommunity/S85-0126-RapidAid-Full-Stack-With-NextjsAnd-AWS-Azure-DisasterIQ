import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { GovernmentRepository } from "@/app/repositories/government.repository";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;

interface JwtPayload {
  userId: string;
  role: string;

  ngoId?: string;
  hospitalId?: string;
  policeId?: string;
  governmentId?: string;
}

export async function authMiddleware(req: NextRequest) {
  // ✅ CORRECT: Read cookie from request
 const token = req.cookies.get("accessToken")?.value;


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

    // ✅ Unified user context
    return {
      id: decoded.userId,
      role: decoded.role,

      ngoId: decoded.ngoId,
      hospitalId: decoded.hospitalId,
      policeId: decoded.policeId,

      governmentId: decoded.governmentId,
      governmentName,
      governmentState,
    };
  } catch (error: any) {
    console.error("JWT verification error:", error.message);
    throw error;
  }
}
