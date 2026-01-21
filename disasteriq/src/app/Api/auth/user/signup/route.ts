import { prisma } from "@/app/prisma/prisma";
import { hashPassword } from "@/app/lib/password";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password, phone } = body;

  // 🔒 REQUIRED FIELD CHECK
  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "name, email and password are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    return NextResponse.json(
      { message: "Email already exists" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      passwordHash: await hashPassword(password),
      roles: {
        create: {
          role: {
            connect: { name: "USER" }
          }
        }
      }
    }
  });

  return NextResponse.json({
    message: "User registered",
    userId: user.id
  });
}
