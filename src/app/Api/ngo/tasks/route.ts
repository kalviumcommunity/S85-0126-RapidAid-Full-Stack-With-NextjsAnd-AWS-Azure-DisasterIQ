import { NextRequest } from "next/server";
import { NGORequestService } from "@/app/Service/ngoRequest_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { apiHandler } from "@/app/lib/ apiWrapper";
import { requireRole } from "@/app/middleware/requireRole";

export const dynamic = "force-dynamic";

export const GET = apiHandler(async (req: NextRequest & { user?: any }) => {
  // 🔐 ROLE CHECK - Only NGO can view their tasks
  const roleError = requireRole(req, ["NGO"]);
  if (roleError) return roleError;

  try {
    const tasks = await NGORequestService.getNGOTasks(req.user.ngoId);
    
    return sendSuccess(tasks, "NGO tasks fetched successfully");
  } catch (err: any) {
    return sendError(
      err.message || "Failed to fetch NGO tasks",
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
});
