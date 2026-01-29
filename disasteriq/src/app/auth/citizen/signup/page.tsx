"use client";

import { User, Mail, Lock, Shield } from "lucide-react";

export default function CitizenSignup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] px-4">
      <div className="w-full max-w-md bg-[#0e1628] border border-white/10 rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            Citizen Signup
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create an account to receive alerts and request help
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              placeholder="Full Name"
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 text-sm font-medium text-white transition"
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <a href="/auth/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
