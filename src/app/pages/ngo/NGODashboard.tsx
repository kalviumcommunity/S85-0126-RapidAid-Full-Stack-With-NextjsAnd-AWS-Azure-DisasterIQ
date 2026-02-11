"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  AlertTriangle,
  
  Truck,
  Users,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Bell,
  
} from "lucide-react";

import { DashboardLayout } from "@/app/components";
import { StatCard } from "@/app/components/StatCart";
import { DisasterCard } from "@/app/components/DisasterCart";
import { Button } from "@/app/components/ui";
import { authApi } from "@/app/lib/authFetch";

/* ===================== TYPES ===================== */

type Disaster = {
  id: string;
  name: string;
  type: string;
  location: string;
  severity: number;
  status: string;
  reportedAt: string;
};

type TaskRequest = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  disaster?: Disaster;
  createdAt: string;
};

/* ===================== COMPONENT ===================== */

export default function NGODashboard() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [tasks, setTasks] = useState<TaskRequest[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Fetch NGO tasks
        const tasksRes = await authApi.get("/Api/ngoRequest/ngo/me");
        if (tasksRes.ok) {
          const json = await tasksRes.json();
          setTasks(json.data?.items ?? []);
        }

        // 🔹 Fetch disasters assigned to NGO
        const disasterRes = await authApi.get("/Api/disasters/get");
        if (disasterRes.ok) {
          const json = await disasterRes.json();
          setDisasters(json.data?.items ?? []);
        }
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ===================== HELPERS ===================== */

  const getStatusIcon = (status: TaskRequest["status"]) => {
    if (status === "ACCEPTED")
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    if (status === "REJECTED")
      return <XCircle className="h-4 w-4 text-red-400" />;
    return <Clock className="h-4 w-4 text-yellow-400" />;
  };

  /* ===================== UI ===================== */

  return (
    <DashboardLayout role="ngo" userName="NGO Coordinator">
      <div className="space-y-8 text-white">

        {/* Header */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold">NGO Dashboard</h1>
            <p className="text-sm text-white/70">
              Coordinate relief efforts and manage assignments
            </p>
          </div>

          <Button className="bg-green-600 hover:bg-green-700">
            <Package className="h-4 w-4 mr-2" />
            Request Resources
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Disasters"
            value={disasters.filter((d) => d.status === "ONGOING").length}
            icon={AlertTriangle}
            variant="critical"
          />
          <StatCard
            title="Pending Tasks"
            value={tasks.filter((t) => t.status === "PENDING").length}
            icon={Bell}
            variant="warning"
          />
          <StatCard
            title="Resources Available"
            value={2500}
            icon={Package}
            variant="success"
          />
          <StatCard
            title="Volunteers Active"
            value={85}
            icon={Users}
            variant="info"
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">

            {/* Disasters */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-5">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Active Disasters</h3>
                <Link href="/responder/disasters">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {loading ? (
                <p className="text-white/70">Loading disasters...</p>
              ) : disasters.length === 0 ? (
                <p className="text-white/70">No disasters assigned</p>
              ) : (
                disasters.slice(0, 3).map((d) => (
                  <DisasterCard
                    key={d.id}
                    id={d.id}
                    title={d.name}
                    type={d.type}
                    location={d.location}
                    severity={
                      d.severity >= 7
                        ? "critical"
                        : d.severity >= 4
                        ? "warning"
                        : "info"
                    }
                    status="active"
                    affectedCount={0}
                    lastUpdate={d.reportedAt}
                  />
                ))
              )}
            </div>

            {/* Tasks */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-5">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Task Notifications
                </h3>
                <Link href="/ngo/requests">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              {loading ? (
                <p>Loading tasks...</p>
              ) : tasks.length === 0 ? (
                <p className="text-white/60">No tasks assigned</p>
              ) : (
                tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex justify-between items-center p-3 rounded-lg bg-white/5"
                  >
                    <div>
                      <p className="font-medium">
                        {task.disaster?.name ?? "Disaster Assignment"}
                      </p>
                      <p className="text-xs text-white/60">
                        {new Date(task.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {getStatusIcon(task.status)}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right */}
          <div className="space-y-6">

            {/* Quick Actions */}
            <div className="rounded-xl bg-white/5 border border-white/10 p-5">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Truck className="h-4 w-4 mr-2" />
                  Deploy Resources
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Volunteers
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
