import { prisma } from "@/app/prisma/prisma";

export const NGORepository = {
  // GET ALL NGOs
  getAll: async () => {
    return prisma.nGO.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        registrationNumber: true,
        state: true,
        focusArea: true,
        contactEmail: true,
        contactPhone: true,
        createdAt: true,
      },
    });
  },

  // GET NGOs by state
  getByState: async (state:any) => {
    return prisma.nGO.findMany({
      where: {
        state: {
          equals: state,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        registrationNumber: true,
        state: true,
        focusArea: true,
        contactEmail: true,
        contactPhone: true,
        createdAt: true,
      },
    });
  },
};
