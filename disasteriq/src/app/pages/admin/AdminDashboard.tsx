"use client";

import {
  AlertTriangle,
  Building2,
  Users,
  Activity,
  TrendingUp,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { StatCard } from "@/app/components/StatCart";
import { DisasterCard } from "@/app/components/DisasterCart";
import { StatusBadge } from "@/app/components/StatusBadge";
import { Button } from "@/app/components/ui/button";

const recentDisasters = [
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
    title: "Cyclone Alert - Coastal Areas",
    type: "Cyclone",
    location: "Eastern Coastal Zone",
    severity: "warning" as const,
    status: "monitoring" as const,
    affectedCount: 120345678000,
    lastUpdate: "4 hours ago",
  },
  {
    id: "3",
    title: "Earthquake Recovery Operations",
    type: "Earthquake",
    location: "Southern Hills Region",
    severity: "info" as const,
    status: "active" as const,
    affectedCount: 28000000000000000,
    lastUpdate: "1 day ago",
  },
];

const pendingApprovals = [
  { id: "1", name: "Red Cross Regional Chapter", type: "NGO", submittedAt: "2 hours ago" },
  { id: "2", name: "City General Hospital", type: "Hospital", submittedAt: "5 hours ago" },
  { id: "3", name: "Relief Foundation", type: "NGO", submittedAt: "1 day ago" },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout role="admin" userName="Admin User">
      <div className="space-y-8 p-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Overview of disaster relief operations and system status
            </p>
          </div>
          <Button variant="default" size="lg">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Create Disaster Record
          </Button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Disasters"
            value={127}
            icon={AlertTriangle}
            trend={{ value: 12, isPositive: false }}
          />
          <StatCard
            title="Active Disasters"
            value={8}
            icon={Activity}
            variant="critical"
            trend={{ value: 3, isPositive: false }}
          />
          <StatCard
            title="Registered Organizations"
            value={342}
            icon={Building2}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Total Users"
            value="12.4K"
            icon={Users}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent disasters */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">Active Disasters</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            <div className="grid gap-4">
              {recentDisasters.map((disaster) => (
                <DisasterCard key={disaster.id} {...disaster} />
              ))}
            </div>
          </div>

          {/* Sidebar panels */}
          <div className="space-y-6">
            {/* Pending Approvals */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-foreground">Pending Approvals</h3>
                <StatusBadge status="warning" label={`${pendingApprovals.length} pending`} />
              </div>
              <div className="space-y-4">
                {pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{item.type}</span>
                        <span>•</span>
                        <span>{item.submittedAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="default">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-base font-semibold mb-4 text-foreground">System Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-foreground">API Services</span>
                  </div>
                  <StatusBadge status="success" label="Operational" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-foreground">Database</span>
                  </div>
                  <StatusBadge status="success" label="Healthy" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-600" />
                    <span className="text-sm text-foreground">Alert System</span>
                  </div>
                  <StatusBadge status="warning" label="Degraded" />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">New registrations</span>
                  <span className="font-semibold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-success" />
                    156
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Help requests</span>
                  <span className="font-semibold">892</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resources deployed</span>
                  <span className="font-semibold">2,341</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
