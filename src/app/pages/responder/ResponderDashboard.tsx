"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  AlertTriangle,
  Heart,
  Users,
  Package,
  CheckCircle,
  Clock,
} from "lucide-react";

import { DashboardLayout } from "@/app/components";
import { StatCard } from "@/app/components/StatCart";
import { StatusBadge } from "@/app/components/StatusBadge";
import { Button } from "@/app/components/ui";

/* ===================== TYPES ===================== */

type ReliefRequest = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  respondedAt?: string | null;
  disaster?: {
    type?: string;
    location?: string;
  };
};

/* ===================== COMPONENT ===================== */

export default function ResponderDashboard() {
  const router = useRouter();

  const [reliefRequests, setReliefRequests] = useState<ReliefRequest[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  /* ===================== FETCH NGO REQUESTS ===================== */

  useEffect(() => {
    const fetchNgoRequests = async () => {
      try {
        setLoadingRequests(true);
        setRequestError(null);

        // ✅ JWT-based NGO extraction on backend
        const res = await fetch(
          "http://localhost:3000/Api/ngoRequest/ngo/[ngoId]",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to fetch NGO requests");
        }

        // ✅ BACKEND RETURNS { items, count }
        setReliefRequests(json.data.items);
        setTotalCount(json.data.count);
      } catch (err: any) {
        setRequestError(err.message);
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchNgoRequests();
  }, []);

  /* ===================== RESPOND HANDLER ===================== */

  const respondToRequest = async (
    requestId: string,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      setActionLoadingId(requestId);

      const res = await fetch(
        "http://localhost:3000/Api/ngoRequest/respond",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId,
            status,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to respond to request");
      }

      // ✅ Optimistic update
      setReliefRequests((prev) =>
        prev.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: status === "APPROVED" ? "ACCEPTED" : "REJECTED",
                respondedAt: new Date().toISOString(),
              }
            : req
        )
      );
    } catch (error: any) {
      alert(error.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  /* ===================== DERIVED DATA ===================== */

  const pendingCount = reliefRequests.filter(
    (r) => r.status === "PENDING"
  ).length;

  /* ===================== UI ===================== */

  return (
    <DashboardLayout role="responder" userName="Relief Coordinator">
      <div className="space-y-8 text-white">

        {/* Header */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 flex justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Responder Dashboard</h1>
            <p className="text-sm text-white/70">
              Manage relief operations and resource deployment
            </p>
          </div>

          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push("/responder/resources")}
          >
            <Package className="h-4 w-4 mr-2" />
            Update Resources
          </Button>
        </div>

        {/* Organization */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-5 flex gap-4">
          <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Heart className="h-7 w-7 text-green-400" />
          </div>

          <div className="flex-1">
            <h2 className="font-semibold">Helping Hands Foundation</h2>
            <p className="text-sm text-white/70">NGO • Active Operations</p>
          </div>

          <StatusBadge status="success" label="Verified" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Active Operations"
            value={4}
            icon={AlertTriangle}
            variant="critical"
          />
          <StatCard
            title="Pending Requests"
            value={loadingRequests ? 0 : pendingCount}
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

        {/* Incoming Requests */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <h3 className="font-semibold mb-4">
            Incoming Requests ({totalCount})
          </h3>

          {loadingRequests && (
            <p className="text-sm text-white/60">Loading requests...</p>
          )}

          {requestError && (
            <p className="text-sm text-red-400">{requestError}</p>
          )}

          {!loadingRequests && reliefRequests.length === 0 && (
            <p className="text-sm text-white/60">No incoming requests</p>
          )}

          <div className="space-y-2">
            {reliefRequests.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-lg hover:bg-white/10 transition flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">
                    {r.disaster?.type || "Relief Request"}
                  </p>
                  <p className="text-xs text-white/60">
                    {r.disaster?.location || "Unknown location"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-white/60">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>

                  {r.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        disabled={actionLoadingId === r.id}
                        onClick={() =>
                          respondToRequest(r.id, "APPROVED")
                        }
                      >
                        Accept
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={actionLoadingId === r.id}
                        onClick={() =>
                          respondToRequest(r.id, "REJECTED")
                        }
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {r.status === "ACCEPTED" && (
                    <span className="text-green-400 text-sm font-medium">
                      Approved
                    </span>
                  )}

                  {r.status === "REJECTED" && (
                    <span className="text-red-400 text-sm font-medium">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
