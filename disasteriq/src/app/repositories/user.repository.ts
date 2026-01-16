import { prisma } from '@/app/prisma/prisma';

export async function getUsers() {
  return await prisma.user.findMany();
}