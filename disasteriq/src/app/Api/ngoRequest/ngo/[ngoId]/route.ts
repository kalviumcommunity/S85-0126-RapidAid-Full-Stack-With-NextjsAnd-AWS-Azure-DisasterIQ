import { NextRequest } from "next/server";
import { NGORequestFetchService } from "@/app/Service/ngoRequest_fetch.service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { authMiddleware } from "@/app/middleware/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ngoId: string }> }
) {
  try {
    // ✅ Authentication + Authorization
    const user = await authMiddleware(req);

    if (user.role !== "GOVERNMENT_ADMIN" && user.role !== "NGO_ADMIN") {
      return sendError("Forbidden: Only Government and NGO admins can access", "FORBIDDEN", 403);
    }

    const { ngoId } = await params;
    const { searchParams } = req.nextUrl;

    if (!ngoId) {
      return sendError("NGO ID is required", "MISSING_NGO_ID", 400);
    }

    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    const result = await NGORequestFetchService.getRequestsByNgoId(ngoId, {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });

    return sendSuccess(
      result.data,
      `Retrieved ${result.data.length} NGO request(s) for NGO`,
      200
    );
  } catch (error: any) {
    console.error(
      `❌ GET /api/ngo-requests/ngo/:ngoId error:`,
      error.message
    );

    // Handle specific error cases
    if (error.message === "INVALID_NGO_ID") {
      return sendError("Invalid NGO ID format", "INVALID_NGO_ID", 400);
    }

    return sendError(
      error.message || "Failed to fetch NGO requests for NGO",
      "FETCH_ERROR",
      500,
      error
    );
  }
}
