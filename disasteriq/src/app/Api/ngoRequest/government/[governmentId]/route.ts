/**
 * GET /api/ngo-requests/government/:governmentId
 * 
 * Fetch all NGO requests for a specific government with pagination
 * 
 * Path Parameters:
 * - governmentId: string (UUID)
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
  { params }: { params: { governmentId: string } }
) {
  try {
    // ✅ Authentication + Authorization
    const user = await authMiddleware(req);

    if (user.role !== "GOVERNMENT_ADMIN" && user.role !== "NGO_ADMIN") {
      return sendError("Forbidden: Only Government and NGO admins can access", "FORBIDDEN", 403);
    }

    const { governmentId } = params;
    const { searchParams } = req.nextUrl;

    if (!governmentId) {
      return sendError(
        "Government ID is required",
        "MISSING_GOVERNMENT_ID",
        400
      );
    }

    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    const result = await NGORequestFetchService.getRequestsByGovernmentId(
      governmentId,
      {
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
      }
    );

    return sendSuccess(
      result.data,
      `Retrieved ${result.data.length} NGO request(s) for government`,
      200
    );
  } catch (error: any) {
    console.error(
      `❌ GET /api/ngo-requests/government/:governmentId error:`,
      error.message
    );

    // Handle specific error cases
    if (error.message === "INVALID_GOVERNMENT_ID") {
      return sendError(
        "Invalid government ID format",
        "INVALID_GOVERNMENT_ID",
        400
      );
    }

    return sendError(
      error.message || "Failed to fetch NGO requests for government",
      "FETCH_ERROR",
      500,
      error
    );
  }
}