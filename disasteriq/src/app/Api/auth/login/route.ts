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

  // ✅ SAFE ROLE EXTRACTION
  const role = user.roles[0]?.role?.name ?? null;

  if (!role) {
    return NextResponse.json(
      { message: "User role not assigned" },
      { status: 403 }
    );
  }

  if (role === "GOVERNMENT_ADMIN" && !user.governmentId) {
    return NextResponse.json(
      { message: "Government account not linked" },
      { status: 403 }
    );
  }

  // -------------------------
  // ✅ RESOLVE STATE BASED ON ROLE
  // -------------------------
  let resolvedState: string | null = null;

  switch (role) {
    case "CITIZEN":
      resolvedState = user.state;
      break;

    case "NGO_ADMIN":
      resolvedState = user.ngo?.state ?? null;
      break;

    case "GOVERNMENT_ADMIN":
      resolvedState = user.government?.state ?? null;
      break;

    case "POLICE":
      resolvedState = user.police?.state ?? null;
      break;

    case "HOSPITAL":
      resolvedState = user.hospital?.state ?? null;
      break;
  }

  // -------------------------
  // ✅ JWT PAYLOAD
  // -------------------------
  const accessToken = generateAccessToken({
    userId: user.id,
    role,
    ngoId: user.ngoId,
    governmentId: user.governmentId,
    policeId: user.policeId,
    hospitalId: user.hospitalId,
    state: resolvedState,
  });

  // ✅ FIXED: correct refresh token call
  const refreshToken = generateRefreshToken(user.id);

  // -------------------------
  // ✅ REDIRECT BY ROLE
  // -------------------------
  const redirectMap: Record<string, string> = {
    GOVERNMENT_ADMIN: "/government",
    POLICE: "/police/dashboard",
    NGO_ADMIN: "/responder",
    HOSPITAL: "/hospital/dashboard",
    CITIZEN: "/public",
  };

  const response = NextResponse.json({
    message: "Login successful",
    role,
    redirect: redirectMap[role] ?? "/public",
  });

  // -------------------------
  // 🍪 ACCESS TOKEN COOKIE
  // -------------------------
  response.cookies.set("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60,
  });

  // -------------------------
  // 🍪 REFRESH TOKEN COOKIE
  // -------------------------
  response.cookies.set("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
