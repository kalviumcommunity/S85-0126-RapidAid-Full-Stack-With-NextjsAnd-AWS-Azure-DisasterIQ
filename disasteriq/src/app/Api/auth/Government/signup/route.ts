import { prisma } from "@/app/prisma/prisma";
import { hashPassword } from "@/app/lib/password";
import { sanitizeInput } from "@/app/lib/sanitize";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { government, user } = body ?? {};

    if (!government || !user || !user.password) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }

    // ------------------------
    // SANITIZE INPUT
    // ------------------------
    const cleanGovernment = {
      name: sanitizeInput(government.name),
      level: sanitizeInput(government.level),
      state: government.state ? sanitizeInput(government.state) : null,
      district: government.district ? sanitizeInput(government.district) : null,
      department: sanitizeInput(government.department),
      contactEmail: sanitizeInput(government.contactEmail).toLowerCase(),
      contactPhone: sanitizeInput(government.contactPhone),
    };

    const cleanUser = {
      name: sanitizeInput(user.name),
      email: sanitizeInput(user.email).toLowerCase(),
    };

    // ------------------------
    // CHECK EXISTING
    // ------------------------
    const [existingGovernment, existingUser] = await Promise.all([
      prisma.government.findUnique({
        where: { contactEmail: cleanGovernment.contactEmail },
      }),
      prisma.user.findUnique({
        where: { email: cleanUser.email },
      }),
    ]);

    if (existingGovernment) {
      return NextResponse.json(
        { message: "Government already exists with this email" },
        { status: 400 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { message: "User email already exists" },
        { status: 400 }
      );
    }

    // ------------------------
    // CREATE (TRANSACTION)
    // ------------------------
    const passwordHash = await hashPassword(user.password);

    const result = await prisma.$transaction(async (tx) => {
      const createdGovernment = await tx.government.create({
        data: cleanGovernment,
      });

      const createdUser = await tx.user.create({
        data: {
          ...cleanUser,
          passwordHash,
          governmentId: createdGovernment.id,
          roles: {
            create: {
              role: {
                connect: { name: "GOVERNMENT_ADMIN" },
              },
            },
          },
        },
      });

      return { createdGovernment, createdUser };
    });

    // ------------------------
    // RESPONSE
    // ------------------------
    return NextResponse.json(
      {
        message: "Government created successfully",
        governmentId: result.createdGovernment.id,
        userId: result.createdUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create government error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
