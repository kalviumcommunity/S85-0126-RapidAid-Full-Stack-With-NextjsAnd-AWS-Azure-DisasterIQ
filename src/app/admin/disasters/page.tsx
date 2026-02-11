"use client";

import { DashboardLayout } from "@/app/components";

export default function Page() {
  return (
    <DashboardLayout role="admin" userName="admin">
      <div className="space-y-4 text-white">
        <h1 className="text-3xl font-bold">
          Coming Soon
        </h1> 

        <p className="text-white/60">
          This page is under development.
        </p>

        <div className="rounded-xl bg-white/5 border border-white/10 p-5">
          <p className="text-white/70">
            🚧 Coming Soon: Features will be added here
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
