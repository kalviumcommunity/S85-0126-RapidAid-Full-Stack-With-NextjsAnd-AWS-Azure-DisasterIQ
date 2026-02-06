"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  AlertTriangle,
  Bell,
  MapPin,
  Users,
  FileText,
  CheckCircle,
  Phone,
  Shield,
} from "lucide-react";

import { DashboardLayout } from "@/app/components/DashboardLayout";
import { StatCard } from "@/app/components/StatCart";
import { DisasterCard } from "@/app/components/DisasterCart";
import { Button } from "@/app/components/ui/button";
import { authApi } from "@/app/lib/authFetch";

/* ===================== TYPES ===================== */

type Severity = "critical" | "warning" | "info";

type Disaster = {
  id: string;
  title: string;
  type: string;
  location: string;
  severity: Severity;
  status: "active" | "monitoring" | "resolved";
  affectedCount: number;
  lastUpdate: string;
};

/* ===================== HELPERS ===================== */

const mapSeverity = (value: number): Severity => {
  if (value >= 7) return "critical";
  if (value >= 4) return "warning";
  return "info";
};

const mapStatus = (
  status: string
): "active" | "monitoring" | "resolved" => {
  if (status === "RESOLVED") return "resolved";
  if (status === "ONGOING") return "active";
  return "monitoring"; // REPORTED
};

/* ===================== COMPONENT ===================== */

export default function PublicDashboard() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===================== FETCH DISASTERS ===================== */

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const res = await authApi.get("/Api/disasters/get");
        if (!res.ok) throw new Error("Failed to fetch disasters");

        const json = await res.json();

        const normalized: Disaster[] = json.data.map((d: any) => ({
          id: d.id,
          title: d.name,
          type: d.type,
          location: d.location,
          severity: mapSeverity(d.severity),
          status: mapStatus(d.status),
          affectedCount: 0,
          lastUpdate: new Date(d.reportedAt).toLocaleString(),
        }));

        setDisasters(normalized);
      } catch (err) {
        console.error("Error fetching disasters:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasters();
  }, []);

  /* ===================== BUTTON HANDLERS ===================== */

  const handleRequestHelp = () => {
    alert("Request help feature coming soon!");
  };

  return (
    <DashboardLayout role="public" userName="Public User">
      <div className="space-y-8 text-white">

        {/* Header */}
        <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-2">Public Safety Portal</h1>
            <p className="text-sm text-white/70">
              Stay informed about disasters and request assistance
            </p>
          </div>
        </div>

        {/* Alert Status */}
        <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Bell className="h-7 w-7 text-yellow-400" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Alert Status</h2>
              <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300">
                NORMAL
              </span>
            </div>

            <p className="text-sm text-white/70">
              No active emergencies in your area
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Alerts"
            value={disasters.filter((d) => d.status === "active").length}
            icon={AlertTriangle}
            variant="critical"
          />
          <StatCard
            title="Help Requests"
            value={156}
            icon={FileText}
            variant="warning"
          />
          <StatCard
            title="People Helped"
            value={2500}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Response Time"
            value="12 min"
            icon={Phone}
            variant="info"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Active Disasters */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Current Disasters</h3>

                <Link href="/public/alerts">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <p className="text-white/70">Loading disasters...</p>
                ) : disasters.length === 0 ? (
                  <p className="text-white/70">No active disasters</p>
                ) : (
                  disasters.slice(0, 3).map((disaster) => (
                    <DisasterCard key={disaster.id} {...disaster} />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <h3 className="font-semibold mb-4">Get Help</h3>

              <div className="space-y-3">
                <Button 
                  className="w-full justify-start bg-red-600 hover:bg-red-700"
                  onClick={handleRequestHelp}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Request Assistance
                </Button>

                <Button className="w-full justify-start" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  Find Shelter
                </Button>

                <Button className="w-full justify-start" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Contacts
                </Button>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <h3 className="font-semibold mb-4">Safety Tips</h3>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Shield className="h-4 w-4 text-blue-400 inline mr-2" />
                  Keep emergency kit ready
                </div>

                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="h-4 w-4 text-green-400 inline mr-2" />
                  Know evacuation routes
                </div>

                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <Bell className="h-4 w-4 text-yellow-400 inline mr-2" />
                  Stay informed via alerts
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
