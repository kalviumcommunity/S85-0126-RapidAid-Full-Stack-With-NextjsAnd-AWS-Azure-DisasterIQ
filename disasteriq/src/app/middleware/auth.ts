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
  console.log("Raw auth header:", authHeader);
  
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log("Token extracted, length:", token?.length);
  }

  // -------------------------
  // TOKEN FROM COOKIE
  // -------------------------
  if (!token) {
    token = req.cookies.get("accessToken")?.value;
    console.log("Token from cookie, length:", token?.length);
  }

  if (!token) {
    throw new Error("NO_TOKEN");
  }

  console.log("Token starts with:", token.substring(0, 20));
  console.log("Token ends with:", token.substring(token.length - 20));

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
