import { prisma } from "@/app/prisma/prisma";

export const DisasterRepository = {
  create: (data: any) =>
    prisma.disaster.create({ data }),

  findAll: () =>
    prisma.disaster.findMany(),

  findById: (id: string) =>
    prisma.disaster.findUnique({ where: { id } }),

  update: (id: string, data: any) =>
    prisma.disaster.update({
      where: { id },
      data,
    }),

  delete: (id: string) =>
    prisma.disaster.delete({ where: { id } }),
};
