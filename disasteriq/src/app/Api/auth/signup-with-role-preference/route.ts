import { NextResponse, NextRequest } from "next/server";
import { hashPassword } from "@/app/lib/password";
import { prisma } from "@/app/prisma/prisma";
import { sanitizeInput } from "@/app/lib/sanitize";
import { RolePreferenceRequestRepository } from "@/app/repositories/rolePreferenceRequest.repository";

/**
 * API Route: POST /api/auth/signup-with-role-preference
 * Allows a user to sign up and submit a role preference request for a specific NGO
 *
 * Request body:
 * {
 *   "name": "John Doe",
 *   "email": "john@example.com",
 *   "password": "securePassword123",
 *   "phone": "1234567890",
 *   "ngoId": "uuid-of-ngo",
 *   "state": "Maharashtra",
 *   "preferredRole": "MEDICAL_VOLUNTEER"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone, ngoId, state, preferredRole } = body;

    // -------------------------
    // 1. Validate input
    // -------------------------
    if (!name || !email || !password || !ngoId || !state || !preferredRole) {
      return NextResponse.json(
        {
          error: "Missing required fields: name, email, password, ngoId, state, preferredRole",
        },
        { status: 400 }
      );
    }

    const sanitizedEmail = sanitizeInput(email)?.toLowerCase();
    if (!sanitizedEmail) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // -------------------------
    // 2. Check if email already exists
    // -------------------------
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // -------------------------
    // 3. Verify NGO exists and state matches
    // -------------------------
    const ngo = await prisma.nGO.findUnique({
      where: { id: ngoId },
    });

    if (!ngo) {
      return NextResponse.json(
        { error: "NGO not found" },
        { status: 404 }
      );
    }

    if (ngo.state !== state) {
      return NextResponse.json(
        {
          error: "State mismatch: NGO operates in a different state",
        },
        { status: 400 }
      );
    }

    // -------------------------
    // 4. Hash password
    // -------------------------
    const passwordHash = await hashPassword(password);

    // -------------------------
    // 5. Create user
    // -------------------------
    const user = await prisma.user.create({
      data: {
        name,
        email: sanitizedEmail,
        phone: phone || undefined,
        passwordHash,
        isActive: true,
      },
    });

    // -------------------------
    // 6. Create role preference request
    // -------------------------
    const roleRequest = await RolePreferenceRequestRepository.create({
      userId: user.id,
      ngoId,
      state,
      preferredRole,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully and role preference request submitted",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        rolePreferenceRequest: {
          id: roleRequest.id,
          status: roleRequest.status,
          preferredRole: roleRequest.preferredRole,
          ngo: roleRequest.ngo,
          createdAt: roleRequest.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup with role preference error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
