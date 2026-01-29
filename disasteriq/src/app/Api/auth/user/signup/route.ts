import { prisma } from "@/app/prisma/prisma";
import { hashPassword } from "@/app/lib/password";
import { NextResponse } from "next/server";
import { EmailService } from "@/app/Service/email_service";

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

  // 📧 Send welcome email (non-blocking - don't fail signup if email fails)
  EmailService.sendWelcomeEmail({
    to: email,
    userName: name,
    dashboardUrl: process.env.NEXT_PUBLIC_APP_URL 
      ? `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`
      : "https://rapidaid.app/dashboard",
  }).catch((error) => {
    console.error("Failed to send welcome email:", error);
    // Don't throw - signup should succeed even if email fails
  });

  return NextResponse.json({
    message: "User registered",
    userId: user.id
  });
}
