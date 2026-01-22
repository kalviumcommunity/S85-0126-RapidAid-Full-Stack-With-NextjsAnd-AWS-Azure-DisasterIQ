import { prisma } from "@/app/prisma/prisma";
import { hashPassword } from "@/app/lib/password";
import { sanitizeInput } from "@/app/lib/sanitize";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { police, user } = body ?? {};

    if (!police || !user || !user.password) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }
    
    const cleanPolice = {
      name: sanitizeInput(police.name),
      stationCode: sanitizeInput(police.stationCode),
      state: sanitizeInput(police.state),
      district: sanitizeInput(police.district),
      address: sanitizeInput(police.address),
      officerInCharge: sanitizeInput(police.officerInCharge),
      contactNumber: sanitizeInput(police.contactNumber),
    };

    const cleanUser = {
      name: sanitizeInput(user.name),
      email: sanitizeInput(user.email).toLowerCase(),
    };

    const [existingStation, existingUser] = await Promise.all([
      prisma.police.findUnique({
        where: { stationCode: cleanPolice.stationCode },
      }),
      prisma.user.findUnique({
        where: { email: cleanUser.email },
      }),
    ]);

    if (existingStation) {
      return NextResponse.json(
        { message: "Police station already exists" },
        { status: 400 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { message: "User email already exists" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(user.password);

    const result = await prisma.$transaction(async (tx) => {
      const createdPolice = await tx.police.create({
        data: cleanPolice,
      });

      const createdUser = await tx.user.create({
        data: {
          ...cleanUser,
          passwordHash,
          policeId: createdPolice.id,
          roles: {
            create: {
              role: {
                connect: { name: "POLICE_ADMIN" },
              },
            },
          },
        },
      });

      return { createdPolice, createdUser };
    });

    return NextResponse.json(
      {
        message: "Police station created successfully",
        policeId: result.createdPolice.id,
        userId: result.createdUser.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create police station error:", error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
