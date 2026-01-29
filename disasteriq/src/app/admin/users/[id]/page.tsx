interface Props {
  params: {
    id: string;
  };
}

export default function UserProfile({ params }: Props) {
  const { id } = params;

  return (
    <div className="flex flex-col items-center mt-10">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <p className="mt-2">User ID: {id}</p>
    </div>
  );
}
