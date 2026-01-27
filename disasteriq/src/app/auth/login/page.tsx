"use client";

export default function LoginPage() {
  return (
    <div className="mx-auto mt-20 max-w-md p-6">
      <h1 className="mb-6 text-2xl font-bold">Login</h1>

      <form className="space-y-4">
        <input type="email" placeholder="Email" required className="input" />
        <input type="password" placeholder="Password" required className="input" />

        <button className="w-full rounded bg-primary py-2 text-primary-foreground">
          Login
        </button>
      </form>
    </div>
  );
}
