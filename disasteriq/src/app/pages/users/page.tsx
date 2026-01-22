import Link from "next/link";

export default function UsersPage() {
  const users = [1, 2, 3];

  return (
    <div className="flex flex-col items-center mt-10">
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
