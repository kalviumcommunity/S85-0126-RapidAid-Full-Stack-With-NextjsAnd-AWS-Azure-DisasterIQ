import Link from "next/link";

async function getUsers() {
  // simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // uncomment to test error
  // throw new Error("Failed to fetch users");

  return [1, 2, 3];
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div className="mt-10 flex flex-col items-center">
      <h1 className="text-2xl font-bold">Users</h1>

      <ul className="mt-4 space-y-2">
        {users.map((id) => (
          <li key={id}>
            <Link
              href={`/users/${id}`}
              className="text-blue-600 underline"
            >
              User {id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
