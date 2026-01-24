import { prisma } from "@/app/prisma/prisma";

export const GovernmentRepository = {
  // -------------------------
  // FIND BY ID (used in auth middleware)
  // -------------------------
  findById: async (governmentId: string) => {
    return prisma.government.findUnique({
      where: { id: governmentId },
      select: {
        id: true,
        name: true,
      },
    });
  },

  // -------------------------
  // FIND ALL (optional, for admin dashboards)
  // -------------------------
  findAll: async () => {
    return prisma.government.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
