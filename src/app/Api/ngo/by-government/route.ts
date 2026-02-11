import { NextRequest } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { sanitizeInput } from "@/app/lib/sanitize";
import { NGOService } from "@/app/Service/ngo_service";

export const dynamic = "force-dynamic";

/**
 * GET /api/ngo/by-government
 * 
 * Fetch NGOs for the authenticated government admin's state.
 * The state is extracted from the JWT token, ensuring secure multi-tenancy.
 * 
 * Requirements:
 * - User must be authenticated
 * - User must have GOVERNMENT_ADMIN role
 * - User's governmentState must be present in token
 * 
 * @param req - Next.js request object
 * @returns NGO list for the government's state
 */
export async function GET(req: NextRequest) {
  try {
    // Authenticate user and extract JWT data
    const user = await authMiddleware(req);

    // Authorization check: Only GOVERNMENT_ADMIN can access
    if (user.role !== "GOVERNMENT_ADMIN") {
      return sendError(
        "Forbidden: Only Government admins can access this resource",
        "FORBIDDEN",
        403
      );
    }

    // Extract state from token (cannot be tampered with)
    const state = user.governmentState;

    if (!state || state.trim() === "") {
      return sendError(
        "Government state information missing from user token",
        "STATE_MISSING",
        400
      );
    }

    // Sanitize the state value
    const cleanState = sanitizeInput(state);

    // Fetch NGOs for the government's state
    const ngos = await NGOService.getByState(cleanState);

    // Return successful response with NGO list
    return sendSuccess(
      ngos,
      `Retrieved ${ngos.length} NGO(s) for state: ${cleanState}`,
      200
    );
  } catch (error) {
    console.error("[GET /api/ngo/by-government] Error:", error);

    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message === "UNAUTHORIZED") {
        return sendError("Authentication failed", "UNAUTHORIZED", 401);
      }
      if (error.message.includes("STATE_REQUIRED")) {
        return sendError(
          "Government state not found in token",
          "STATE_MISSING",
          400
        );
      }
    }

    // Generic error response
    return sendError(
      "Failed to fetch NGOs",
      "FETCH_ERROR",
      500
    );
  }
}
