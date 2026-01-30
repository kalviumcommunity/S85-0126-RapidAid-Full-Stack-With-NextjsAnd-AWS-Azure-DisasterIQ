import { prisma } from "@/app/prisma/prisma";

export const NGORepository = {
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
        district: true,
        focusArea: true,
        contactEmail: true,
        contactPhone: true,
        createdAt: true,
      },
    });
  },
};
