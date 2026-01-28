"use client";

import { useState } from "react";
import { Building2, Shield, User } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function GovernmentAuthPage() {
  const [isSignup, setIsSignup] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="relative w-full max-w-6xl h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* ================= BLUE SLIDING PANEL ================= */}
        <div
          className={`absolute top-0 h-full w-1/2 z-10 bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center transition-all duration-700 ease-in-out
          ${isSignup ? "right-0 rounded-l-[140px]" : "left-0 rounded-r-[140px]"}`}
        >
          <div className="text-center px-12 space-y-6">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1 text-sm">
              DisasterIQ Platform
            </span>

            <h2 className="text-4xl font-bold">
              {isSignup ? "Hello, Authority!" : "Welcome Back!"}
            </h2>

            <p className="text-sm leading-relaxed opacity-90">
              {isSignup
                ? "Register your government body and manage disaster response, alerts, and coordination efficiently."
                : "Login to manage incidents, alerts, and coordination dashboards."}
            </p>

            <Button
              variant="secondary"
              onClick={() => setIsSignup(!isSignup)}
              className="px-10"
            >
              {isSignup ? "Go to Login" : "Go to Signup"}
            </Button>
          </div>
        </div>

        {/* ================= FORMS ================= */}
        <div className="absolute inset-0 flex z-20">

          {/* ================= SIGNUP ================= */}
          <div
            className={`w-1/2 p-10 overflow-y-auto transition-all duration-700
            ${isSignup ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="text-blue-600" />
              Government Signup
            </h2>

            <div className="space-y-6">

              {/* Government Section */}
              <div className="rounded-xl border bg-slate-50 p-6">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-600 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Authority Information
                </h3>

                <div className="space-y-3">
                  <input className="input" placeholder="Authority Name" />
                  <input className="input" placeholder="Level (STATE / DISTRICT)" />
                  <input className="input" placeholder="State" />
                  <input className="input" placeholder="District" />
                  <input className="input" placeholder="Department" />
                  <input className="input" type="email" placeholder="Official Email" />
                  <input className="input" placeholder="Contact Phone" />
                </div>
              </div>

              {/* Admin Section */}
              <div className="rounded-xl border bg-white p-6">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-600 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Admin Account
                </h3>

                <div className="space-y-3">
                  <input className="input" placeholder="Admin Name" />
                  <input className="input" type="email" placeholder="Admin Email" />
                  <input className="input" type="password" placeholder="Password" />
                </div>
              </div>

              <Button className="w-full h-11">
                Register Government
              </Button>
            </div>
          </div>

          {/* ================= LOGIN ================= */}
          <div
            className={`w-1/2 p-10 flex items-center justify-center transition-all duration-700
            ${isSignup ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            <div className="w-full max-w-sm space-y-6">
              <h2 className="text-3xl font-bold text-center">
                Admin Login
              </h2>

              <input className="input" placeholder="Admin Email" />
              <input className="input" type="password" placeholder="Password" />

              <Button className="w-full h-11">
                Login
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
