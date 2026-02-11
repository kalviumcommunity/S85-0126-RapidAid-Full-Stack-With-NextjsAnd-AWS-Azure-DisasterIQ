import { prisma } from "@/app/prisma/prisma";
import { hashPassword } from "@/app/lib/password";
import { sanitizeInput } from "@/app/lib/sanitize";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { hospital, user } = await req.json();

  const cleanHospital = {
    name: sanitizeInput(hospital.name),
    type: sanitizeInput(hospital.type),
    state: sanitizeInput(hospital.state),
    district: sanitizeInput(hospital.district),
    address: sanitizeInput(hospital.address),
    contactNumber: sanitizeInput(hospital.contactNumber),
    totalBeds: hospital.totalBeds,
    availableBeds: hospital.availableBeds,
    emergencyBeds: hospital.emergencyBeds,
  };

  const cleanUser = {
    name: sanitizeInput(user.name),
    email: sanitizeInput(user.email).toLowerCase(),
  };

  const createdHospital = await prisma.hospital.create({
    data: cleanHospital,
  });

  const createdUser = await prisma.user.create({
    data: {
      ...cleanUser,
      passwordHash: await hashPassword(user.password), // ❗ DO NOT sanitize passwords
      hospitalId: createdHospital.id,
      roles: {
        create: {
          role: { connect: { name: "HOSPITAL_ADMIN" } },
        },
      },
    },
  });

  return NextResponse.json({
    hospitalId: createdHospital.id,
    userId: createdUser.id,
  });
}