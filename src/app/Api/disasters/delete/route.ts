
import { DisasterService } from "@/app/Service/disaster_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { apiHandler } from "@/app/lib/ apiWrapper";

export const dynamic = "force-dynamic";


export const DELETE = apiHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return sendError("ID required", ERROR_CODES.VALIDATION_ERROR, 400);
  }

  await DisasterService.delete(id);
  return sendSuccess(null, "Disaster deleted");
});