"use client";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8 text-white">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Sign In
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Access your DisasterRelief account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-2.5 font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/70">
          Secure access to the disaster coordination platform
        </p>
      </div>
    </div>
  );
}
