import { DisasterService } from "@/app/Service/disaster_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { apiHandler } from "@/app/lib/ apiWrapper";
import { createDisasterSchema } from "@/app/lib/schema";
import { ZodError } from "zod";


export const POST = apiHandler(async (req: Request & { user?: any }) => {
  try {
    // 🔐 HARD AUTH GUARD (REQUIRED)
    if (!req.user) {
      return sendError(
        "Unauthorized: authentication required",
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }

    /* 🔐 RBAC CHECK — GOVERNMENT ONLY */
    if (req.user.role !== "GOVERNMENT_ADMIN") {
      console.log(
        `[RBAC] ${req.user.role} attempted DISASTER_CREATE: DENIED`
      );

      return sendError(
        "Access denied: government authority required",
        ERROR_CODES.FORBIDDEN,
        403
      );
    }

    console.log(
      `[RBAC] ${req.user.role} attempted DISASTER_CREATE: ALLOWED`
    );

    const body = await req.json();

    // ✅ Validate request body
    const validatedBody = createDisasterSchema.parse(body);

    // ✅ Create disaster WITH government ownership
    const disaster = await DisasterService.create({
      ...validatedBody,
      governmentId: req.user.governmentId, // 🔥 REQUIRED
    });

    return sendSuccess(disaster, "Disaster created", 201);

  } catch (err: any) {
    if (err instanceof ZodError) {
      return sendError(
        err.issues
          .map(e => `${e.path.join(".")}: ${e.message}`)
          .join("; "),
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
