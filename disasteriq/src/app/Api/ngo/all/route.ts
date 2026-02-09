import { NextResponse } from "next/server";
import { NGOService } from "@/app/Service/ngo_service";

export const runtime = "nodejs";

/**
 * GET /api/ngo/all
 * Fetch all NGOs (Public - No Authentication Required)
 * 
 * Response:
 * {
 *   success: boolean,
 *   count: number,
 *   data: NGO[]
 * }
 */
export async function GET() {
  try {
    const ngos = await NGOService.getAll();

    return NextResponse.json(
      {
        success: true,
        count: ngos.length,
        data: ngos,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/ngo/all] Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
