import { DisasterService } from "@/app/Service/disaster_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { apiHandler } from "@/app/lib/ apiWrapper";
import { createDisasterSchema } from "@/app/lib/schema";
import { ZodError } from "zod";


export const POST = apiHandler(async (req: Request & { user?: any }) => {
  try {
    // 🔐 AUTH
    if (!req.user) {
      return sendError(
        "Unauthorized",
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }

    if (req.user.role !== "GOVERNMENT_ADMIN") {
      return sendError(
        "Access denied",
        ERROR_CODES.FORBIDDEN,
        403
      );
    }

    // ✅ Parse multipart/form-data
    const formData = await req.formData();

    const body = {
      name: formData.get("name"),
      type: formData.get("type"),
      severity: Number(formData.get("severity")),
      location: formData.get("location"),
      status: formData.get("status"),
      media: formData.get("media")
        ? JSON.parse(formData.get("media") as string)
        : [],
    };

    // ✅ Zod validation
    const validatedBody = createDisasterSchema.parse(body);

    // ✅ Create disaster
    const disaster = await DisasterService.create({
      ...validatedBody,
      governmentId: req.user.governmentId,
      createdByUserId: req.user.id,
    });

    return sendSuccess(disaster, "Disaster created", 201);

  } catch (err: any) {
    if (err instanceof ZodError) {
      return sendError(
        err.issues.map(e => e.message).join(", "),
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    return sendError(
      err.message ?? "Internal server error",
      err.code ?? ERROR_CODES.INTERNAL_ERROR,
      500
    );
  }
});

