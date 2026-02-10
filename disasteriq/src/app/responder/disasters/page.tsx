"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/app/components/DashboardLayout";

type Disaster = {
  id: string;
  name: string;
  type: string;
  severity: number;
  location: string;
  status: string;
  reportedAt: string;
};

export default function AssignedDisastersPage() {
  const [disasters, setDisasters] = useState<Disaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [open, setOpen] = useState(false);
  const [selectedDisasterId, setSelectedDisasterId] = useState<string | null>(null);

  // Form state
  const [resourceType, setResourceType] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDisasters = async () => {
      try {
        const res = await fetch("/Api/ngo/Approved", {
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setDisasters(data.data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDisasters();
  }, []);

  /* ================= CREATE RESOURCE REQUEST ================= */

  const submitRequest = async () => {
    if (!selectedDisasterId || !resourceType || !quantity || !unit) {
      alert("Please fill all fields");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch("/Api/ngo/resource-request", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disasterId: selectedDisasterId,
          resourceType,
          quantity,
          unit,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("✅ Resource request created");
      setOpen(false);
      setResourceType("");
      setQuantity(0);
      setUnit("");
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="responder" userName="Relief Coordinator">
      <div className="space-y-6 text-white">
        <h1 className="text-3xl font-bold">Assigned Disasters</h1>

        {loading && <p className="text-white/60">Loading...</p>}
        {error && <p className="text-red-400">❌ {error}</p>}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {disasters.map((d) => (
            <div
              key={d.id}
              className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-3"
            >
              <h2 className="text-xl font-semibold">{d.name}</h2>
              <p className="text-white/70">📍 {d.location}</p>
              <p className="text-white/70">🌪 {d.type}</p>
              <p className="text-white/70">⚠ Severity: {d.severity}</p>
              <p className="text-green-400 font-semibold">{d.status}</p>

              <button
                onClick={() => {
                  setSelectedDisasterId(d.id);
                  setOpen(true);
                }}
                className="mt-3 w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-sm font-semibold"
              >
                Request Resource
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#0f172a] rounded-xl p-6 w-[90%] max-w-md space-y-4">
            <h2 className="text-xl font-bold">Request Resources</h2>

            <input
              className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2"
              placeholder="Resource Type (e.g. Food)"
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
            />

            <input
              type="number"
              className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <input
              className="w-full rounded-md bg-white/10 border border-white/20 px-3 py-2"
              placeholder="Unit (kg / packets)"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
            />

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-lg bg-gray-600 py-2"
              >
                Cancel
              </button>

              <button
                onClick={submitRequest}
                disabled={submitting}
                className="flex-1 rounded-lg bg-green-600 hover:bg-green-700 py-2 font-semibold"
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
