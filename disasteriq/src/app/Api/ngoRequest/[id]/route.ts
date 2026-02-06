import { NextRequest } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { NGORequestRepository } from "@/app/repositories/ngoRequest";

/**
 * PUT /api/ngo-request/[id]
 *
 * Accept an NGO request by its ID. Only `NGO_ADMIN` of the owning NGO can accept.
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await authMiddleware(req);

    if (user.role !== "NGO_ADMIN") {
      return sendError("Forbidden: Only NGO admins can accept requests", "FORBIDDEN", 403);
    }

    const requestId = params?.id;

    if (!requestId || typeof requestId !== "string") {
      return sendError("Invalid request id", "INVALID_ID", 400);
    }

    // load the request and verify ownership
    const existing = await NGORequestRepository.findById(requestId);
    if (!existing) {
      return sendError("NGO request not found", "NOT_FOUND", 404);
    }

    // Ensure the NGO admin belongs to the same NGO as the request
    if (!user.ngoId || user.ngoId !== existing.ngoId) {
      return sendError("Forbidden: You cannot accept requests for other NGOs", "FORBIDDEN", 403);
    }

    const updated = await NGORequestRepository.acceptRequest(requestId);

    return sendSuccess(updated, "NGO request accepted", 200);
  } catch (error: any) {
    console.error("❌ PUT /api/ngo-request/[id] error:", error?.message || error);
    if (error.message === "NO_TOKEN") {
      return sendError("Authentication required", "UNAUTHORIZED", 401);
    }
    return sendError(error?.message || "Failed to accept request", "UPDATE_ERROR", 500, error);
  }
}
