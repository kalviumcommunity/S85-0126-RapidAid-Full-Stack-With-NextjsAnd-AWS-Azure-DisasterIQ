import { StatsRepository } from "@/app/repositories/StatsRepository";

export const StatsService = {
  getDashboardStats: async () => {
    const [
      totalDisasters,
      disasterByStatus,
      victimStats,
      shelterStats,
      resourceStats,
    ] = await Promise.all([
      StatsRepository.totalDisasters(),
      StatsRepository.disasterByStatus(),
      StatsRepository.victimStats(),
      StatsRepository.shelterStats(),
      StatsRepository.resourceStats(),
    ]);

    return {
      disasters: {
        total: totalDisasters,
        byStatus: disasterByStatus,
      },
      victims: victimStats,
      shelters: shelterStats,
      resources: resourceStats,
    };
  },
};
export { StatsRepository };

