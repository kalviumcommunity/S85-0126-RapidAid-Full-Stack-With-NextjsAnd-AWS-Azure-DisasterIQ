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
  governmentState:string
}

export async function authMiddleware(req: NextRequest) {
  let token: string | undefined;

  // -------------------------
  // TOKEN FROM HEADER
  // -------------------------
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // -------------------------
  // TOKEN FROM COOKIE
  // -------------------------
  if (!token) {
    token = req.cookies.get("accessToken")?.value;
  }

  if (!token) {
    throw new Error("NO_TOKEN");
  }

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
}
