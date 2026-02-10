import { NextRequest } from "next/server";
import { NGORequestFetchService } from "@/app/Service/ngoRequest_fetch.service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { authMiddleware } from "@/app/middleware/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ governmentId: string }> }
) {
  try {
    // ✅ Next.js App Router (params is async)
    const { governmentId } = await params;

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

    if (!governmentId) {
      return sendError(
        "Government ID is required",
        "MISSING_GOVERNMENT_ID",
        400
      );
    }

    const { searchParams } = req.nextUrl;

    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    const { items, count } =
      await NGORequestFetchService.getRequestsByGovernmentId(governmentId, {
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
      });

    return sendSuccess(
      {
        items,
        count,
      },
      `Retrieved ${items.length} NGO request(s) for government`,
      200
    );
  } catch (error: unknown) {
    console.error(
      "❌ GET /api/ngo-requests/government/:governmentId error:",
      error
    );

    if (error instanceof Error) {
      if (error.message === "INVALID_GOVERNMENT_ID") {
        return sendError(
          "Invalid government ID format",
          "INVALID_GOVERNMENT_ID",
          400
        );
      }

      return sendError(
        error.message,
        "FETCH_ERROR",
        500
      );
    }

    return sendError(
      "Failed to fetch NGO requests for government",
      "FETCH_ERROR",
      500
    );
  }
}
