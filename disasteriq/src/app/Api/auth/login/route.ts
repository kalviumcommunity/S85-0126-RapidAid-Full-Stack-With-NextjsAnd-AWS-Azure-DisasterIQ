import { comparePassword } from "@/app/lib/password";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/app/lib/jwt";
import { sanitizeInput } from "@/app/lib/sanitize";
import { NextResponse } from "next/server";
import { findUserForAuthByEmail } from "@/app/repositories/user.repository";

export async function POST(req: Request) {
  const body = await req.json();

  const email = sanitizeInput(body.email)?.toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }

  // ✅ FETCH FULL AUTH USER
  const user = await findUserForAuthByEmail(email);

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

  const role = user.roles[0]?.role.name;

  // 🛡 SAFETY CHECK
  if (role === "GOVERNMENT_ADMIN" && !user.governmentId) {
    return NextResponse.json(
      { message: "Government account not linked" },
      { status: 403 }
    );
  }

  // ✅ JWT WITH ORG IDS
  const accessToken = generateAccessToken({
    userId: user.id,
    role,
    governmentId: user.governmentId,
    policeId: user.policeId,
    ngoId: user.ngoId,
    hospitalId: user.hospitalId,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  const response = NextResponse.json({
    accessToken,
    redirect:
      user.governmentId
        ? "/government/dashboard"
        : user.policeId
        ? "/police/dashboard"
        : user.ngoId
        ? "/ngo/dashboard"
        : user.hospitalId
        ? "/hospital/dashboard"
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
