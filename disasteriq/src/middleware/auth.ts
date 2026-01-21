import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET!;

export function authMiddleware(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized: No token" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // ✅ Attach decoded data directly to req (route-safe)
    (req as any).user = {
      userId: decoded.userId,
      roles: decoded.roles,
      ngoId: decoded.ngoId,
      hospitalId: decoded.hospitalId,
      policeId: decoded.policeId,
      governmentId: decoded.governmentId
    };

    return null; // ✅ allow request to continue
  } catch {
    return NextResponse.json(
      { message: "Unauthorized: Invalid token" },
      { status: 401 }
    );
  }
}
