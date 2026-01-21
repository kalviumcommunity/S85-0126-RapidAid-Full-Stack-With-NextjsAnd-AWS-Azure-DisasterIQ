import { prisma } from "@/app/prisma/prisma";

export const AuthRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email } }),

  createUser: (data: any) =>
    prisma.user.create({ data }),
};
