import { prisma } from "@/app/prisma/prisma";
import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { requireRole } from "@/app/middleware/requireRole";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
 
  const auth = authMiddleware(req);
  if (auth) return auth;

  
  const roleCheck = requireRole(req, ["POLICE_ADMIN"]);
  if (roleCheck) return roleCheck;

  
  const user = (req as any).user;

  if (!user?.policeId) {
    return NextResponse.json(
      { message: "Police access required" },
      { status: 403 }
    );
  }

  const police = await prisma.police.findUnique({
    where: { id: user.policeId },
    include: {
      users: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!police) {
    return NextResponse.json(
      { message: "Police station not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(police);
}
