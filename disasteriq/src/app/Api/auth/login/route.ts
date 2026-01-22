import { prisma } from "@/app/prisma/prisma";
import { comparePassword } from "@/app/lib/password";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/app/lib/jwt";
import { sanitizeInput } from "@/app/lib/sanitize";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const email = sanitizeInput(body.email)?.toLowerCase();
  const password = body.password;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } } },
  });

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  const role = user.roles[0]?.role.name;

  const accessToken = generateAccessToken({ id: user.id, role });
  const refreshToken = generateRefreshToken({ id: user.id });

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
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}