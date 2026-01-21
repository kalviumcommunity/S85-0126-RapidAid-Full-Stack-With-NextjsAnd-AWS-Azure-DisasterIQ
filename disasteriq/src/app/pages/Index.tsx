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

const roles = [
  {
    id: "admin",
    title: "Admin",
    description: "Full system access. Manage disasters, users, and organizations.",
    icon: Shield,
    href: "/admin",
    color: "bg-primary text-primary-foreground",
  },
  {
    id: "government",
    title: "Government Authority",
    description: "Regional disaster coordination and emergency declarations.",
    icon: Building2,
    href: "/government",
    color: "bg-blue-500 text-white",
  },
  {
    id: "responder",
    title: "NGO / Hospital",
    description: "Manage resources and respond to relief requests.",
    icon: Heart,
    href: "/responder",
    color: "bg-green-500 text-white",
  },
  {
    id: "public",
    title: "Public User",
    description: "View alerts, request help, and access emergency information.",
    icon: Users,
    href: "/alerts",
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

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-foreground">DisasterRelief</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/alerts">
                <Button variant="ghost" size="sm">
                  Public Alerts
                </Button>
              </Link>
              <Button variant="default" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
              <Globe className="h-4 w-4" />
              Unified Disaster Response Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground">
              Coordinating Relief,
              <br />
              <span className="text-primary">Saving Lives</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              A comprehensive platform connecting government agencies, NGOs, hospitals, and citizens for effective disaster relief coordination and response.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/alerts">
                <Button variant="default" size="lg">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  View Active Alerts
                </Button>
              </Link>
              <Button variant="outline" size="xl">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">Access Portal</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select your role to access the appropriate dashboard and tools
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {roles.map((role) => (
              <Link
                key={role.id}
                href={role.href}
                className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${role.color}`}
                >
                  <role.icon className="h-7 w-7" />
                </div>
                <h3 className="text-base font-semibold mb-2">{role.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  <span>Access Dashboard</span>
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Built for Effective
                <br />
                Disaster Response
              </h2>
              <p className="text-muted-foreground mb-8">
                Our platform streamlines communication and coordination between all stakeholders, enabling faster response times and more efficient resource allocation during emergencies.
              </p>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-primary mb-2">127</p>
                <p className="text-sm text-muted-foreground">Disasters Managed</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">342</p>
                <p className="text-sm text-muted-foreground">Partner Organizations</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-amber-600 mb-2">2.4M</p>
                <p className="text-sm text-muted-foreground">People Helped</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-blue-600 mb-2">98%</p>
                <p className="text-sm text-muted-foreground">Response Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 hero-gradient">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Ready to Coordinate Relief Efforts?
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
            Join our network of government agencies, NGOs, and hospitals working together to save lives.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="xl" variant="secondary">
              Register Organization
            </Button>
            <Button size="xl" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold">DisasterRelief</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground">About</a>
              <a href="#" className="hover:text-foreground">Privacy</a>
              <a href="#" className="hover:text-foreground">Terms</a>
              <a href="#" className="hover:text-foreground">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Disaster Relief Coordination Platform
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
