"use client";

import { useState, ChangeEvent, FormEvent, InputHTMLAttributes } from "react";
import {
  Shield,
  User,
  Mail,
  Lock,
  Building2,
  Phone,
  Hash,
  MapPin,
  Target,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

/* -------------------- Reusable Input -------------------- */
type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  icon: LucideIcon;
};

function Input({ icon: Icon, ...props }: InputProps) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
      <input
        {...props}
        required
        className="w-full rounded-lg bg-black/30 border border-white/10 pl-10 pr-3 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

/* -------------------- Page -------------------- */
export default function NgoSignup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    // ADMIN
    adminName: "",
    adminEmail: "",
    password: "",

    // NGO
    name: "",
    registrationNumber: "",
    state: "",
    district: "",
    focusArea: "",
    contactEmail: "",
    contactPhone: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/Api/auth/ngo/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ngo: {
            name: form.name,
            registrationNumber: form.registrationNumber,
            state: form.state,
            district: form.district,
            focusArea: form.focusArea,
            contactEmail: form.contactEmail,
            contactPhone: form.contactPhone,
          },
          user: {
            name: form.adminName,
            email: form.adminEmail,
            password: form.password,
          },
        }),
      });

      // 🔒 SAFE RESPONSE PARSING
      const text = await res.text();
      let data: { message?: string };

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned invalid response");
      }

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("NGO registered successfully 🎉");

      // ✅ reset form
      setForm({
        adminName: "",
        adminEmail: "",
        password: "",
        name: "",
        registrationNumber: "",
        state: "",
        district: "",
        focusArea: "",
        contactEmail: "",
        contactPhone: "",
      });

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1220] px-4">
      <div className="w-full max-w-md bg-[#0e1628] border border-white/10 rounded-2xl shadow-xl p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">NGO Registration</h1>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 p-2 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 text-sm text-green-400 bg-green-500/10 p-2 rounded">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input icon={User} name="adminName" placeholder="Admin Name" value={form.adminName} onChange={handleChange} />
          <Input icon={Mail} name="adminEmail" type="email" placeholder="Admin Email" value={form.adminEmail} onChange={handleChange} />
          <Input icon={Lock} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

          <div className="border-t border-white/10 my-3" />

          <Input icon={Building2} name="name" placeholder="NGO Name" value={form.name} onChange={handleChange} />
          <Input icon={Hash} name="registrationNumber" placeholder="Registration Number" value={form.registrationNumber} onChange={handleChange} />
          <Input icon={MapPin} name="state" placeholder="State" value={form.state} onChange={handleChange} />
          <Input icon={MapPin} name="district" placeholder="District" value={form.district} onChange={handleChange} />
          <Input icon={Target} name="focusArea" placeholder="Focus Area" value={form.focusArea} onChange={handleChange} />
          <Input icon={Mail} name="contactEmail" type="email" placeholder="Contact Email" value={form.contactEmail} onChange={handleChange} />
          <Input icon={Phone} name="contactPhone" placeholder="Contact Phone" value={form.contactPhone} onChange={handleChange} />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 text-sm font-medium text-white transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register NGO"}
          </button>
          <p className="mt-4 text-center text-sm text-slate-400">
  Already registered?{" "}
  <a
    href="/auth/login"
    className="text-blue-400 hover:text-blue-300 hover:underline"
  >
    Login
  </a>
</p>

        </form>
      </div>
    </div>
  );
}
