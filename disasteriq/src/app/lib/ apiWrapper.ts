// src/app/lib/apiWrapper.ts
import { sendError } from "@/app/lib/ responseHandler";
import { ERROR_CODES } from "@/app/lib/ errorCodes";

export const apiHandler =
  (fn: Function) =>
  async (...args: any[]) => {
    try {
      return await fn(...args);
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
