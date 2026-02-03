import { prisma } from "@/app/prisma/prisma";

export const VolunteerAdminRepository = {
  // find pending rolePreference requests for an NGO
  findPendingByNgo: async (ngoId: string, skip = 0, take = 10) => {
    const [items, count] = await Promise.all([
      prisma.volunteer.findMany({
        where: {
          ngoId,
          verified: false,
          rolePreference: { not: null },
        },
        include: {
          user: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { joinedAt: 'desc' },
        skip,
        take,
      }),
      prisma.volunteer.count({ where: { ngoId, verified: false, rolePreference: { not: null } } }),
    ]);

    return { items, count };
  },

  findById: async (id: string) => {
    return prisma.volunteer.findUnique({ where: { id }, include: { user: true } });
  },

  approveRole: async (id: string, approvedRole: string, adminUserId: string) => {
    return prisma.$transaction(async (tx) => {
      const volunteer = await tx.volunteer.update({
        where: { id },
        data: {
          role: approvedRole as any,
          verified: true,
          verifiedAt: new Date(),
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: "VOLUNTEER_APPROVED",
          entity: "Volunteer",
          entityId: id,
        },
      });

      return volunteer;
    });
  },

  rejectRole: async (id: string, adminUserId: string) => {
    return prisma.$transaction(async (tx) => {
      const volunteer = await tx.volunteer.update({
        where: { id },
        data: {
          rolePreference: null,
          role: 'GROUND_VOLUNTEER',
          verified: false,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: adminUserId,
          action: "VOLUNTEER_REJECTED",
          entity: "Volunteer",
          entityId: id,
        },
      });

      return volunteer;
    });
  },
};
