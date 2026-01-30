import { NextResponse } from "next/server";
import { NGORequestService } from "@/app/Service/ngoRequest_service";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { disasterId, ngoId } = body;

    if (!disasterId || !ngoId) {
      return NextResponse.json(
        { message: "disasterId and ngoId are required" },
        { status: 400 }
      );
    }

    // 🔐 Auth headers (set by middleware)
    const h = await headers();
    const userId = h.get("x-user-id");
    const governmentId = h.get("x-government-id");

    if (!userId || !governmentId) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const ngoRequest = await NGORequestService.createRequest({
      disasterId,
      ngoId,
      governmentId,
      userId,
    });

    return NextResponse.json(
      { message: "NGO request created", data: ngoRequest },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Something went wrong" },
      { status: 500 }
    );
  }
}
