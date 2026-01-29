"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mt-10 flex flex-col items-center text-center">
      <h2 className="text-xl font-semibold text-destructive">
        Failed to load users
      </h2>

      <p className="mt-2 text-muted-foreground">
        {error.message}
      </p>

      <button
        onClick={() => reset()}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-90"
      >
        Try Again
      </button>
    </div>
  );
}
