import { DisasterService } from "@/app/Service/disaster_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { apiHandler } from "@/app/lib/ apiWrapper";

export const PUT = apiHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return sendError("ID required", ERROR_CODES.VALIDATION_ERROR, 400);
  }

  const body = await req.json();
  const updated = await DisasterService.update(id, body);

  return sendSuccess(updated, "Disaster updated");
});

export const PATCH = apiHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return sendError("ID required", ERROR_CODES.VALIDATION_ERROR, 400);
  }

  const body = await req.json();
  const updated = await DisasterService.partialUpdate(id, body);

  return sendSuccess(updated, "Disaster partially updated");
});

