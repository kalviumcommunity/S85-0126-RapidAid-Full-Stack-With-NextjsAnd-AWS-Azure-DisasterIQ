import { prisma } from "@/app/prisma/prisma";

export const StatsRepository = {
  totalDisasters: () =>
    prisma.disaster.count(),

  disasterByStatus: () =>
    prisma.disaster.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),

  victimStats: async () => {
    const total = await prisma.victim.count();
    const rescued = await prisma.victim.count({
      where: { rescued: true },
    });

    return {
      total,
      rescued,
      notRescued: total - rescued,
    };
  },

  shelterStats: async () => {
    const shelters = await prisma.shelter.findMany({
      select: {
        capacity: true,
        availableCapacity: true,
      },
    });

    const totalCapacity = shelters.reduce(
      (sum, s) => sum + s.capacity,
      0
    );

    const availableCapacity = shelters.reduce(
      (sum, s) => sum + s.availableCapacity,
      0
    );

    return {
      totalShelters: shelters.length,
      totalCapacity,
      availableCapacity,
      occupiedCapacity: totalCapacity - availableCapacity,
    };
  },

  resourceStats: async () => {
    const resources = await prisma.resource.findMany({
      select: { quantity: true },
    });

    const totalResources = resources.reduce(
      (sum, r) => sum + r.quantity,
      0
    );

    return {
      totalResources,
    };
  },
};
