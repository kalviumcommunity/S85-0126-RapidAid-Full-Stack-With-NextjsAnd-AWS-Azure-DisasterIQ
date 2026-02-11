import { NextRequest } from "next/server";
import { NGORequestService } from "@/app/Service/ngoRequest_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { apiHandler } from "@/app/lib/ apiWrapper";
import { requireRole } from "@/app/middleware/requireRole";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req: NextRequest & { user?: any }) => {
  // 🔐 ROLE CHECK - Only Government can view their requests
  const roleError = requireRole(req, ["GOVERNMENT_ADMIN"]);
  if (roleError) return roleError;

  try {
    const requests = await NGORequestService.getGovernmentRequests(req.user.governmentId);
    
    return sendSuccess(requests, "Government requests fetched successfully");
  } catch (err: any) {
    return sendError(
      err.message || "Failed to fetch government requests",
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
});
