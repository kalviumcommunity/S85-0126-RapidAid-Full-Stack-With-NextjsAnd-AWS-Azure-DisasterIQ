import { prisma } from "@/app/prisma/prisma";
import { comparePassword } from "@/app/lib/password";


import { signToken } from "@/app/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: { include: { role: true } }
    }
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const roles = user.roles.map(r => r.role.name);

  const token = signToken({
    userId: user.id,
    roles,
    ngoId: user.ngoId,
    hospitalId: user.hospitalId,
    governmentId: user.governmentId,
    policeId: user.policeId
  });

  return NextResponse.json({
    token,
    redirect:
      user.ngoId ? "/ngo/dashboard" :
      user.hospitalId ? "/hospital/dashboard" :
      "/user/home"
  });
}
