import { prisma } from "@/app/prisma/prisma";

export const DisasterRepository = {
  // -------------------------
  // CREATE
  // -------------------------
  create: async (data: {
    name: string;
    type: string;
    severity: number;
    location: string;
    status: "REPORTED" | "ONGOING" | "RESOLVED";
    governmentId: string;
  }) => {
    console.log("🟡 PRISMA CREATE INPUT:", data);

    const result = await prisma.disaster.create({
      data,
      include: {
        government: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log("🟢 PRISMA CREATE RESULT:", result);

    return result;
  },

  // -------------------------
  // READ ALL
  // -------------------------
  findAll: async (opts?: {
    skip?: number;
    take?: number;
    status?: "REPORTED" | "ONGOING" | "RESOLVED";
  }) =>
    prisma.disaster.findMany({
      where: opts?.status ? { status: opts.status } : undefined,
      // Avoid over-fetching: only select fields used by UI/API
      select: {
        id: true,
        name: true,
        type: true,
        severity: true,
        location: true,
        status: true,
        reportedAt: true,
        government: {
          select: { id: true, name: true },
        },
      },
      orderBy: { reportedAt: "desc" },
      skip: opts?.skip,
      take: opts?.take,
    }),

  // -------------------------
  // READ BY ID
  // -------------------------
  findById: async (id: string) =>
    prisma.disaster.findUnique({
      where: { id },
      include: {
        government: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),

  // -------------------------
  // UPDATE
  // -------------------------
  update: async (
    id: string,
    data: Partial<{
      name: string;
      type: string;
      severity: number;
      location: string;
      status: "REPORTED" | "ONGOING" | "RESOLVED";
    }>
  ) =>
    prisma.disaster.update({
      where: { id },
      data,
      include: {
        government: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
  // -------------------------
  // DELETE
  // -------------------------
  delete: async (id: string) =>
    prisma.disaster.delete({
      where: { id },
    }),
};
