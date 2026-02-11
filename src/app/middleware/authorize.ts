import { NextRequest, NextResponse } from "next/server";
import { ROLES, Permission } from "@/app/config/roles";

export function authorize(requiredPermission: Permission) {
  return (req: NextRequest) => {
    const user = (req as any).user;
    const role = user?.role as keyof typeof ROLES;
    console.log(role);

    if (!role) {
      return NextResponse.json(
        { message: "Forbidden: role missing" },
        { status: 403 }
      );
    }

    const allowed = ROLES[role]?.includes(requiredPermission);

    console.log(
      `[RBAC] ${role} tried ${requiredPermission}: ${
        allowed ? "ALLOWED" : "DENIED"
      }`
    );

    if (!allowed) {
      return NextResponse.json(
        { message: "Access denied: insufficient permissions" },
        { status: 403 }
      );
    }

    return null; // ✅ allow
  };
}
