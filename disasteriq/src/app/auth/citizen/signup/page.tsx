"use client";

import { useState } from "react";
import { User, Mail, Lock, Shield, Phone, MapPin } from "lucide-react";

export default function CitizenSignup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    rolePreference: "VOLUNTEER",
    state: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "http://localhost:3000/api/auth/user/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      alert("Account created successfully");
      window.location.href = "/auth/login";

    } catch {
      setError("Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] px-4">
      <div className="w-full max-w-md bg-[#0e1628] border border-white/10 rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Citizen Signup</h1>
          <p className="text-sm text-slate-400 mt-1">
            Create an account to receive alerts and request help
          </p>
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-400 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone (optional)"
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white"
            />
          </div>

          {/* Manual State Input */}
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State (e.g. Punjab)"
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 text-sm font-medium text-white transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

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
