"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  AlertTriangle,
  Building2,
  MapPin,
  Users,
  DollarSign,
  Download,
} from "lucide-react";

import { DashboardLayout } from "@/app/components/DashboardLayout";
import { StatCard } from "@/app/components/StatCart";
import { DisasterCard } from "@/app/components/DisasterCart";
import { Button } from "@/app/components/ui/button";

/* =========================
   TYPES (UI-SAFE)
========================= */
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

/* =========================
   HELPERS
========================= */
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

export default function GovernmentDashboard() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const res = await fetch("/Api/disasters/get");
        if (!res.ok) throw new Error("Failed to fetch disasters");

        const json = await res.json();

        /* ✅ ARRAY IS json.data */
        const normalized: Disaster[] = json.data.map((d: any) => ({
          id: d.id,
          title: d.name,
          type: d.type,
          location: d.location,
          severity: mapSeverity(d.severity),
          status: mapStatus(d.status),
          affectedCount: 0, // backend doesn't send this yet
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

  return (
    <DashboardLayout role="government" userName="Gov. Official">
      <div className="space-y-10">

        {/* HEADER */}
        <div className="rounded-2xl border bg-gradient-to-br from-blue-50 to-white p-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold">Government Dashboard</h1>
              <p className="text-slate-600">
                Regional disaster management and coordination center
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>

              <Link href="/government/disasters/create">
                <Button className="bg-red-600 hover:bg-red-700">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Declare Emergency
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* REGION */}
        <div className="rounded-xl border bg-card p-6 flex items-center gap-4">
          <MapPin className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="font-semibold">Northern Regional Authority</h2>
            <p className="text-sm text-muted-foreground">
              Managing 5 districts • Population: 2.4M
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Active Disasters" value={disasters.length} icon={AlertTriangle} variant="critical" />
          <StatCard title="People Affected" value="—" icon={Users} variant="warning" />
          <StatCard title="Coordinating Orgs" value={12} icon={Building2} variant="success" />
          <StatCard title="Funds Allocated" value="$4.2M" icon={DollarSign} variant="info" />
        </div>

        {/* DISASTERS */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Active & Monitored Disasters
          </h2>

          {loading ? (
            <p className="text-muted-foreground">Loading disasters...</p>
          ) : disasters.length === 0 ? (
            <p className="text-muted-foreground">No disasters found</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {disasters.map((d) => (
                <DisasterCard key={d.id} {...d} />
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
