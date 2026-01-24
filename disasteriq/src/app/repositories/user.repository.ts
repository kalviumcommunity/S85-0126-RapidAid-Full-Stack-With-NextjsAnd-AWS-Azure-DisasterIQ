import { prisma } from "@/app/prisma/prisma";

export async function findUserForAuthByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      passwordHash: true,

      governmentId: true,
      policeId: true,
      ngoId: true,
      hospitalId: true,

      roles: {
        select: {
          role: {
            select: { name: true },
          },
        },
      },
    },
  });
}
