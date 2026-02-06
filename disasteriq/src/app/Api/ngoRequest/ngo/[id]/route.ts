/**
 * GET /api/ngo-requests/:id
 * 
 * Fetch NGO request by ID
 * 
 * Path Parameters:
 * - id: string (UUID)
 * 
 * Response:
 * {
 *   success: boolean,
 *   message: string,
 *   data: NGORequest,
 *   timestamp: ISO8601
 * }
 */

import { NextRequest } from "next/server";
import { NGORequestFetchService } from "@/app/Service/ngoRequest_fetch.service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { authMiddleware } from "@/app/middleware/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ Authentication + Authorization
    const user = await authMiddleware(req);

    if (user.role !== "GOVERNMENT_ADMIN" && user.role !== "NGO_ADMIN") {
      return sendError("Forbidden: Only Government and NGO admins can access", "FORBIDDEN", 403);
    }

    const { id } = params;

    if (!id) {
      return sendError("Request ID is required", "MISSING_ID", 400);
    }

    const result = await NGORequestFetchService.getRequestById(id);

    return sendSuccess(result.data, "NGO request fetched successfully", 200);
  } catch (error: any) {
    console.error(`❌ GET /api/ngo-requests/:id error:`, error.message);

    // Handle specific error cases
    if (error.message === "REQUEST_NOT_FOUND") {
      return sendError("NGO request not found", "NOT_FOUND", 404);
    }

    if (error.message === "INVALID_ID") {
      return sendError("Invalid request ID format", "INVALID_ID", 400);
    }

    return sendError(
      error.message || "Failed to fetch NGO request",
      "FETCH_ERROR",
      500,
      error
    );
  }
}
