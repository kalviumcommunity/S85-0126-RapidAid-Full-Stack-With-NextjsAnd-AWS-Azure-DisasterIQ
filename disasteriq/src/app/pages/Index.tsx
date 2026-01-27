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
    description:
      "Full system access. Manage disasters, users, and organizations.",
    icon: Shield,
    href: "/auth/admin/signup",
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "government",
    title: "Government Authority",
    description:
      "Regional disaster coordination and emergency declarations.",
    icon: Building2,
    href: "/auth/government/signup",
    color: "bg-blue-500 text-white",
  },
  {
    id: "responder",
    title: "NGO / Hospital",
    description:
      "Manage resources and respond to relief requests.",
    icon: Heart,
    href: "/auth/ngo/signup",
    color: "bg-green-500 text-white",
  },
  {
    id: "public",
    title: "Public User",
    description:
      "View alerts, request help, and access emergency information.",
    icon: Users,
    href: "/auth/citizen/signup",
    color: "bg-amber-500 text-white",
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
    <div className="min-h-screen bg-background">
      {/* ===================== NAVBAR ===================== */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-foreground">
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
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===================== HERO ===================== */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
              <Globe className="h-4 w-4" />
              Unified Disaster Response Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Coordinating Relief,
              <br />
              <span className="text-primary">Saving Lives</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              A comprehensive platform connecting government agencies, NGOs,
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

              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ROLE SELECTION ===================== */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">
              Access Portal
            </h2>
            <p className="text-muted-foreground">
              Select your role to register and access the platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {roles.map((role) => (
              <Link
                key={role.id}
                href={role.href}
                className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${role.color}`}
                >
                  <role.icon className="h-7 w-7" />
                </div>

                <h3 className="font-semibold mb-2">
                  {role.title}
                </h3>

                <p className="text-sm text-muted-foreground mb-4">
                  {role.description}
                </p>

                <div className="flex items-center text-sm font-medium text-primary">
                  <span>Register</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Built for Effective Disaster Response
            </h2>

            <p className="text-muted-foreground mb-8">
              Our platform streamlines coordination between all stakeholders
              during emergencies.
            </p>

            <ul className="space-y-3">
              {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold">DisasterRelief</span>
          </div>

          <p className="text-sm text-muted-foreground">
            © 2024 Disaster Relief Coordination Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
