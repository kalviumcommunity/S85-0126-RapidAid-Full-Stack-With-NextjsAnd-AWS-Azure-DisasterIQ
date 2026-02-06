import { NextRequest } from "next/server";
import { NGORequestFetchService } from "@/app/Service/ngoRequest_fetch.service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { authMiddleware } from "@/app/middleware/auth";

export async function GET(req: NextRequest) {
  try {
    // 🔐 Authenticate user via JWT
    const user = await authMiddleware(req);

    // 🔒 Role-based access control
    if (user.role !== "GOVERNMENT_ADMIN" && user.role !== "NGO_ADMIN") {
      return sendError(
        "Forbidden: Only Government and NGO admins can access",
        "FORBIDDEN",
        403
      );
    }

    const { searchParams } = req.nextUrl;

    let ngoId: string | undefined;

    // 🧠 NGO_ADMIN → ngoId ONLY from JWT
    if (user.role === "NGO_ADMIN") {
      ngoId = user.ngoId;

      if (!ngoId) {
        return sendError(
          "NGO ID missing in token",
          "NGO_ID_NOT_IN_TOKEN",
          400
        );
      }
    }

    // 🏛️ GOVERNMENT_ADMIN → ngoId from query param
    if (user.role === "GOVERNMENT_ADMIN") {
      ngoId = searchParams.get("ngoId") || undefined;

      if (!ngoId) {
        return sendError(
          "NGO ID is required for government admin",
          "MISSING_NGO_ID",
          400
        );
      }
    }

    // ⛔ FINAL SAFETY CHECK (TypeScript + Runtime)
    if (!ngoId) {
      return sendError(
        "NGO ID is required",
        "MISSING_NGO_ID",
        400
      );
    }

    // 📄 Pagination
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    // ✅ TypeScript now KNOWS ngoId is string
    const result = await NGORequestFetchService.getRequestsByNgoId(ngoId, {
      page: page ? Number(page) : undefined,
      pageSize: pageSize ? Number(pageSize) : undefined,
    });

    return sendSuccess(
      result.data,
      `Retrieved ${result.data.length} NGO request(s)`,
      200
    );
  } catch (error: any) {
    console.error("❌ GET NGO requests error:", error.message);

    if (error.message === "INVALID_NGO_ID") {
      return sendError(
        "Invalid NGO ID format",
        "INVALID_NGO_ID",
        400
      );
    }

    return sendError(
      error.message || "Failed to fetch NGO requests",
      "FETCH_ERROR",
      500,
      error
    );
  }
}
