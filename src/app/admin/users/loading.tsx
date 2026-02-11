export default function Loading() {
  return (
    <div className="mt-10 flex flex-col items-center space-y-4 animate-pulse">
      <div className="h-6 w-32 rounded bg-muted" />

      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
        <div className="h-4 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}
