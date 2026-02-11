import { StatsService } from "@/app/Service/ stats_service";
import { sendSuccess } from "@/app/lib/ responseHandler";
import { apiHandler } from "@/app/lib/ apiWrapper";

export const dynamic = "force-dynamic";

/**
 * GET /api/stats
 * Dashboard statistics
 */
export const GET = apiHandler(async () => {
  const stats = await StatsService.getDashboardStats();
  return sendSuccess(stats, "Dashboard stats fetched");
});
