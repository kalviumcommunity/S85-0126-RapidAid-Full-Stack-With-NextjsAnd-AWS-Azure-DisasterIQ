"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/app/components";

type RoleRequest = {
  id: string;
  userId: string;
  state: string;
  preferredRole: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export default function OperationsPage() {
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH ROLE REQUESTS =================
  useEffect(() => {
    const fetchRoleRequests = async () => {
      try {
        const res = await fetch(
          "/Api/volunteer/admin/role-requests",
          { credentials: "include" }
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to fetch requests");
        }

        setRequests(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoleRequests();
  }, []);

  // ================= APPROVE =================
  const handleApprove = async (userId: string) => {
    try {
      const res = await fetch(
        `/Api/volunteer/admin/approve/${userId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Approval failed");
      }

      setRequests((prev) =>
        prev.map((req) =>
          req.userId === userId
            ? {
                ...req,
                status: "APPROVED",
                approvedBy: json.data?.approvedBy || "ADMIN",
                approvedAt: json.data?.approvedAt || new Date().toISOString(),
              }
            : req
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ================= REJECT =================
  const handleReject = async (userId: string) => {
    try {
      const res = await fetch(
        `/Api/volunteer/admin/reject/${userId}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Rejection failed");
      }

      setRequests((prev) =>
        prev.map((req) =>
          req.userId === userId
            ? {
                ...req,
                status: "REJECTED",
              }
            : req
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ================= STATUS COLOR =================
  const getStatusColor = (status: string) => {
    if (status === "APPROVED") return "text-green-400";
    if (status === "REJECTED") return "text-red-400";
    return "text-yellow-400";
  };

  return (
    <DashboardLayout role="responder" userName="Relief Coordinator">
      <div className="space-y-4 text-white">
        <h1 className="text-3xl font-bold">Ongoing Operations</h1>

        <p className="text-white/60">
          Track relief operations and volunteer deployment here.
        </p>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          {loading && <p className="text-white/70">Loading requests...</p>}
          {error && <p className="text-red-400">❌ {error}</p>}

          {!loading && !error && requests.length === 0 && (
            <p className="text-white/70">No role requests found.</p>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-lg bg-black/30 border border-white/10 p-4 space-y-2"
                >
                  {/* USER */}
                  <p className="font-semibold text-lg">{req.user.name}</p>
                  <p className="text-xs text-white/50">
                    User ID: {req.user.id}
                  </p>
                  <p className="text-sm text-white/70">
                    Email: {req.user.email}
                  </p>

                  {/* REQUEST */}
                  <p className="text-sm">
                    State: <span className="font-medium">{req.state}</span>
                  </p>

                  <p className="text-sm">
                    Preferred Role:{" "}
                    <span className="font-medium">
                      {req.preferredRole}
                    </span>
                  </p>

                  <p className={`text-sm font-semibold ${getStatusColor(req.status)}`}>
                    Status: {req.status}
                  </p>

                  {/* APPROVED INFO */}
                  {req.status === "APPROVED" && (
                    <div className="text-xs text-white/60">
                      <p>Approved By: {req.approvedBy}</p>
                      <p>
                        Approved At:{" "}
                        {req.approvedAt &&
                          new Date(req.approvedAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-white/40">
                    Requested At:{" "}
                    {new Date(req.createdAt).toLocaleString()}
                  </p>

                  {/* ACTIONS */}
                  {req.status === "PENDING" && (
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => handleApprove(req.userId)}
                        className="px-4 py-1.5 rounded-md bg-green-600 hover:bg-green-700 text-sm font-medium"
                      >
                        🟢 Approve
                      </button>

                      <button
                        onClick={() => handleReject(req.userId)}
                        className="px-4 py-1.5 rounded-md bg-red-600 hover:bg-red-700 text-sm font-medium"
                      >
                        🔴 Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
