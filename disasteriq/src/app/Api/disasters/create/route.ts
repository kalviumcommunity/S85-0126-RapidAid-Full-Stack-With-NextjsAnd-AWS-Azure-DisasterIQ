import { DisasterService } from "@/app/Service/disaster_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { apiHandler } from "@/app/lib/ apiWrapper";




export const POST = apiHandler(async (req: Request) => {
  try {
    const body = await req.json();
    const disaster = await DisasterService.create(body);
    return sendSuccess(disaster, "Disaster created", 201);
  } catch (err: any) {
    return sendError(
      err.message,
      err.code ?? ERROR_CODES.INTERNAL_ERROR,
      400
    );
  }
});
