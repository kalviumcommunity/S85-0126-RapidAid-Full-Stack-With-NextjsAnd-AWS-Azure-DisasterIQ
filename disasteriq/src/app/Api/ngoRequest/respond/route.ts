/**
 * POST /api/ngoRequest/respond
 * 
 * Allow NGO to approve or reject a government request
 * 
 * Request Body:
 * {
 *   "requestedById": "uuid",
 *   "status": "APPROVED" | "REJECTED"
 * }
 * 
 * Response:
 * {
 *   "success": boolean,
 *   "data": NGORequest,
 *   "message": string
 * }
 */

import { NextRequest } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { NGORequestRepository } from "@/app/repositories/ngoRequest";
import { NGORequestStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    // ✅ Authentication
    const user = await authMiddleware(req);

    // ✅ Authorization - only NGO_ADMIN
    if (user.role !== "NGO_ADMIN") {
      return sendError("Forbidden: Only NGO admins can respond to requests", "FORBIDDEN", 403);
    }

    if (!user.ngoId) {
      return sendError("NGO ID not found in token", "MISSING_NGO_ID", 400);
    }

    // ✅ Parse request body
    const body = await req.json();
    const { requestedById, status } = body;

    // ✅ Validate input
    if (!requestedById || typeof requestedById !== "string") {
      return sendError("Invalid requestedById", "INVALID_INPUT", 400);
    }

    if (!status || typeof status !== "string") {
      return sendError("Invalid status", "INVALID_INPUT", 400);
    }

    const validStatuses = ["APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return sendError(`Status must be one of: ${validStatuses.join(", ")}`, "INVALID_STATUS", 400);
    }

    // ✅ Find the request by requestedById and ngoId
    const request = await NGORequestRepository.findByRequestedByAndNgo(requestedById, user.ngoId);

    if (!request) {
      return sendError("NGO request not found", "NOT_FOUND", 404);
    }

    // ✅ Validate request is PENDING
    if (request.status !== NGORequestStatus.PENDING) {
      return sendError(
        `Cannot respond to a ${request.status} request. Only PENDING requests can be updated.`,
        "ALREADY_RESPONDED",
        400
      );
    }

    // ✅ Validate request hasn't already been responded to
    if (request.respondedAt !== null) {
      return sendError("This request has already been responded to", "ALREADY_RESPONDED", 400);
    }

    // ✅ Update the request status
    const updated = await NGORequestRepository.updateStatus(request.id, status as "APPROVED" | "REJECTED");

    return sendSuccess(
      updated,
      `NGO request ${status.toLowerCase()}d successfully`,
      200
    );

  } catch (error: any) {
    console.error("❌ POST /api/ngoRequest/respond error:", error.message);

    if (error.message === "NO_TOKEN") {
      return sendError("Authentication required", "UNAUTHORIZED", 401);
    }

    return sendError(
      error.message || "Failed to respond to request",
      "SERVER_ERROR",
      500,
      error
    );
  }
}
