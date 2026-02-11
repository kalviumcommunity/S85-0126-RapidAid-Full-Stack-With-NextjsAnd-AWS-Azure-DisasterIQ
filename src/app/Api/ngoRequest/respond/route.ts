import { NextRequest } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { NGORequestRepository } from "@/app/repositories/ngoRequest";
import { NGORequestStatus } from "@prisma/client";

type ActionStatus = "APPROVED" | "REJECTED";

export async function POST(req: NextRequest) {
  try {
    const user = await authMiddleware(req);

    if (user.role !== "NGO_ADMIN") {
      return sendError("Forbidden", "FORBIDDEN", 403);
    }

    if (!user.ngoId) {
      return sendError("NGO ID not found", "MISSING_NGO_ID", 400);
    }

    const body = (await req.json()) as {
      requestId: string;
      status: ActionStatus;
    };

    const { requestId, status } = body;

    if (!requestId) {
      return sendError("Invalid requestId", "INVALID_INPUT", 400);
    }

    const validStatuses: ActionStatus[] = ["APPROVED", "REJECTED"];
    if (!validStatuses.includes(status)) {
      return sendError("Invalid status", "INVALID_STATUS", 400);
    }

    const request = await NGORequestRepository.findById(requestId);

    if (!request || request.ngoId !== user.ngoId) {
      return sendError("NGO request not found", "NOT_FOUND", 404);
    }

    if (request.status !== NGORequestStatus.PENDING) {
      return sendError(
        `Cannot respond to a ${request.status} request`,
        "ALREADY_RESPONDED",
        400
      );
    }

    const updated = await NGORequestRepository.updateStatus(requestId, status);

    return sendSuccess(
      updated,
      `NGO request ${status.toLowerCase()}d successfully`,
      200
    );
  } catch (error: any) {
    return sendError(
      error.message || "Failed to respond",
      "SERVER_ERROR",
      500
    );
  }
}
