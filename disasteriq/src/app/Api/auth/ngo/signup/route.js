import { prisma } from "@/app/prisma/prisma";
import { hashPassword } from "@/app/lib/password";
import { sanitizeInput } from "@/app/lib/sanitize";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  const body = await req.json();
  const { ngo, user } = body;

  // 🔒 Required field validation
  if (
    !ngo?.name ||
    !ngo?.registrationNumber ||
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
    registrationNumber: sanitizeInput(ngo.registrationNumber),
    state: sanitizeInput(ngo.state),
    district: sanitizeInput(ngo.district),
    focusArea: sanitizeInput(ngo.focusArea),
    contactEmail: sanitizeInput(ngo.contactEmail)?.toLowerCase(),
    contactPhone: sanitizeInput(ngo.contactPhone),
  };

  // 🧼 Sanitize User inputs (except password)
  const cleanUser = {
    name: sanitizeInput(user.name),
    email: sanitizeInput(user.email).toLowerCase(),
  };

  // 🔒 Check duplicate NGO
  const existingNGO = await prisma.nGO.findUnique({
    where: { registrationNumber: cleanNGO.registrationNumber },
  });

  if (existingNGO) {
    return NextResponse.json(
      { message: "NGO already registered" },
      { status: 400 }
    );
  }

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

  // ✅ Atomic creation
  const result = await prisma.$transaction(async (tx) => {
    const createdNGO = await tx.nGO.create({
      data: cleanNGO,
    });

    const createdUser = await tx.user.create({
      data: {
        ...cleanUser,
        passwordHash: await hashPassword(user.password), // ❗ never sanitize passwords
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
      userId: result.createdUser.id,
    },
    { status: 201 }
  );
}