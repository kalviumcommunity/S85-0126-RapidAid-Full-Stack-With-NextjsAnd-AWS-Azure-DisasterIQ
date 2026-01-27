import jwt from "jsonwebtoken";
import { NextResponse, type NextRequest } from "next/server";
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
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized: No token provided" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      ACCESS_TOKEN_SECRET
    ) as JwtPayload;

    let governmentName: string | null = null;

    if (decoded.governmentId) {
      const government = await GovernmentRepository.findById(
        decoded.governmentId
      );
      governmentName = government?.name ?? null;
    }

    // ✅ Clone headers and inject user context
    const requestHeaders = new Headers(req.headers);

    requestHeaders.set("x-user-id", decoded.userId);
    requestHeaders.set("x-user-role", decoded.role);

    if (decoded.governmentId) {
      requestHeaders.set("x-government-id", decoded.governmentId);
      if (governmentName) {
        requestHeaders.set("x-government-name", governmentName);
      }
    }

    if (decoded.policeId)
      requestHeaders.set("x-police-id", decoded.policeId);

    if (decoded.ngoId)
      requestHeaders.set("x-ngo-id", decoded.ngoId);

    if (decoded.hospitalId)
      requestHeaders.set("x-hospital-id", decoded.hospitalId);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Unauthorized: Invalid or expired token" },
      { status: 401 }
    );
  }
}
