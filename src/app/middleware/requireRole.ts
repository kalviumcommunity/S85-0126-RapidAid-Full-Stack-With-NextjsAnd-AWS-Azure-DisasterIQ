import { NextRequest, NextResponse } from "next/server";

export function requireRole(
  req: NextRequest,
  allowedRoles: string[]
) {
  const user = (req as any).user;

  if (!user?.role) {
    return NextResponse.json(
      { message: "Forbidden: role missing" },
      { status: 403 }
    );
  }

  if (!allowedRoles.includes(user.role)) {
    console.log(
      `[RBAC] ${user.role} attempted restricted action: DENIED`
    );

    return NextResponse.json(
      { message: "Forbidden: insufficient role" },
      { status: 403 }
    );
  }

  console.log(
    `[RBAC] ${user.role} attempted restricted action: ALLOWED`
  );

  return null;
}
