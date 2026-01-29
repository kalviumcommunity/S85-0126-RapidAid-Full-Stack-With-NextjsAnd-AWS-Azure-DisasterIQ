// src/app/lib/apiWrapper.ts
import type { NextRequest } from "next/server";
import { sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { authMiddleware } from "@/app/middleware/auth";
type AuthedRequest = NextRequest & {
  user?: {
    id: string;
    role: string;
    governmentId?: string;
    governmentName?: string | null;
    ngoId?: string;
    hospitalId?: string;
    policeId?: string;
  };
};

export const apiHandler =
  (fn: (req: AuthedRequest) => Promise<Response>) =>
  async (req: NextRequest): Promise<Response> => {
    try {
      // 🔐 Attach authenticated user
      const user = await authMiddleware(req);

      // ⚠️ NextRequest is immutable → cast, don’t mutate
      const authedReq = req as AuthedRequest;
      authedReq.user = user;

      return await fn(authedReq);
    } catch (err: any) {
      // ❌ No token
      if (err?.message === "NO_TOKEN") {
        return sendError(
          "Unauthorized",
          ERROR_CODES.UNAUTHORIZED,
          401
        );
      }

      // ❌ Invalid / expired JWT
      if (
        err?.name === "JsonWebTokenError" ||
        err?.name === "TokenExpiredError"
      ) {
        return sendError(
          "Invalid or expired token",
          ERROR_CODES.UNAUTHORIZED,
          401
        );
      }

      console.error("API WRAPPER ERROR:", err);

      return sendError(
        "Internal server error",
        ERROR_CODES.INTERNAL_ERROR,
        500
      );
    }
  };
