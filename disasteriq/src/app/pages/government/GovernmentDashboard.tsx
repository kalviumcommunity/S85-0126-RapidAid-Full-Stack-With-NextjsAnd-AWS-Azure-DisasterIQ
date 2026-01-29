"use client";
import Link from "next/link";

import {
  AlertTriangle,
  Building2,
  MapPin,
  Users,
  DollarSign,
  Download,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { DashboardLayout } from "@/app/components/DashboardLayout";
import { StatCard } from "@/app/components/StatCart";
import { DisasterCard } from "@/app/components/DisasterCart";
import { Button } from "@/app/components/ui/button";

const regionDisasters = [
  {
    id: "1",
    title: "Flash Floods in Valley Region",
    type: "Flood",
    location: "Northern Valley District",
    severity: "critical" as const,
    status: "active" as const,
    affectedCount: 457345,
    lastUpdate: "2 hours ago",
  },
  {
    id: "2",
    title: "Landslide Warning - Hill Areas",
    type: "Landslide",
    location: "Eastern Hills",
    severity: "warning" as const,
    status: "monitoring" as const,
    affectedCount: 8500,
    lastUpdate: "6 hours ago",
  },
];

export default function GovernmentDashboard() {
  const router = useRouter();

  return (
    <DashboardLayout role="government" userName="Gov. Official">
      <div className="space-y-10">

        {/* ===== HEADER CARD ===== */}
        <div className="rounded-2xl border bg-gradient-to-br from-blue-50 to-white p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-2xl font-semibold">
                Government Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
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

        {/* ===== REGION INFO ===== */}
        <div className="rounded-xl border bg-card p-6 flex items-center gap-4">
          <MapPin className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="font-semibold">
              Northern Regional Authority
            </h2>
            <p className="text-sm text-muted-foreground">
              Managing 5 districts • Population: 2.4M
            </p>
          </div>
        </div>

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Active Disasters"
            value={3}
            icon={AlertTriangle}
            variant="critical"
          />
          <StatCard
            title="People Affected"
            value="53.5K"
            icon={Users}
            variant="warning"
          />
          <StatCard
            title="Coordinating Orgs"
            value={12}
            icon={Building2}
            variant="success"
          />
          <StatCard
            title="Funds Allocated"
            value="$4.2M"
            icon={DollarSign}
            variant="info"
          />
        </div>

        {/* ===== DISASTERS ===== */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Active & Monitored Disasters
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {regionDisasters.map((d) => (
              <DisasterCard key={d.id} {...d} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
