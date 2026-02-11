import { NextRequest } from "next/server";
import { NGORequestService } from "@/app/Service/ngoRequest_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { apiHandler } from "@/app/lib/ apiWrapper";
import { requireRole } from "@/app/middleware/requireRole";

export const dynamic = "force-dynamic";

export const PATCH = apiHandler(async (req: NextRequest & { user?: any }) => {
  const taskId = req.nextUrl.pathname.split('/').slice(-2)[0];
  const { status } = await req.json();

  // ✅ VALIDATION
  if (!taskId) {
    return sendError(
      "Task ID is required",
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }

  // 🔐 ROLE CHECK - Only NGO can respond to tasks
  const roleError = requireRole(req, ["NGO"]);
  if (roleError) return roleError;

  // ✅ VALIDATION
  if (!status || !["ACCEPTED", "REJECTED"].includes(status)) {
    return sendError(
      "Status must be ACCEPTED or REJECTED",
      ERROR_CODES.VALIDATION_ERROR,
      400
    );
  }

  try {
    const updatedTask = await NGORequestService.respondToTask(taskId, status);
    
    return sendSuccess(updatedTask, `Task ${status.toLowerCase()} successfully`);
  } catch (err: any) {
    return sendError(
      err.message || "Failed to respond to task",
      ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
});
