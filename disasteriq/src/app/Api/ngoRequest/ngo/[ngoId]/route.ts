import { NextRequest } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { NGORequestFetchService } from "@/app/Service/ngoRequest_fetch.service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";

export async function GET(req: NextRequest) {
  try {
    const user = await authMiddleware(req);

    if (user.role !== "NGO_ADMIN") {
      return sendError(
        "Forbidden: Only NGO admins can access",
        "FORBIDDEN",
        403
      );
    }

    const ngoId = user.ngoId;
    if (!ngoId) {
      return sendError(
        "NGO ID missing in token",
        "NGO_ID_NOT_IN_TOKEN",
        400
      );
    }

    // ✅ THIS RETURNS NGORequest[]
    const data = await NGORequestFetchService.getRequestsByNgoId(ngoId);

    return sendSuccess(
      data,
      `Retrieved ${data.length} NGO request(s)`,
      200
    );
  } catch (error: any) {
    console.error("❌ GET NGO requests error:", error.message);

    return sendError(
      error.message || "Failed to fetch NGO requests",
      "FETCH_ERROR",
      500
    );
  }
}
