import { NextResponse } from "next/server";
import { NGOService } from "@/app/Service/ngo_service";

export const runtime = "nodejs";

export async function GET(req:any) {
  try {
    const { searchParams } = new URL(req.url);
    const state = searchParams.get("state");

    const ngos = await NGOService.getByState(state);

    return NextResponse.json(
      {
        count: ngos.length,
        ngos,
      },
      { status: 200 }
    );
  } catch (error) {
  if (error instanceof Error) {
    if (error.message === "STATE_REQUIRED") {
      return NextResponse.json(
        { message: "State query parameter is required" },
        { status: 400 }
      );
    }

    console.error("GET NGO BY STATE ERROR:", error.message);
  }

  return NextResponse.json(
    { message: "Internal server error" },
    { status: 500 }
  );
}

}
