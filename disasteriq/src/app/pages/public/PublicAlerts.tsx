"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  MapPin,
  Phone,
  Shield,
  Bell,
  ChevronRight,
  Clock,
  Heart,
  Home,
  Utensils,
  Truck,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { StatusBadge } from "@/app/components/StatusBadge";

const activeAlerts = [
  {
    id: "1",
    title: "Flash Flood Warning",
    location: "Northern Valley District",
    severity: "critical",
    time: "Active Now",
    description: "Heavy rainfall causing flash floods. Avoid low-lying areas. Evacuation recommended for Zone A residents.",
    safetyTips: ["Move to higher ground immediately", "Do not attempt to cross flooded areas", "Keep emergency kit ready"],
  },
  {
    id: "2",
    title: "Cyclone Alert",
    location: "Eastern Coastal Zone",
    severity: "warning",
    time: "Expected in 24 hours",
    description: "Cyclone approaching coastal areas. Wind speeds expected to reach 120 km/h. Stay indoors and secure loose objects.",
    safetyTips: ["Secure all windows and doors", "Stock up on essentials", "Follow evacuation orders if issued"],
  },
  {
    id: "3",
    title: "Earthquake Advisory",
    location: "Southern Hills Region",
    severity: "info",
    time: "Aftershocks possible",
    description: "Recent seismic activity detected. Be prepared for possible aftershocks. Buildings are being inspected.",
    safetyTips: ["Stay away from damaged structures", "Drop, cover, and hold during shaking", "Check on neighbors"],
  },
];

const emergencyContacts = [
  { name: "Emergency Helpline", number: "112", available: "24/7" },
  { name: "Disaster Management", number: "1070", available: "24/7" },
  { name: "Medical Emergency", number: "108", available: "24/7" },
  { name: "Fire Service", number: "101", available: "24/7" },
];

export default function PublicAlerts() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHelpForm, setShowHelpForm] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 hero-gradient rounded-xl flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">DisasterRelief</span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/alerts" className="text-sm font-medium text-foreground">
                Alerts
              </Link>
              <Link href="/request-help" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Request Help
              </Link>
              <Link href="/resources" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Resources
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="space-y-2">
                <Link href="/alerts" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                  Alerts
                </Link>
                <Link href="/request-help" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                  Request Help
                </Link>
                <Link href="/resources" className="block px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">
                  Resources
                </Link>
                <Link href="/" className="block px-4 py-2">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero/Alert Banner */}
      <div className="bg-critical text-critical-foreground py-3 px-4">
        <div className="container mx-auto flex items-center justify-center gap-2 text-sm">
          <Bell className="h-4 w-4 animate-pulse" />
          <span className="font-medium">Active Emergency Alert:</span>
          <span>Flash Flood Warning in Northern Valley District</span>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Disaster Alerts</h1>
            <p className="text-muted-foreground mt-1">
              Stay informed about disasters in your area
            </p>
          </div>
          <Button variant="hero" size="lg" onClick={() => setShowHelpForm(true)}>
            <Phone className="h-4 w-4" />
            Request Help
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Alerts */}
          <div className="lg:col-span-2 space-y-4">
            {activeAlerts.map((alert, index) => (
              <div
                key={alert.id}
                className={`bg-card border rounded-xl overflow-hidden animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`h-1.5 ${
                    alert.severity === "critical"
                      ? "bg-critical"
                      : alert.severity === "warning"
                      ? "bg-warning"
                      : "bg-info"
                  }`}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            alert.severity === "critical"
                              ? "text-critical"
                              : alert.severity === "warning"
                              ? "text-warning"
                              : "text-info"
                          }`}
                        />
                        <h3 className="text-lg font-semibold">{alert.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {alert.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {alert.time}
                        </span>
                      </div>
                    </div>
                    <StatusBadge
                      status={alert.severity === "critical" ? "critical" : alert.severity === "warning" ? "warning" : "info"}
                      label={alert.severity}
                      pulse={alert.severity === "critical"}
                    />
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{alert.description}</p>

                  <div className="bg-muted/30 rounded-lg p-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Safety Tips
                    </p>
                    <ul className="space-y-1">
                      {alert.safetyTips.map((tip, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Help Request Form (simplified) */}
            {showHelpForm && (
              <div className="bg-card border border-border rounded-xl p-5 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Request Help</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowHelpForm(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button className="p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-center">
                    <Heart className="h-6 w-6 mx-auto mb-2 text-critical" />
                    <span className="text-sm font-medium">Medical</span>
                  </button>
                  <button className="p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-center">
                    <Utensils className="h-6 w-6 mx-auto mb-2 text-warning" />
                    <span className="text-sm font-medium">Food</span>
                  </button>
                  <button className="p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-center">
                    <Home className="h-6 w-6 mx-auto mb-2 text-info" />
                    <span className="text-sm font-medium">Shelter</span>
                  </button>
                  <button className="p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-center">
                    <Truck className="h-6 w-6 mx-auto mb-2 text-success" />
                    <span className="text-sm font-medium">Rescue</span>
                  </button>
                </div>
                <Button variant="hero" className="w-full">
                  Continue Request
                </Button>
              </div>
            )}

            {/* Emergency Contacts */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                Emergency Contacts
              </h3>
              <div className="space-y-3">
                {emergencyContacts.map((contact, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{contact.name}</p>
                      <p className="text-xs text-muted-foreground">{contact.available}</p>
                    </div>
                    <a
                      href={`tel:${contact.number}`}
                      className="text-lg font-bold text-primary hover:text-primary/80"
                    >
                      {contact.number}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Your Location
              </h3>
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  Enable location to see nearby disasters
                </p>
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4" />
                  Enable Location
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">DisasterRelief</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Disaster Relief Coordination Platform. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
