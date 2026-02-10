import { NextRequest } from "next/server";
import { NGORequestFetchService } from "@/app/Service/ngoRequest_fetch.service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { authMiddleware } from "@/app/middleware/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ disasterId: string }> }
) {
  try {
    // ✅ Next.js 15+: params is async
    const { disasterId } = await params;

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

    if (!disasterId) {
      return sendError(
        "Disaster ID is required",
        "MISSING_DISASTER_ID",
        400
      );
    }

    const { searchParams } = req.nextUrl;

    const page = searchParams.get("page");
    const pageSize = searchParams.get("pageSize");

    const { items, count } =
      await NGORequestFetchService.getRequestsByDisasterId(disasterId, {
        page: page ? Number(page) : undefined,
        pageSize: pageSize ? Number(pageSize) : undefined,
      });

    return sendSuccess(
      {
        items,
        count,
      },
      `Retrieved ${items.length} NGO request(s) for disaster`,
      200
    );
  } catch (error: unknown) {
    console.error(
      "❌ GET /api/ngo-requests/disaster/:disasterId error:",
      error
    );

    if (error instanceof Error) {
      if (error.message === "INVALID_DISASTER_ID") {
        return sendError(
          "Invalid disaster ID format",
          "INVALID_DISASTER_ID",
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
      "Failed to fetch NGO requests for disaster",
      "FETCH_ERROR",
      500
    );
  }
}
