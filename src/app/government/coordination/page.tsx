"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/app/components";

type GovernmentRequest = {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  disaster: {
    name: string;
    type: string;
    location: string;
    severity: number;
  };
  ngo: {
    name: string;
    state: string;
    contactEmail: string;
  };
  requestedBy: {
    name: string;
    email: string;
  };
};

export default function Page() {
  const [requests, setRequests] = useState<GovernmentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/Api/government/requests",
          {
            credentials: "include",
          }
        );

        const json = await res.json();
        setRequests(json.data || []);
      } catch (error) {
        console.error("Failed to fetch government requests", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <DashboardLayout role="government" userName="Gov. Official">
      <div className="space-y-6 text-white">
        <h1 className="text-3xl font-bold">Government Requests</h1>

        {loading && (
          <p className="text-white/60">Loading requests...</p>
        )}

        {!loading && requests.length === 0 && (
          <p className="text-white/60">No requests found.</p>
        )}

        <div className="grid gap-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-2"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">
                  {req.disaster.name}
                </h2>

                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    req.status === "ACCEPTED"
                      ? "bg-green-500/20 text-green-400"
                      : req.status === "REJECTED"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {req.status}
                </span>
              </div>

              <p className="text-white/70">
                <strong>Type:</strong> {req.disaster.type}
              </p>
              <p className="text-white/70">
                <strong>Location:</strong> {req.disaster.location}
              </p>
              <p className="text-white/70">
                <strong>Severity:</strong> {req.disaster.severity}
              </p>

              <hr className="border-white/10 my-2" />

              <p className="text-white/70">
                <strong>NGO:</strong> {req.ngo.name} ({req.ngo.state})
              </p>
              <p className="text-white/60 text-sm">
                {req.ngo.contactEmail}
              </p>

              <p className="text-white/60 text-sm">
                Requested by {req.requestedBy.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
