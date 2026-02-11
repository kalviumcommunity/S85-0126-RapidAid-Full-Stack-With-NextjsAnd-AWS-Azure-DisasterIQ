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

/* ================= DATA (UNCHANGED) ================= */

const activeAlerts = [
  {
    id: "1",
    title: "Flash Flood Warning",
    location: "Northern Valley District",
    severity: "critical",
    time: "Active Now",
    description:
      "Heavy rainfall causing flash floods. Avoid low-lying areas. Evacuation recommended for Zone A residents.",
    safetyTips: [
      "Move to higher ground immediately",
      "Do not attempt to cross flooded areas",
      "Keep emergency kit ready",
    ],
  },
  {
    id: "2",
    title: "Cyclone Alert",
    location: "Eastern Coastal Zone",
    severity: "warning",
    time: "Expected in 24 hours",
    description:
      "Cyclone approaching coastal areas. Wind speeds expected to reach 120 km/h.",
    safetyTips: [
      "Secure all windows and doors",
      "Stock up on essentials",
      "Follow evacuation orders if issued",
    ],
  },
  {
    id: "3",
    title: "Earthquake Advisory",
    location: "Southern Hills Region",
    severity: "info",
    time: "Aftershocks possible",
    description:
      "Recent seismic activity detected. Be prepared for possible aftershocks.",
    safetyTips: [
      "Stay away from damaged structures",
      "Drop, cover, and hold during shaking",
      "Check on neighbors",
    ],
  },
];

const emergencyContacts = [
  { name: "Emergency Helpline", number: "112", available: "24/7" },
  { name: "Disaster Management", number: "1070", available: "24/7" },
  { name: "Medical Emergency", number: "108", available: "24/7" },
  { name: "Fire Service", number: "101", available: "24/7" },
];

/* ================= COMPONENT ================= */

export default function PublicAlerts() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHelpForm, setShowHelpForm] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b1220] text-slate-100">
      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0e1628]/80 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg">DisasterRelief</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/alerts" className="text-sm font-medium text-white">
              Alerts
            </Link>
            <Link
              href="/request-help"
              className="text-sm text-slate-400 hover:text-white"
            >
              Request Help
            </Link>
            <Link
              href="/resources"
              className="text-sm text-slate-400 hover:text-white"
            >
              Resources
            </Link>
            <Link href="/auth/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {/* ================= ALERT STRIP ================= */}
      <div className="bg-red-600 text-white py-2 text-center text-sm font-medium">
        <Bell className="inline h-4 w-4 mr-1 animate-pulse" />
        Flash Flood Warning active in Northern Valley District
      </div>

      {/* ================= MAIN ================= */}
      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold">Disaster Alerts</h1>
            <p className="text-slate-400 mt-1">
              Stay informed and act fast during emergencies
            </p>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowHelpForm(true)}
          >
            <Phone className="h-4 w-4 mr-2" />
            Request Help
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= ALERTS ================= */}
          <div className="lg:col-span-2 space-y-6">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-[#0e1628] border border-white/10 rounded-xl overflow-hidden"
              >
                <div
                  className={`h-1 ${
                    alert.severity === "critical"
                      ? "bg-red-500"
                      : alert.severity === "warning"
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                  }`}
                />

                <div className="p-5">
                  <div className="flex justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          className={
                            alert.severity === "critical"
                              ? "text-red-500"
                              : alert.severity === "warning"
                              ? "text-yellow-500"
                              : "text-blue-500"
                          }
                        />
                        <h3 className="font-semibold text-lg">
                          {alert.title}
                        </h3>
                      </div>

                      <div className="flex gap-4 text-sm text-slate-400 mt-1">
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
                      status={alert.severity as any}
                      label={alert.severity}
                      pulse={alert.severity === "critical"}
                    />
                  </div>

                  <p className="text-sm text-slate-300 mb-4">
                    {alert.description}
                  </p>

                  <div className="bg-black/30 rounded-lg p-4">
                    <p className="text-xs uppercase text-slate-400 mb-2">
                      Safety Tips
                    </p>
                    <ul className="space-y-1">
                      {alert.safetyTips.map((tip, i) => (
                        <li
                          key={i}
                          className="text-sm flex items-start gap-2"
                        >
                          <ChevronRight className="h-4 w-4 text-blue-400 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ================= SIDEBAR ================= */}
          <div className="space-y-6">
            {showHelpForm && (
              <div className="bg-[#0e1628] border border-white/10 rounded-xl p-5">
                <div className="flex justify-between mb-4">
                  <h3 className="font-semibold">Request Help</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowHelpForm(false)}
                  >
                    <X />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <HelpBtn icon={Heart} label="Medical" />
                  <HelpBtn icon={Utensils} label="Food" />
                  <HelpBtn icon={Home} label="Shelter" />
                  <HelpBtn icon={Truck} label="Rescue" />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Continue
                </Button>
              </div>
            )}

            <div className="bg-[#0e1628] border border-white/10 rounded-xl p-5">
              <h3 className="font-semibold mb-4">Emergency Contacts</h3>
              {emergencyContacts.map((c) => (
                <div
                  key={c.number}
                  className="flex justify-between py-2 border-b border-white/10 last:border-0"
                >
                  <div>
                    <p className="text-sm">{c.name}</p>
                    <p className="text-xs text-slate-400">{c.available}</p>
                  </div>
                  <a
                    href={`tel:${c.number}`}
                    className="font-bold text-blue-400"
                  >
                    {c.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= HELPER ================= */

function HelpBtn({
  icon: Icon,
  label,
}: {
  icon: any;
  label: string;
}) {
  return (
    <button className="bg-black/30 hover:bg-black/40 border border-white/10 rounded-lg p-4 text-center transition">
      <Icon className="h-6 w-6 mx-auto mb-2 text-blue-400" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
