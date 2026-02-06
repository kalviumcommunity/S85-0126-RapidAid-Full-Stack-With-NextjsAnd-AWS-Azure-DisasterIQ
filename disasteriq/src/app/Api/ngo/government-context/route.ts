/**
 * GET /api/ngo/government-context
 * 
 * Fetch NGOs with full government context
 * Uses government ID and state from JWT token
 * Returns government details along with available NGOs
 * 
 * Authentication Required: ✓ GOVERNMENT_ADMIN
 * 
 * Response includes:
 * - Government details (id, name, state, level)
 * - List of NGOs in that state
 * - Pagination info if needed
 */

import { NextRequest } from "next/server";
import { authMiddleware } from "@/app/middleware/auth";
import { NGOService } from "@/app/Service/ngo_service";
import { sendSuccess, sendError } from "@/app/lib/ responseHandler";
import { prisma } from "@/app/prisma/prisma";

export async function GET(req: NextRequest) {
  try {
    // ✅ Authentication + Authorization
    const user = await authMiddleware(req);

    // Only GOVERNMENT_ADMIN can access
    if (user.role !== "GOVERNMENT_ADMIN") {
      return sendError(
        "Forbidden: Only Government admins can access",
        "FORBIDDEN",
        403
      );
    }

    const governmentId = user.governmentId;
    const state = user.governmentState;

    if (!governmentId) {
      return sendError("Government ID not found in token", "GOVT_ID_MISSING", 400);
    }

    if (!state) {
      return sendError("Government state not found in token", "STATE_MISSING", 400);
    }

    // Fetch government details
    const government = await prisma.government.findUnique({
      where: { id: governmentId },
      select: {
        id: true,
        name: true,
        level: true,
        state: true,
        district: true,
        department: true,
        contactEmail: true,
        contactPhone: true,
        createdAt: true,
      },
    });

    if (!government) {
      return sendError("Government not found", "GOVERNMENT_NOT_FOUND", 404);
    }

    // Fetch NGOs for this state
    const ngos = await NGOService.getByState(state);

    return sendSuccess(
      {
        government,
        ngos,
        summary: {
          governmentId,
          state,
          totalNgos: ngos.length,
        },
      },
      `Retrieved government context and ${ngos.length} NGO(s)`,
      200
    );
  } catch (error: any) {
    console.error("❌ GET /api/ngo/government-context error:", error.message);

    if (error.message === "NO_TOKEN") {
      return sendError("Authentication required", "UNAUTHORIZED", 401);
    }

    return sendError(
      error.message || "Failed to fetch government context",
      "FETCH_ERROR",
      500,
      error
    );
  }
}
