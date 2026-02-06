/**
 * GET /api/ngo-requests/disaster/:disasterId
 * 
 * Fetch all NGO requests for a specific disaster with pagination
 * 
 * Path Parameters:
 * - disasterId: string (UUID)
 * 
 * Query Parameters:
 * - page: number (default: 1)
 * - pageSize: number (default: 10, max: 100)
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string,
 *   data: NGORequest[],
 *   pagination: { page, pageSize, total, totalPages },
 *   timestamp: ISO8601
 * }
 */

import { NextRequest } from "next/server";
import { NGORequestFetchService } from "@/app/Service/ngoRequest_fetch.service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { authMiddleware } from "@/app/middleware/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { disasterId: string } }
) {
  try {
    // ✅ Authentication + Authorization
    const user = await authMiddleware(req);

    if (user.role !== "GOVERNMENT_ADMIN" && user.role !== "NGO_ADMIN") {
      return sendError("Forbidden: Only Government and NGO admins can access", "FORBIDDEN", 403);
    }

    const { disasterId } = params;
    const { searchParams } = req.nextUrl;

    if (!disasterId) {
      return sendError("Disaster ID is required", "MISSING_DISASTER_ID", 400);
    }

    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    const result = await NGORequestFetchService.getRequestsByDisasterId(
      disasterId,
      {
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
      }
    );

    return sendSuccess(
      result.data,
      `Retrieved ${result.data.length} NGO request(s) for disaster`,
      200
    );
  } catch (error: any) {
    console.error(
      `❌ GET /api/ngo-requests/disaster/:disasterId error:`,
      error.message
    );

    // Handle specific error cases
    if (error.message === "INVALID_DISASTER_ID") {
      return sendError(
        "Invalid disaster ID format",
        "INVALID_DISASTER_ID",
        400
      );
    }

    return sendError(
      error.message || "Failed to fetch NGO requests for disaster",
      "FETCH_ERROR",
      500,
      error
    );
  }
}
