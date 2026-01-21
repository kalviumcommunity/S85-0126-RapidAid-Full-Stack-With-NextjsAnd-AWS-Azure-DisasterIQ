import { prisma } from "@/app/prisma/prisma";
import { hashPassword } from "@/app/lib/password";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  const body = await req.json();
  const { ngo, user } = body;

  // 🔒 validation
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

  // ✅ THIS IS THE KEY FIX
  const existingNGO = await prisma.nGO.findUnique({
    where: { registrationNumber: ngo.registrationNumber }
  });

  if (existingNGO) {
    return NextResponse.json(
      { message: "NGO already registered" },
      { status: 400 }
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    const createdNGO = await tx.nGO.create({
      data: {
        name: ngo.name,
        registrationNumber: ngo.registrationNumber,
        state: ngo.state,
        district: ngo.district,
        focusArea: ngo.focusArea,
        contactEmail: ngo.contactEmail,
        contactPhone: ngo.contactPhone
      }
    });

    const createdUser = await tx.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: await hashPassword(user.password),
        ngoId: createdNGO.id,
        roles: {
          create: {
            role: { connect: { name: "NGO_ADMIN" } }
          }
        }
      }
    });

    return { createdNGO, createdUser };
  });

  return NextResponse.json(
    {
      message: "NGO registered successfully",
      ngoId: result.createdNGO.id,
      userId: result.createdUser.id
    },
    { status: 201 }
  );
}