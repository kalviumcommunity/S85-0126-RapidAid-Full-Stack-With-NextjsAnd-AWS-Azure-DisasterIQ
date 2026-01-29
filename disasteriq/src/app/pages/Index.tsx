"use client";

import Link from "next/link";
import {
  Shield,
  Users,
  Building2,
  Heart,
  AlertTriangle,
  ArrowRight,
  Check,
  Globe,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

/* ===================== ROLE CONFIG ===================== */

const roles = [
  {
    id: "admin",
    title: "Admin",
    description: "Full system access and platform control",
    icon: Shield,
    href: "/auth/admin/signup",
    accent: "from-indigo-500 to-blue-600",
  },
  {
    id: "government",
    title: "Government Authority",
    description: "Disaster coordination and declarations",
    icon: Building2,
    href: "/auth/government/signup",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    id: "responder",
    title: "NGO / Hospital",
    description: "Manage resources and relief operations",
    icon: Heart,
    href: "/auth/ngo/signup",
    accent: "from-green-500 to-emerald-500",
  },
  {
    id: "public",
    title: "Public User",
    description: "View alerts and request emergency help",
    icon: Users,
    href: "/auth/citizen/signup",
    accent: "from-amber-500 to-orange-500",
  },
];

const features = [
  "Real-time disaster alerts and notifications",
  "Multi-agency coordination tools",
  "Resource tracking and allocation",
  "Help request management",
  "Analytics and reporting",
  "Secure role-based access",
];

/* ===================== COMPONENT ===================== */

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">

      {/* ===================== NAVBAR ===================== */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-black/30 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg">
                DisasterRelief
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/alerts">
                <Button variant="ghost" size="sm">
                  Public Alerts
                </Button>
              </Link>

              <Link href="/auth/login">
                <Button size="sm">
                 Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===================== HERO ===================== */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm mb-6">
            <Globe className="h-4 w-4" />
            Unified Disaster Response Platform
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
            Coordinating Relief,
            <br />
            <span className="text-blue-400">Saving Lives</span>
          </h1>

          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10">
            A comprehensive platform connecting governments, NGOs,
            hospitals, and citizens for effective disaster relief
            coordination and response.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/alerts">
              <Button size="lg">
                <AlertTriangle className="h-5 w-5 mr-2" />
                View Active Alerts
              </Button>
            </Link>

            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* ===================== ROLES ===================== */}
      <section className="py-24 bg-slate-100 text-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold mb-3">
              Access Portal
            </h2>
            <p className="text-muted-foreground">
              Select your role to register and access the platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role) => (
              <Link
                key={role.id}
                href={role.href}
                className="group relative rounded-2xl bg-white p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.accent} flex items-center justify-center mb-5`}
                >
                  <role.icon className="h-7 w-7 text-white" />
                </div>

                <h3 className="font-semibold mb-2">
                  {role.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  {role.description}
                </p>

                <div className="flex items-center text-sm font-medium text-primary">
                  <span>Register</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="py-24 px-6 bg-white text-slate-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Built for Effective Disaster Response
          </h2>

          <ul className="grid sm:grid-cols-2 gap-6">
            {features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-white/10 py-10 text-center text-sm text-slate-400">
        © 2024 Disaster Relief Coordination Platform
      </footer>
    </div>
  );
}
