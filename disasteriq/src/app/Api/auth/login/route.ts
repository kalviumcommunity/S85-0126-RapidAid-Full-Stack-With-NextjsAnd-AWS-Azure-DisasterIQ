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

  // ✅ FETCH FULL AUTH USER
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

  // 🛡 SAFETY CHECK
  if (role === "GOVERNMENT_ADMIN" && !user.governmentId) {
    return NextResponse.json(
      { message: "Government account not linkedd" },
      { status: 403 }
    );
  }

  // -------------------------
  // FETCH GOVERNMENT / NGO STATE
  // -------------------------
  let governmentState: string | undefined;
  let state: string | undefined;

  if (role === "GOVERNMENT_ADMIN" && user.governmentId) {
    const government = await GovernmentRepository.findById(user.governmentId);
    governmentState = government?.state ?? undefined;
    state = governmentState;
  }

  // If NGO user, fetch NGO state and include as `state` in payload
  if (user.ngoId) {
    const ngo = await prisma.nGO.findUnique({ where: { id: user.ngoId } });
    if (ngo?.state) state = ngo.state;
  }

  // -------------------------
  // JWT WITH STATE INCLUDED
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

  const response = NextResponse.json({
    accessToken,
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

  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/auth/refresh",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
