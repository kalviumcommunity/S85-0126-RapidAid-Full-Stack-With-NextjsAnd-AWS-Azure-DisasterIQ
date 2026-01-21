import { prisma } from "@/app/prisma/prisma";
import { hashPassword } from "@/app/lib/password";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
  const { hospital, user } = await req.json();

  const createdHospital = await prisma.hospital.create({
    data: {
      name: hospital.name,
      type: hospital.type,
      state: hospital.state,
      district: hospital.district,
      address: hospital.address,
      totalBeds: hospital.totalBeds,
      availableBeds: hospital.availableBeds,
      emergencyBeds: hospital.emergencyBeds,
      contactNumber: hospital.contactNumber
    }
  });

  const createdUser = await prisma.user.create({
    data: {
      name: user.name,
      email: user.email,
      passwordHash: await hashPassword(user.password),
      hospitalId: createdHospital.id,
      roles: {
        create: {
          role: { connect: { name: "HOSPITAL_ADMIN" } }
        }
      }
    }
  });

  return NextResponse.json({
    hospitalId: createdHospital.id,
    userId: createdUser.id
  });
}
