import { fetchUsers } from '@/app/Service/user_service';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await fetchUsers();
  return NextResponse.json(users);
}

// in repositeries folder make user.repository.ts file and paste this code

// import { prisma } from '@/app/prisma/prisma';

// export async function getUsers() {
//   return await prisma.user.findMany();
// }

// in service folder make  user_service.ts and paste this code


// import { getUsers } from '@/app/repositories/user.repository';

// export async function fetchUsers() {
//   return await getUsers();
// }