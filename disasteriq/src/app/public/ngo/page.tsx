"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/app/components/DashboardLayout";

type NGO = {
  id: string;
  name: string;
  registrationNumber: string;
  state: string;
  focusArea: string;
  contactEmail: string;
  contactPhone: string;
};

export default function Page() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNgos = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/Api/ngo/all",
          {
            method: "GET",
          }
        );

        const json = await res.json();
        setNgos(json.data || []);
      } catch (error) {
        console.error("Failed to fetch NGOs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNgos();
  }, []);

  return (
    <DashboardLayout role="public" userName="publicuser">
      <div className="space-y-6 text-white">
        <h1 className="text-3xl font-bold">Registered NGOs</h1>

        {loading && (
          <p className="text-white/60">Loading NGOs...</p>
        )}

        {!loading && ngos.length === 0 && (
          <p className="text-white/60">No NGOs found.</p>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {ngos.map((ngo) => (
            <div
              key={ngo.id}
              className="rounded-xl bg-white/5 border border-white/10 p-5 space-y-2"
            >
              <h2 className="text-lg font-semibold">
                {ngo.name}
              </h2>

              <p className="text-white/70">
                <strong>Focus:</strong> {ngo.focusArea}
              </p>

              <p className="text-white/70">
                <strong>State:</strong> {ngo.state}
              </p>

              <p className="text-white/60 text-sm">
                Reg. No: {ngo.registrationNumber}
              </p>

              <hr className="border-white/10 my-2" />

              <p className="text-white/60 text-sm">
                📧 {ngo.contactEmail}
              </p>
              <p className="text-white/60 text-sm">
                📞 {ngo.contactPhone}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
