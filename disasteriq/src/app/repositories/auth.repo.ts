import { prisma } from "@/app/prisma/prisma";

export const AuthRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: {
            role: true, // gives role.name
          },
        },
        government: true,
        ngo: true,
        police: true,
        hospital: true,
      },
    }),

  createUser: (data: any) =>
    prisma.user.create({
      data,
    }),
};
