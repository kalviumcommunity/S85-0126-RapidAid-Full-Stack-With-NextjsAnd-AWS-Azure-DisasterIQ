"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  AlertTriangle,
  Heart,
  Truck,
  Users,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  Bell,
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

type TaskRequest = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  disaster?: {
    id: string;
    name: string;
    type: string;
  };
  ngoId: string;
  governmentId: string;
  requestedById: string;
  createdAt: string;
  respondedAt?: string;
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

export default function NGODashboard() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [tasks, setTasks] = useState<TaskRequest[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("/Api/ngoRequest/ngo/me", {
          method: "GET",
          credentials: "include"
        });

        const data = await res.json();

        if (data.success) {
          setTasks(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch NGO tasks", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  /* ===================== TASK HANDLERS ===================== */

  const handleRespondToTask = async (taskId: string, status: "ACCEPTED" | "REJECTED") => {
    try {
      const response = await authApi.patch(`/Api/ngo/tasks/${taskId}/respond`, {
        status,
      });

      if (response.ok) {
        alert(`Task ${status.toLowerCase()} successfully!`);
        
        // Refresh tasks
        const tasksRes = await authApi.get("/api/ngoRequest/ngo/me");
        if (tasksRes.ok) {
          const tasksJson = await tasksRes.json();
          setTasks(tasksJson.data?.requests || []);
        }
      } else {
        alert("Failed to respond to task");
      }
    } catch (error) {
      console.error("Error responding to task:", error);
      alert("Error responding to task");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED": return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "REJECTED": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <Clock className="h-4 w-4 text-yellow-400" />;
    }
  };

  /* ===================== BUTTON HANDLERS ===================== */

  const handleRequestResources = () => {
    alert("Request resources feature coming soon!");
  };

  return (
    <DashboardLayout role="ngo" userName="NGO Coordinator">
      <div className="space-y-8 text-white">

        {/* Header */}
        <div className="rounded-2xl bg-white/5 backdrop-blur border border-white/10 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">NGO Dashboard</h1>
            <p className="text-sm text-white/70">
              Coordinate relief efforts and resource management
            </p>
          </div>

          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={handleRequestResources}
          >
            <Package className="h-4 w-4 mr-2" />
            Request Resources
          </Button>
        </div>

        {/* Organization Card */}
        <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Heart className="h-7 w-7 text-green-400" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Relief Foundation</h2>
            </div>

            <p className="text-sm text-white/70">
              NGO • Active since 2018 • 85 volunteers
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Disasters"
            value={disasters.filter((d) => d.status === "active").length}
            icon={AlertTriangle}
            variant="critical"
          />
          <StatCard
            title="Assigned Tasks"
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
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Active Disasters</h3>

                <Link href="/responder/disasters">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <p className="text-white/70">Loading disasters...</p>
                ) : disasters.length === 0 ? (
                  <p className="text-white/70">No disasters found</p>
                ) : (
                  disasters.slice(0, 3).map((disaster) => (
                    <DisasterCard key={disaster.id} {...disaster} />
                  ))
                )}
              </div>
            </div>

            {/* Task Notifications */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <div className="flex justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Task Notifications
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-white/70">
                    {tasks.filter((t) => t.status === "PENDING").length} pending
                  </span>
                  <Link href="/ngo/requests">
                    <Button variant="ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-3">
                {loading && <p>Loading tasks...</p>}
                
                {!loading && tasks.length === 0 && (
                  <p className="text-white/60">No assigned tasks yet</p>
                )}
                
                {!loading && tasks.length > 0 && tasks.slice(0, 3).map(task => (
                  <div key={task.id} className="p-3 rounded-lg bg-white/5">
                    <p className="font-semibold">{task.disaster?.name || 'Disaster Assignment'}</p>
                    <p className="text-sm text-white/70">
                      Status: {task.status}
                    </p>
                  </div>
                ))}
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
                  <Truck className="h-4 w-4 mr-2" />
                  Deploy Resources
                </Button>

                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Manage Volunteers
                </Button>

                <Button className="w-full justify-start" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Request Supplies
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-xl bg-white/5 border border-white/10 backdrop-blur p-5">
              <h3 className="font-semibold mb-4">Recent Activity</h3>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <Truck className="h-4 w-4 text-green-400 inline mr-2" />
                  Resource deployment completed
                </div>

                <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Heart className="h-4 w-4 text-blue-400 inline mr-2" />
                  50 volunteers registered
                </div>

                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <Package className="h-4 w-4 text-yellow-400 inline mr-2" />
                  Supply request approved
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
