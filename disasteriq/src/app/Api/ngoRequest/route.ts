/**
 * GET /api/ngo-requests
 * 
 * Fetch all NGO requests with pagination
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

export async function GET(req: NextRequest) {
  try {
    // ✅ Authentication + Authorization
    const user = await authMiddleware(req);

    if (user.role !== "GOVERNMENT_ADMIN" && user.role !== "NGO_ADMIN") {
      return sendError("Forbidden: Only Government and NGO admins can access", "FORBIDDEN", 403);
    }

    const { searchParams } = req.nextUrl;

    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    const result = await NGORequestFetchService.getAllRequests({
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });

    return sendSuccess(
      result.data,
      `Retrieved ${result.data.length} NGO request(s)`,
      200
    );
  } catch (error: any) {
    console.error("❌ GET /api/ngo-requests error:", error.message);

    return sendError(
      error.message || "Failed to fetch NGO requests",
      "FETCH_ERROR",
      500,
      error
    );
  }
}

