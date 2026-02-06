import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/jwt";

export async function GET() {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "No token found" },
        { status: 401 }
      );
    }

    // Verify token
    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 401 }
    );
  }
}
