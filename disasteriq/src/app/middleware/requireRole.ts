;

import { NextRequest, NextResponse } from "next/server";

export function requireRole(
  req: NextRequest,
  allowedRoles: string[]
) {
  const user = (req as any).user;

  if (!user || !Array.isArray(user.roles)) {
    return NextResponse.json(
      { message: "Forbidden: No roles" },
      { status: 403 }
    );
  }

  const hasRole = allowedRoles.some(role =>
    user.roles.includes(role)
  );

  if (!hasRole) {
    return NextResponse.json(
      { message: "Forbidden: Insufficient role" },
      { status: 403 }
    );
  }

  return null; // ✅ allow
}