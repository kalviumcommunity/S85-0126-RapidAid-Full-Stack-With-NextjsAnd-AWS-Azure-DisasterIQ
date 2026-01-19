import { fetchUsers } from '@/app/Service/user_service';
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await fetchUsers();
  return NextResponse.json(users);
}

