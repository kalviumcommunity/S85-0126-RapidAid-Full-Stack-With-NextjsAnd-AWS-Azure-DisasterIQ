"use client";

import {
  Shield,
  User,
  Mail,
  Lock,
  Building2,
  Phone,
  Hash,
} from "lucide-react";

export default function NgoSignup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] px-4">
      <div className="w-full max-w-md bg-[#0e1628] border border-white/10 rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            NGO Registration
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Register your NGO to participate in relief operations
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          {/* Admin Details */}
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              placeholder="Admin Name"
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              placeholder="Admin Email"
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

          {/* Divider */}
          <div className="border-t border-white/10 my-4" />

          {/* NGO Details */}
          <div className="relative">
            <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              placeholder="NGO Name"
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              placeholder="Registration Number"
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              placeholder="Contact Phone"
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-6 rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 text-sm font-medium text-white transition"
          >
            Register NGO
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-slate-400">
          Already registered?{" "}
          <a href="/auth/login" className="text-blue-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
