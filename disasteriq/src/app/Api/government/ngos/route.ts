import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";

export async function GET(req: NextRequest) {
  try {
    // -------------------------
    // AUTH + CONTEXT
    // -------------------------
    const user = await authMiddleware(req);

    if (user.role !== "GOVERNMENT_ADMIN") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }
    {
 
}

    if (!user.governmentState) {
      return NextResponse.json(
        { success: false, message: "Government state missing" },
        { status: 400 }
      );
    }

    // -------------------------
    // FETCH NGOs BY STATE
    // -------------------------
    const res = await fetch(
      `http://localhost:3000/Api/ngo/get?state=${encodeURIComponent(
        user.governmentState
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: "Failed to fetch NGOs" },
        { status: res.status }
      );
    }

    const ngos = await res.json();

    return NextResponse.json({
      success: true,
      state: user.governmentState,
      data: ngos,
    });
  } catch (error: any) {
    console.error("❌ get-by-government error:", error);

    if (error.message === "NO_TOKEN") {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
