
import { getUsers } from '@/app/repositories/user.repository';

export async function fetchUsers() {
  return await getUsers();
}