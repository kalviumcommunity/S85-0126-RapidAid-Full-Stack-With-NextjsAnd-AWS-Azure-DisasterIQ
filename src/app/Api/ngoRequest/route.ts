import { NextRequest } from "next/server";
import { NGORequestFetchService } from "@/app/Service/ngoRequest_fetch.service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { authMiddleware } from "@/app/middleware/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // ✅ Auth
    const user = await authMiddleware(req);

    // ✅ Role guard
    if (
      user.role !== "GOVERNMENT_ADMIN" &&
      user.role !== "NGO_ADMIN"
    ) {
      return sendError(
        "Forbidden: Only Government and NGO admins can access",
        "FORBIDDEN",
        403
      );
    }

    const { searchParams } = req.nextUrl;

    const pageParam = searchParams.get("page");
    const pageSizeParam = searchParams.get("pageSize");

    const page = pageParam ? Number(pageParam) : undefined;
    const pageSize = pageSizeParam ? Number(pageSizeParam) : undefined;

    const { items, count } =
      await NGORequestFetchService.getAllRequests({
        page,
        pageSize,
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
    console.error("❌ GET /api/ngo-requests error:", error);

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
