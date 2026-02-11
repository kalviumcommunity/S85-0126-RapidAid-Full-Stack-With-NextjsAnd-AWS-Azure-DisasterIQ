"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  AlertTriangle,
  
  Activity,
  Users,
  Shield,
  CheckCircle,
  Bell,
  Stethoscope,
} from "lucide-react";

import { DashboardLayout } from "@/app/components";
import { StatCard } from "@/app/components/StatCart";
import { DisasterCard } from "@/app/components/DisasterCart";
import { Button } from "@/app/components/ui";
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

export default function HospitalDashboard() {
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

  const handleEmergencyResponse = () => {
    alert("Emergency response feature coming soon!");
  };

  return (
    <DashboardLayout role="hospital" userName="Hospital Admin">
      <div className="space-y-8 text-white">

        {/* Header */}
        <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Hospital Dashboard</h1>
            <p className="text-sm text-white/70">
              Emergency response and patient management
            </p>
          </div>

          <Button
            className="bg-red-600 hover:bg-red-700"
            onClick={handleEmergencyResponse}
          >
            <Bell className="h-4 w-4 mr-2" />
            Emergency Response
          </Button>
        </div>

        {/* Organization Card */}
        <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Stethoscope className="h-7 w-7 text-blue-400" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">City General Hospital</h2>
            </div>

            <p className="text-sm text-white/70">
              Hospital • Level 1 Trauma Center • 250 beds
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Emergency Cases"
            value={disasters.filter((d) => d.status === "active").length}
            icon={AlertTriangle}
            variant="critical"
          />
          <StatCard
            title="Available Beds"
            value={45}
            icon={Activity}
            variant="warning"
          />
          <StatCard
            title="Medical Staff"
            value={120}
            icon={Users}
            variant="info"
          />
          <StatCard
            title="Patients Treated"
            value={850}
            icon={CheckCircle}
            variant="success"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Disasters */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Emergency Cases</h3>

                <Link href="/hospital/disasters">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <p className="text-white/70">Loading disasters...</p>
                ) : disasters.length === 0 ? (
                  <p className="text-white/70">No emergency cases</p>
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
              <h3 className="font-semibold mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Emergency Protocol
                </Button>

                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Staff Management
                </Button>

                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Bed Status
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <h3 className="font-semibold mb-4">Recent Activity</h3>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertTriangle className="h-4 w-4 text-red-400 inline mr-2" />
                  Mass casualty incident
                </div>

                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <Activity className="h-4 w-4 text-yellow-400 inline mr-2" />
                  ICU capacity reached 80%
                </div>

                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <CheckCircle className="h-4 w-4 text-green-400 inline mr-2" />
                  25 patients discharged
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
