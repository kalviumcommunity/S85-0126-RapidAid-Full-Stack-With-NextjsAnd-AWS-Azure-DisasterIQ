import { prisma } from "@/app/prisma/prisma";
import { comparePassword } from "@/app/lib/password";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/app/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      roles: { include: { role: true } },
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const roles = user.roles.map((r) => r.role.name);

  
  const accessToken = generateAccessToken({
    id: user.id,
    role: roles[0],
  });


  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  
  const response = NextResponse.json({
    accessToken,
    redirect:
      user.ngoId
        ? "/ngo/dashboard"
        : user.hospitalId
        ? "/hospital/dashboard"
        : user.policeId
        ? "/police/dashboard"
        : user.governmentId
        ? "/government/dashboard"
        : "/user/home",
  });

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/auth/refresh",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}
