"use client";

import {
  AlertTriangle,
  Building2,
  MapPin,
  Users,
  Truck,
  DollarSign,
  FileText,
  Download,
} from "lucide-react";

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
    affectedCount: 45000,
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

const coordinatingOrgs = [
  { name: "Red Cross Regional", type: "NGO", status: "active", resources: 45 },
  { name: "City General Hospital", type: "Hospital", status: "active", resources: 120 },
  { name: "Relief Foundation", type: "NGO", status: "standby", resources: 32 },
  { name: "Medical Corps", type: "Hospital", status: "active", resources: 88 },
];

export default function GovernmentDashboard() {
  return (
    <DashboardLayout role="government" userName="Gov. Official">
      <div className="space-y-8 p-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Government Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Regional disaster management and coordination center
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
            <Button>
              <AlertTriangle className="h-4 w-4 mr-2" />
              Declare Emergency
            </Button>
          </div>
        </div>

        {/* Region Overview */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <div>
              <h2 className="text-base font-semibold">
                Northern Regional Authority
              </h2>
              <p className="text-sm text-muted-foreground">
                Managing 5 districts • Population: 2.4M
              </p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
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

        {/* Disasters */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {regionDisasters.map((disaster) => (
              <DisasterCard key={disaster.id} {...disaster} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
