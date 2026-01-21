"use client";

import {
  AlertTriangle,
  Heart,
  Truck,
  Users,
  Package,
  CheckCircle,
  Clock,
  MapPin,
} from "lucide-react";
import { DashboardLayout } from "@/app/components/DashboardLayout";
import { StatCard } from "@/app/components/StatCart";
import { StatusBadge } from "@/app/components/StatusBadge";
import { Button } from "@/app/components/ui/button";

const assignedDisasters = [
  {
    id: "1",
    title: "Flash Floods in Valley Region",
    location: "Northern Valley District",
    severity: "critical",
    distance: "12 km",
    requestsCount: 45,
  },
  {
    id: "2",
    title: "Landslide Warning - Hill Areas",
    location: "Eastern Hills",
    severity: "warning",
    distance: "28 km",
    requestsCount: 12,
  },
];

const reliefRequests = [
  { id: "1", type: "Medical", location: "Block A, Valley", urgency: "critical", time: "10 min ago" },
  { id: "2", type: "Food", location: "Block C, Valley", urgency: "warning", time: "25 min ago" },
  { id: "3", type: "Shelter", location: "Block B, Valley", urgency: "warning", time: "1 hour ago" },
  { id: "4", type: "Rescue", location: "Block D, Valley", urgency: "critical", time: "2 hours ago" },
];

const resources = [
  { name: "Medical Beds", available: 45, total: 60, unit: "beds" },
  { name: "Food Packets", available: 2500, total: 5000, unit: "packets" },
  { name: "Medicine Kits", available: 120, total: 200, unit: "kits" },
  { name: "Vehicles", available: 8, total: 12, unit: "vehicles" },
  { name: "Volunteers", available: 85, total: 120, unit: "people" },
];

export default function ResponderDashboard() {
  return (
    <DashboardLayout role="responder" userName="Relief Coordinator">
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Responder Dashboard</h1>
            <p className="text-muted-foreground">
              Manage relief operations and resource deployment
            </p>
          </div>
          <Button variant="hero" size="lg">
            <Package className="h-4 w-4" />
            Update Resources
          </Button>
        </div>

        {/* Organization Profile Card */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 bg-success/10 rounded-xl flex items-center justify-center">
              <Heart className="h-8 w-8 text-success" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-semibold">Red Cross Regional Chapter</h2>
                <StatusBadge status="success" label="Verified" />
              </div>
              <p className="text-sm text-muted-foreground">
                NGO • Active since 2015 • 120 registered volunteers
              </p>
            </div>
            <Button variant="outline">Edit Profile</Button>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Operations"
            value={4}
            icon={AlertTriangle}
            variant="critical"
          />
          <StatCard
            title="Pending Requests"
            value={23}
            icon={Clock}
            variant="warning"
          />
          <StatCard
            title="Completed Today"
            value={47}
            icon={CheckCircle}
            variant="success"
          />
          <StatCard
            title="Volunteers Active"
            value={85}
            icon={Users}
            variant="info"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assigned Disasters */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Assigned Disasters</h3>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {assignedDisasters.map((disaster) => (
                  <div
                    key={disaster.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          disaster.severity === "critical"
                            ? "bg-critical/10 text-critical"
                            : "bg-warning/10 text-warning"
                        }`}
                      >
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{disaster.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {disaster.location}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {disaster.distance} away
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{disaster.requestsCount}</p>
                      <p className="text-xs text-muted-foreground">pending requests</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relief Requests */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Incoming Relief Requests</h3>
                <StatusBadge status="warning" label={`${reliefRequests.length} pending`} />
              </div>
              <div className="space-y-2">
                {reliefRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-3 hover:bg-muted/30 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <StatusBadge
                        status={request.urgency === "critical" ? "critical" : "warning"}
                        label={request.urgency}
                        pulse={request.urgency === "critical"}
                      />
                      <div>
                        <p className="text-sm font-medium">{request.type}</p>
                        <p className="text-xs text-muted-foreground">{request.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{request.time}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="success">
                          Accept
                        </Button>
                        <Button size="sm" variant="outline">
                          Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column - Resources */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Resource Availability</h3>
                <Button variant="ghost" size="sm">
                  Update
                </Button>
              </div>
              <div className="space-y-4">
                {resources.map((resource) => {
                  const percentage = (resource.available / resource.total) * 100;
                  const isLow = percentage < 30;
                  return (
                    <div key={resource.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{resource.name}</span>
                        <span className={`text-sm ${isLow ? "text-critical" : "text-muted-foreground"}`}>
                          {resource.available}/{resource.total}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isLow ? "bg-critical" : percentage < 50 ? "bg-warning" : "bg-success"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Ongoing Operations */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-semibold mb-4">Ongoing Operations</h3>
              <div className="space-y-3">
                <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">Food Distribution</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Block A • 2 teams deployed</p>
                </div>
                <div className="p-3 bg-info/5 border border-info/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-info" />
                    <span className="text-sm font-medium">Medical Camp</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Central Area • 45 patients</p>
                </div>
                <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Evacuation Support</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Block D • In progress</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
