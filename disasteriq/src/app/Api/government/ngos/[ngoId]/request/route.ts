import { NextRequest } from "next/server";
import { NGORequestService } from "@/app/Service/ngoRequest_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { apiHandler } from "@/app/lib/ apiWrapper";
import { requireRole } from "@/app/middleware/requireRole";

export const POST = apiHandler(async (req: NextRequest & { user?: any }) => {
  const ngoId = req.nextUrl.pathname.split('/').slice(-2)[0];
  const { title, description, priority, disasterId } = await req.json();

  // ✅ VALIDATION
  if (!ngoId) {
    return sendError(
      "NGO ID is required",
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }

  // 🔐 ROLE CHECK - Only Government can create NGO requests
  const roleError = requireRole(req, ["GOVERNMENT_ADMIN"]);
  if (roleError) return roleError;

  // ✅ VALIDATION
  if (!title || !description || !disasterId) {
    return sendError(
      "Title, description, and disasterId are required",
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }

  try {
    const request = await NGORequestService.createRequest({
      title,
      description,
      priority: priority || "MEDIUM",
      disasterId,
      ngoId,
      governmentId: req.user.governmentId,
      userId: req.user.id,
    });

    return sendSuccess(request, "NGO request created successfully");
  } catch (err: any) {
    return sendError(
      err.message || "Failed to create NGO request",
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
});
