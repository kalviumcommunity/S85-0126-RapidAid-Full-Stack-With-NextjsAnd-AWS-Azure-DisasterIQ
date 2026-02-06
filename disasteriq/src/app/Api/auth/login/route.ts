import { comparePassword } from "@/app/lib/password";
import {
  generateAccessToken,
  generateRefreshToken,
} from "@/app/lib/jwt";
import { sanitizeInput } from "@/app/lib/sanitize";
import { NextResponse } from "next/server";
import { findUserForAuthByEmail } from "@/app/repositories/user.repository";
import { GovernmentRepository } from "@/app/repositories/government.repository";
import { prisma } from "@/app/prisma/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const email = sanitizeInput(body.email)?.toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and Password Required" },
      { status: 400 }
    );
  }

  const user = await findUserForAuthByEmail(email);

  if (!user) {
    return NextResponse.json(
      { message: "Invalid Credentials" },
      { status: 401 }
    );
  }

  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    return NextResponse.json(
      { message: "Invalid Credentials" },
      { status: 401 }
    );
  }

  const role = user.roles[0]?.role.name;

  if (role === "GOVERNMENT_ADMIN" && !user.governmentId) {
    return NextResponse.json(
      { message: "Government account not linked" },
      { status: 403 }
    );
  }

  // -------------------------
  // FETCH STATE INFO
  // -------------------------
  let governmentState: string | undefined;
  let state: string | undefined;

  if (role === "GOVERNMENT_ADMIN" && user.governmentId) {
    const government = await GovernmentRepository.findById(user.governmentId);
   governmentState = government?.state ?? undefined;
    state = governmentState;
  }

  if (user.ngoId) {
    const ngo = await prisma.nGO.findUnique({ where: { id: user.ngoId } });
    if (ngo?.state) state = ngo.state;
  }

  // -------------------------
  // JWTs
  // -------------------------
  const accessToken = generateAccessToken({
    userId: user.id,
    role,
    governmentId: user.governmentId,
    governmentState,
    policeId: user.policeId,
    ngoId: user.ngoId,
    hospitalId: user.hospitalId,
    state,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  // -------------------------
  // RESPONSE
  // -------------------------
  const response = NextResponse.json({
    role,
    redirect:
      user.governmentId
        ? "/government"
        : user.policeId
        ? "/police/dashboard"
        : user.ngoId
        ? "/responder"
        : user.hospitalId
        ? "/hospital/dashboard"
        : "/user/home",
  });

  // ✅ ACCESS TOKEN COOKIE
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60, // 15 minutes
  });

  // ✅ REFRESH TOKEN COOKIE
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
