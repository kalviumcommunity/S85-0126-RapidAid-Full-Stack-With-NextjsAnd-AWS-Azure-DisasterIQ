import { prisma } from "@/app/prisma/prisma";
import { hashPassword } from "@/app/lib/password";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { police, user } = await req.json();

  // 🔴 Check duplicate stationCode
  const existingStation = await prisma.police.findUnique({
    where: { stationCode: police.stationCode }
  });

  if (existingStation) {
    return NextResponse.json(
      { message: "Police station already exists" },
      { status: 400 }
    );
  }

  // 🔴 Check duplicate email
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email }
  });

  if (existingUser) {
    return NextResponse.json(
      { message: "User email already exists" },
      { status: 400 }
    );
  }

  // ✅ Create police + user atomically
  const result = await prisma.$transaction(async (tx) => {
    const createdPolice = await tx.police.create({
      data: {
        name: police.name,
        stationCode: police.stationCode,
        state: police.state,
        district: police.district,
        address: police.address,
        officerInCharge: police.officerInCharge,
        contactNumber: police.contactNumber
      }
    });

    const createdUser = await tx.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: await hashPassword(user.password),
        policeId: createdPolice.id,
        roles: {
          create: {
            role: { connect: { name: "POLICE_ADMIN" } }
          }
        }
      }
    });

    return { createdPolice, createdUser };
  });

  return NextResponse.json({
    message: "Police station created successfully",
    policeId: result.createdPolice.id,
    userId: result.createdUser.id
  });
}
