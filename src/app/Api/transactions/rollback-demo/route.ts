import { prisma } from "@/app/prisma/prisma";
import { apiHandler } from "@/app/lib/ apiWrapper";
import { sendError, sendSuccess } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";

/**
 * POST /api/transactions/rollback-demo
 *
 * This endpoint intentionally triggers an error inside a Prisma transaction
 * to demonstrate rollback behavior (no partial writes).
 *
 * NOTE: Recommended to use in development/testing only.
 */
export const POST = apiHandler(async (req: Request & { user?: any }) => {
  if (process.env.NODE_ENV === "production") {
    return sendError(
      "Rollback demo disabled in production",
      ERROR_CODES.FORBIDDEN,
      403
    );
  }

  try {
    if (!req.user) {
      return sendError(
        "Unauthorized: authentication required",
        ERROR_CODES.UNAUTHORIZED,
        401
      );
    }

    const body = await req.json().catch(() => ({}));
    const governmentId = body?.governmentId ?? req.user.governmentId;

    if (!governmentId) {
      return sendError(
        "governmentId is required for rollback demo",
        ERROR_CODES.VALIDATION_ERROR,
        400
      );
    }

    await prisma.$transaction(async (tx) => {
      const disaster = await tx.disaster.create({
        data: {
          name: "ROLLBACK_DEMO",
          type: "TEST",
          severity: 1,
          location: "TEST",
          status: "REPORTED",
          governmentId,
        },
        select: { id: true },
      });

      await tx.auditLog.create({
        data: {
          userId: req.user.id,
          action: "ROLLBACK_DEMO_STARTED",
          entity: "Disaster",
          entityId: disaster.id,
        },
      });

      // Force a failure AFTER successful writes inside the tx.
      // Prisma will rollback all changes automatically.
      throw new Error("Intentional rollback demo error");
    });

    // Unreachable (transaction always throws)
    return sendSuccess(null, "Rollback demo completed (unexpected)", 200);
  } catch (error) {
    console.error("Rollback demo transaction failed. Rolled back.", error);
    return sendError(
      "Transaction failed (expected). All operations rolled back.",
      "ROLLBACK_DEMO",
      500,
      error
    );
  }
});

