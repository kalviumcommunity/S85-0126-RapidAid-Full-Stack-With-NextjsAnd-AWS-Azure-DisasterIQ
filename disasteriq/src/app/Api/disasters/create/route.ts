import { DisasterService } from "@/app/Service/disaster_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { apiHandler } from "@/app/lib/ apiWrapper";
import { createDisasterSchema } from "@/app/lib/schema";
import { ZodError } from "zod";

export const POST = apiHandler(async (req: Request) => {
  try {
    const body = await req.json();

    // 🔒 Zod validation
    const validatedBody = createDisasterSchema.parse(body);

    const disaster = await DisasterService.create(validatedBody);
    return sendSuccess(disaster, "Disaster created", 201);
  } catch (err: any) {
    if (err instanceof ZodError) {
      return sendError(
        err.issues.map(e => `${e.path.join(".")}: ${e.message}`).join("; "),
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    return sendError(
      err.message,
      err.code ?? ERROR_CODES.INTERNAL_ERROR,
      400
    );
  }
});
