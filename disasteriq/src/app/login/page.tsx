"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true);
    document.cookie = "token=mock.jwt.token; path=/";

    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow">
        <h1 className="mb-2 text-center text-2xl font-bold">
          Welcome Back
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Login to access the dashboard
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-md border px-3 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-md border px-3 py-2"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded-md bg-primary py-2 text-primary-foreground"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
