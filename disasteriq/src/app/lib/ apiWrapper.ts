// src/app/lib/apiWrapper.ts
import type { NextRequest } from "next/server";
import { sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";
import { authMiddleware } from "@/app/middleware/auth";

export const apiHandler =
  (fn: (req: NextRequest & { user?: any }) => Promise<Response>) =>
  async (req: NextRequest) => {
    try {
      /* 🔐 AUTH FIRST — MUST AWAIT */
      const authResult = await authMiddleware(req);
      if (authResult) return authResult;

      /* ✅ req.user is now attached */
      return await fn(req as NextRequest & { user?: any });
    } catch (error) {
      console.error("API Error:", error);

      return sendError(
        "Internal Server Error",
        ERROR_CODES.INTERNAL_ERROR,
        500,
        error
      );
    }
  };
