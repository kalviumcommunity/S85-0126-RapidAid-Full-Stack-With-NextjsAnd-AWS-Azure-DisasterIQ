"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/app/components";
import { Button } from "@/app/components/ui";
import { MapPin, Clock, AlertTriangle } from "lucide-react";
import { authApi } from "@/app/lib/authFetch";

/* ===================== TYPES ===================== */

interface ReliefRequest {
  id: string;
  type: string;
  location: string;
  urgency: "critical" | "warning" | "info";
  status: string;
  createdAt: string;
}

/* ===================== COMPONENT ===================== */

export default function Requests() {
  const [requests, setRequests] = useState<ReliefRequest[]>([]);
  const [loading, setLoading] = useState(true);

  /* ===================== FETCH REQUESTS ===================== */

  useEffect(() => {
    async function loadRequests() {
      try {
        const res = await authApi.get("/Api/responder/requests");

        if (!res.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await res.json();
        setRequests(data);
      } catch (error) {
        console.error("Error loading requests:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRequests();
  }, []);

  /* ===================== ACCEPT REQUEST ===================== */

  async function handleAccept(_id: string) {
    alert("Accept request backend will be added next!");

    // Later you will do:
    // await fetch("/api/responder/requests/accept", { method: "POST", body: JSON.stringify({ id }) })
  }

  /* ===================== UI ===================== */

  return (
    <DashboardLayout role="responder" userName="Relief Coordinator">
      <div className="space-y-6 text-white">

        {/* Header */}
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
          <h1 className="text-3xl font-bold">
            Incoming Help Requests
          </h1>
          <p className="text-white/60 mt-2">
            Manage citizen emergency requests and respond quickly.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/70">Loading requests...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && requests.length === 0 && (
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <p className="text-white/70">
              ✅ No pending requests right now.
            </p>
          </div>
        )}

        {/* Requests List */}
        {!loading && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((req) => (
              <div
                key={req.id}
                className="rounded-xl bg-white/5 border border-white/10 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                {/* Left Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle
                      className={`h-5 w-5 ${
                        req.urgency === "critical"
                          ? "text-red-400"
                          : req.urgency === "warning"
                          ? "text-yellow-400"
                          : "text-blue-400"
                      }`}
                    />

                    <h2 className="text-lg font-semibold">
                      {req.type} Request
                    </h2>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        req.urgency === "critical"
                          ? "bg-red-500/20 text-red-300"
                          : req.urgency === "warning"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {req.urgency.toUpperCase()}
                    </span>
                  </div>

                  {/* Location */}
                  <p className="text-sm text-white/70 mt-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {req.location}
                  </p>

                  {/* Time */}
                  <p className="text-xs text-white/50 mt-1 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    Received: {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleAccept(req.id)}
                >
                  Accept Request
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
