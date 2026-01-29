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
  { name: "Medical Beds", available: 45, total: 60 },
  { name: "Food Packets", available: 2500, total: 5000 },
  { name: "Medicine Kits", available: 120, total: 200 },
  { name: "Vehicles", available: 8, total: 12 },
  { name: "Volunteers", available: 85, total: 120 },
];

export default function ResponderDashboard() {
  return (
    <DashboardLayout role="responder" userName="Relief Coordinator">
      <div className="space-y-8 text-white">

        {/* Header */}
        <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Responder Dashboard</h1>
            <p className="text-sm text-white/70">
              Manage relief operations and resource deployment
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Package className="h-4 w-4 mr-2" />
            Update Resources
          </Button>
        </div>

        {/* Organization Card */}
        <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Heart className="h-7 w-7 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Red Cross Regional Chapter</h2>
              <StatusBadge status="success" label="Verified" />
            </div>
            <p className="text-sm text-white/70">
              NGO • Active since 2015 • 120 volunteers
            </p>
          </div>
          <Button variant="outline">Edit</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Operations" value={4} icon={AlertTriangle} variant="critical" />
          <StatCard title="Pending Requests" value={23} icon={Clock} variant="warning" />
          <StatCard title="Completed Today" value={47} icon={CheckCircle} variant="success" />
          <StatCard title="Volunteers Active" value={85} icon={Users} variant="info" />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Assigned Disasters */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Assigned Disasters</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>

              <div className="space-y-3">
                {assignedDisasters.map(d => (
                  <div
                    key={d.id}
                    className="p-4 rounded-lg border border-white/10 bg-white/5 flex justify-between"
                  >
                    <div>
                      <p className="font-medium">{d.title}</p>
                      <div className="flex items-center gap-3 text-sm text-white/70 mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {d.location}
                        </span>
                        <span>{d.distance} away</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{d.requestsCount}</p>
                      <p className="text-xs text-white/60">pending</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relief Requests */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <h3 className="font-semibold mb-4">Incoming Requests</h3>
              <div className="space-y-2">
                {reliefRequests.map(r => (
                  <div
                    key={r.id}
                    className="p-3 rounded-lg hover:bg-white/10 transition flex justify-between"
                  >
                    <div>
                      <p className="font-medium">{r.type}</p>
                      <p className="text-xs text-white/60">{r.location}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/60">{r.time}</span>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">

            {/* Resources */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-4">
                {resources.map(r => {
                  const percent = (r.available / r.total) * 100;
                  return (
                    <div key={r.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{r.name}</span>
                        <span className="text-white/60">
                          {r.available}/{r.total}
                        </span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Operations */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <h3 className="font-semibold mb-4">Ongoing Operations</h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Truck className="h-4 w-4 text-green-400 inline mr-2" />
                  Food Distribution
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Heart className="h-4 w-4 text-blue-400 inline mr-2" />
                  Medical Camp
                </div>
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <Users className="h-4 w-4 text-yellow-400 inline mr-2" />
                  Evacuation Support
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
