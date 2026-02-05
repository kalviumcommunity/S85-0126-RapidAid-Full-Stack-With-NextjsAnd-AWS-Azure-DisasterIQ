"use client";

import { DashboardLayout } from "@/app/components/DashboardLayout";

export default function AssignedDisastersPage() {
  return (
    <DashboardLayout role="responder" userName="Relief Coordinator">
      <div className="space-y-4 text-white">
        <h1 className="text-3xl font-bold">
          Assigned Disasters
        </h1>

        <p className="text-white/60">
          This page will show disasters assigned to your NGO.
        </p>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/70">
            🚧 Coming Soon: Disaster list + details + actions
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
