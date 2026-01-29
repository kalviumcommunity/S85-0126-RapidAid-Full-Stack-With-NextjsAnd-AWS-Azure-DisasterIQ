"use client";

import { useState } from "react";
import { Building2, Shield, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

export default function GovernmentAuthPage() {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <div className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 text-white">

        {/* ================= HEADER ================= */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Building2 className="text-blue-400" />
            Government Authority
          </h1>
          <p className="text-sm text-white/70 mt-1">
            Disaster coordination and emergency management portal
          </p>
        </div>

        {/* ================= TABS ================= */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setMode("signup")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition
              ${
                mode === "signup"
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
          >
            Signup
          </button>

          {/* 🔥 THIS NOW NAVIGATES */}
         <button>
  <a href="/auth/login">Login</a>
</button>

        </div>

        {/* ================= SIGNUP FORM ================= */}
        {mode === "signup" && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Authority Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase text-white/60 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Authority Information
              </h3>

              {[
                "Authority Name",
                "Level (STATE / DISTRICT)",
                "State",
                "District",
                "Department",
                "Official Email",
                "Contact Phone",
              ].map((placeholder, i) => (
                <input
                  key={i}
                  placeholder={placeholder}
                  type={placeholder.includes("Email") ? "email" : "text"}
                  className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>

            {/* Admin Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase text-white/60 flex items-center gap-2">
                <User className="h-4 w-4" />
                Admin Account
              </h3>

              <input
                placeholder="Admin Name"
                className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Admin Email"
                className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-lg bg-white/10 border border-white/20 px-4 py-2 text-sm placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* ================= ACTION ================= */}
        {mode === "signup" && (
          <div className="mt-8">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
              Register Government
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
