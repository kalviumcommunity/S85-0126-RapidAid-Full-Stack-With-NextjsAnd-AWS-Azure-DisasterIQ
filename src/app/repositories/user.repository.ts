import { prisma } from "@/app/prisma/prisma";

export async function findUserForAuthByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,

      // For CITIZEN
      state: true,

      governmentId: true,
      policeId: true,
      ngoId: true,
      hospitalId: true,

      // 🔐 ROLE
      roles: {
        select: {
          role: {
            select: { name: true },
          },
        },
      },

      // ✅ RELATIONS (THIS WAS MISSING)
      ngo: {
        select: {
          state: true,
        },
      },
      government: {
        select: {
          state: true,
        },
      },
      police: {
        select: {
          state: true,
        },
      },
      hospital: {
        select: {
          state: true,
        },
      },
    },
  });
}
