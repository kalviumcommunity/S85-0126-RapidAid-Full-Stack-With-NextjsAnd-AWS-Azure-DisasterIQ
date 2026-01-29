"use client";

import { useState } from "react";
import { Shield, UserPlus, LogIn } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminAuthPage() {
  const [isSignup, setIsSignup] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignup) {
        await fetch("/Api/auth/admin/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
      } else {
        await fetch("/Api/auth/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        router.push("/admin");
      }
    } catch (err) {
      console.error(err);
      alert("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-white">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
            <Shield className="h-7 w-7 text-white" />
          </div>

          <h1 className="text-2xl font-semibold">
            Admin {isSignup ? "Signup" : "Login"}
          </h1>

          <p className="text-sm text-white/70 mt-1">
            {isSignup
              ? "Create an administrator account to manage the platform"
              : "Sign in to access the admin dashboard"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Admin Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            className="w-full h-11 bg-blue-600 hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Please wait..." : isSignup ? (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Admin
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </>
            )}
          </Button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center text-sm text-white/80">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className="text-blue-400 hover:underline font-medium"
              >
                Login
              </button>
            </>
          ) : (
            <>
              New admin?{" "}
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className="text-blue-400 hover:underline font-medium"
              >
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
