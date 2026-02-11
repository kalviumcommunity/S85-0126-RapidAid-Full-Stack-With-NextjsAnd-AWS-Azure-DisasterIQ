import { apiHandler } from "@/app/lib/ apiWrapper";
import { sendError, sendSuccess } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { allocateResourceSchema } from "@/app/lib/schema";
import {
  InsufficientResourceError,
  ResourceAllocationService,
} from "@/app/Service/resource_allocation_service";
import { ZodError } from "zod";

/**
 * POST /api/resources/allocate
 * Body: { resourceId, disasterId, allocatedQuantity }
 *
 * Demonstrates Prisma transaction + rollback on failure.
 */
export const POST = apiHandler(async (req: Request & { user?: any }) => {
  try {
    if (!req.user) {
      return sendError(
        "Unauthorized: authentication required",
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }

    const body = await req.json();
    const validated = allocateResourceSchema.parse(body);

    const result = await ResourceAllocationService.allocateToDisaster({
      ...validated,
      performedByUserId: req.user.id,
    });

    return sendSuccess(result, "Resource allocated successfully", 201);
  } catch (err: any) {
    if (err instanceof ZodError) {
      return sendError(
        err.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; "),
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    if (err instanceof InsufficientResourceError) {
      return sendError(err.message, "INSUFFICIENT_RESOURCE", 409, err);
    }

    return sendError(
      err.message ?? "Internal server error",
      err.code ?? ERROR_CODES.INTERNAL_ERROR,
      500,
      err
    );
  }
});

