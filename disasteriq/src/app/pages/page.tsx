export default async function Index() {
  // ⏳ simulate slow API
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // ❌ uncomment to test error boundary
  // throw new Error("Failed to load dashboard data");

  const data = [
    { id: 1, name: "Flood Response Unit" },
    { id: 2, name: "Medical Emergency Team" },
    { id: 3, name: "Fire Rescue Squad" },
  ];

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Disaster Response Units
      </h1>

      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            className="rounded-lg bg-card p-4 shadow-sm"
          >
            {item.name}
          </div>
        ))}
      </div>
    </main>
  );
}
