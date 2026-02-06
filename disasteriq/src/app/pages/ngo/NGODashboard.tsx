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
  title: string;
  description: string;
  priority: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  disaster?: {
    id: string;
    name: string;
    type: string;
  };
  government: {
    id: string;
    name: string;
    state: string;
  };
  requestedBy: {
    id: string;
    name: string;
    email: string;
  };
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
    const fetchData = async () => {
      try {
        // Fetch disasters
        const disastersRes = await authApi.get("/Api/disasters/get");
        if (disastersRes.ok) {
          const disastersJson = await disastersRes.json();

          const normalized: Disaster[] = disastersJson.data.map((d: any) => ({
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
        }

        // Fetch NGO tasks
        const tasksRes = await authApi.get("/Api/ngo/tasks");
        if (tasksRes.ok) {
          const tasksJson = await tasksRes.json();
          setTasks(tasksJson.data || []);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
        const tasksRes = await authApi.get("/Api/ngo/tasks");
        if (tasksRes.ok) {
          const tasksJson = await tasksRes.json();
          setTasks(tasksJson.data || []);
        }
      } else {
        alert("Failed to respond to task");
      }
    } catch (error) {
      console.error("Error responding to task:", error);
      alert("Error responding to task");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "text-red-400";
      case "MEDIUM": return "text-yellow-400";
      case "LOW": return "text-green-400";
      default: return "text-gray-400";
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

                <Link href="/ngo/disasters">
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
                {tasks.length === 0 ? (
                  <p className="text-white/70">No task assignments</p>
                ) : (
                  tasks.map((task) => (
                    <div key={task.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-white/70 mb-2">{task.description}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                              {task.priority} Priority
                            </span>
                            {task.disaster && (
                              <span className="text-white/50">
                                • Disaster: {task.disaster.name}
                              </span>
                            )}
                          </div>
                          {task.requestedBy && (
                            <p className="text-xs text-white/50">
                              From: {task.requestedBy.name} ({task.government.name})
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <span className="text-sm font-medium">{task.status}</span>
                        </div>
                      </div>

                      {/* Action Buttons for PENDING tasks */}
                      {task.status === "PENDING" && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            onClick={() => handleRespondToTask(task.id, "ACCEPTED")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRespondToTask(task.id, "REJECTED")}
                            className="border-red-600 text-red-400 hover:bg-red-600/10"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {/* Response info for COMPLETED tasks */}
                      {task.status !== "PENDING" && task.respondedAt && (
                        <div className="mt-3 p-3 rounded bg-white/10 border border-white/20">
                          <p className="text-xs text-white/60">
                            Responded {new Date(task.respondedAt).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
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
