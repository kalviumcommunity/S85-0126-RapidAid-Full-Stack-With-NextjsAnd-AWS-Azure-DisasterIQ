import { NextRequest } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { NGORequestFetchService } from "@/app/Service/ngoRequest_fetch.service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";

export async function GET(req: NextRequest) {
  try {
    // ✅ Auth
    const user = await authMiddleware(req);

    // ✅ Role guard
    if (user.role !== "NGO_ADMIN") {
      return sendError(
        "Forbidden: Only NGO admins can access",
        "FORBIDDEN",
        403
      );
    }

    const ngoId = user.ngoId;
    if (!ngoId) {
      return sendError(
        "NGO ID missing in token",
        "NGO_ID_NOT_IN_TOKEN",
        400
      );
    }

    const { searchParams } = req.nextUrl;
    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    const { items, count } =
      await NGORequestFetchService.getRequestsByNgoId(ngoId, {
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
      });

    return sendSuccess(
      {
        items,
        count,
      },
      `Retrieved ${items.length} NGO request(s)`,
      200
    );
  } catch (error: unknown) {
    console.error("❌ GET NGO requests error:", error);

    if (error instanceof Error) {
      return sendError(
        error.message,
        "FETCH_ERROR",
        500
      );
    }

    return sendError(
      "Failed to fetch NGO requests",
      "FETCH_ERROR",
      500
    );
  }
}
