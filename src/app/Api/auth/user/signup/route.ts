import { prisma } from "@/app/prisma/prisma";
import { hashPassword } from "@/app/lib/password";
import { sanitizeInput } from "@/app/lib/sanitize";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SignupRequestBody {
    name: string;
    email: string;
    password: string;
    phone?: string;
    state?: string;
}

interface CleanUser {
    name: string;
    email: string;
    phone: string | null;
    state: string | null;
}

export async function POST(req: NextRequest) {
    try {
        const body: SignupRequestBody = await req.json();
        const { name, email, password, phone, state } = body;

        // 🔒 Required field validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Name, email, and password are required" },
                { status: 400 }
            );
        }

        // 🧼 Sanitize inputs
        const cleanUser: CleanUser = {
            name: sanitizeInput(name),
            email: sanitizeInput(email).toLowerCase(),
            phone: phone ? sanitizeInput(phone) : null,
            state: state ? sanitizeInput(state) : null,
        };

        // 🔒 Check duplicate user email
        const existingUser = await prisma.user.findUnique({
            where: { email: cleanUser.email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User email already exists" },
                { status: 409 }
            );
        }

        // 🔐 Hash password (never sanitize passwords)
        const passwordHash = await hashPassword(password);

        // ✅ Create user with CITIZEN role
        const createdUser = await prisma.user.create({
            data: {
                ...cleanUser,
                passwordHash,
                isActive: true,
                roles: {
                    create: {
                        role: {
                            connectOrCreate: {
                                where: { name: "CITIZEN" },
                                create: { name: "CITIZEN" },
                            },
                        },
                    },
                },
            },
            include: {
                roles: {
                    include: {
                        role: {
                            select: { name: true },
                        },
                    },
                },
            },
        });

        
        // ✅ Return sanitized response (no passwordHash)
        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully",
                data: {
                    userId: createdUser.id,
                    name: createdUser.name,
                    email: createdUser.email,
                    phone: createdUser.phone,
                    state: createdUser.state,
                    isActive: createdUser.isActive,
                    createdAt: createdUser.createdAt,
                    roles: createdUser.roles.map((ur) => ur.role.name),
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Signup error:", error);

        // Handle duplicate email error
        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === "P2002" &&
            "meta" in error &&
            error.meta &&
            typeof error.meta === "object" &&
            "target" in error.meta &&
            Array.isArray(error.meta.target) &&
            error.meta.target.includes("email")
        ) {
            return NextResponse.json(
                { message: "User email already exists" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "An error occurred during signup",
                error:
                    process.env.NODE_ENV === "development" &&
                    error &&
                    typeof error === "object" &&
                    "message" in error
                        ? (error as Error).message
                        : undefined,
            },
            { status: 500 }
        );
    }
}

/**
 * GET handler for documentation
 */
