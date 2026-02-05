"use client";

import { DashboardLayout } from "@/app/components/DashboardLayout";

export default function OperationsPage() {
  return (
    <DashboardLayout role="responder" userName="Relief Coordinator">
      <div className="space-y-4 text-white">
        <h1 className="text-3xl font-bold">
          Ongoing Operations
        </h1>

        <p className="text-white/60">
          Track relief operations and volunteer deployment here.
        </p>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/70">
            🚧 Coming Soon: Operation tracking + real-time updates
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
