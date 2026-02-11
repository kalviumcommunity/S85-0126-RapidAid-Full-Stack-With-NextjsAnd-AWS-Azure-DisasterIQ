import { prisma } from "@/app/prisma/prisma";
import { hashPassword } from "@/app/lib/password";
import { sanitizeInput } from "@/app/lib/sanitize";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// 🔢 Registration number generator
function generateRegistrationNumber(state) {
  const code = state.slice(0, 2).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NGO-${code}-${Date.now()}-${random}`;
}

export async function POST(req) {
  const body = await req.json();
  const { ngo, user } = body;

  // 🔒 Required field validation
  if (
    !ngo?.name ||
    !ngo?.state ||
    !ngo?.focusArea ||
    !ngo?.contactEmail ||
    !ngo?.contactPhone ||
    !user?.email ||
    !user?.password
  ) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  // 🧼 Sanitize NGO inputs
  const cleanNGO = {
    name: sanitizeInput(ngo.name),
    state: sanitizeInput(ngo.state),
    focusArea: sanitizeInput(ngo.focusArea),
    contactEmail: sanitizeInput(ngo.contactEmail).toLowerCase(),
    contactPhone: sanitizeInput(ngo.contactPhone),
  };

  // 🧼 Sanitize User inputs
  const cleanUser = {
    name: sanitizeInput(user.name),
    email: sanitizeInput(user.email).toLowerCase(),
  };

  // 🔒 Check duplicate user email
  const existingUser = await prisma.user.findUnique({
    where: { email: cleanUser.email },
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User email already exists" },
      { status: 400 }
    );
  }

  // 🔢 Generate unique registration number
  const registrationNumber = generateRegistrationNumber(cleanNGO.state);

  // ✅ Atomic creation (NGO + NGO_ADMIN)
  const result = await prisma.$transaction(async (tx) => {
    const createdNGO = await tx.nGO.create({
      data: {
        ...cleanNGO,
        registrationNumber,
      },
    });

    const createdUser = await tx.user.create({
      data: {
        ...cleanUser,
        passwordHash: await hashPassword(user.password), // 🔐 never sanitize passwords
        ngoId: createdNGO.id,
        roles: {
          create: {
            role: { connect: { name: "NGO_ADMIN" } },
          },
        },
      },
    });

    return { createdNGO, createdUser };
  });

  return NextResponse.json(
    {
      message: "NGO registered successfully",
      ngoId: result.createdNGO.id,
      registrationNumber: result.createdNGO.registrationNumber,
      userId: result.createdUser.id,
    },
    { status: 201 }
  );
}
