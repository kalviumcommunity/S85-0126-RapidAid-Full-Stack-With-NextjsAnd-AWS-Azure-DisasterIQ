"use client";

import { DashboardLayout } from "@/app/components/DashboardLayout";
import CreateDisasterForm from "@/app/components/CreateDisasterForm";

export default function CreateDisasterPage() {
  return (
    <DashboardLayout role="government">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">
            Disaster Management
          </h1>
          <p className="text-white/70 mt-2">
            Report and manage disaster incidents in your region
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {/* ================= MAIN FORM ================= */}
          <div className="lg:col-span-2">
            <div
              className="
                rounded-2xl
                border border-white/10
                bg-white/95
                p-8
                shadow-2xl
              "
            >
              {/* Form header (visual anchor only) */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800">
                  Create Disaster Report
                </h2>
                <p className="text-sm text-slate-500">
                  Fill in the details below to report a disaster incident
                </p>
              </div>

              <CreateDisasterForm />
            </div>
          </div>

          {/* ================= SIDEBAR ================= */}
          <div className="space-y-6 lg:sticky lg:top-24">
            {/* What to include */}
            <div
              className="
                rounded-2xl
                border border-white/10
                bg-slate-100/90
                p-5
                shadow-lg
              "
            >
              <h3 className="font-semibold mb-3 text-slate-800">
                📋 What to include
              </h3>
              <ul className="text-sm space-y-2 text-slate-600">
                <li>✓ Clear disaster name</li>
                <li>✓ Disaster type/category</li>
                <li>✓ Affected location</li>
                <li>✓ Severity assessment</li>
                <li>✓ Current status</li>
              </ul>
            </div>

            {/* Media Guidelines */}
            <div
              className="
                rounded-2xl
                border border-white/10
                bg-slate-100/90
                p-5
                shadow-lg
              "
            >
              <h3 className="font-semibold mb-3 text-slate-800">
                📸 Media Guidelines
              </h3>
              <ul className="text-sm space-y-2 text-slate-600">
                <li>✓ Use direct image/video URLs</li>
                <li>✓ HTTPS recommended</li>
                <li>✓ Multiple media items OK</li>
                <li>✓ Optional but encouraged</li>
              </ul>
            </div>

            {/* Severity Scale */}
            <div
              className="
                rounded-2xl
                border border-white/10
                bg-slate-100/90
                p-5
                shadow-lg
              "
            >
              <h3 className="font-semibold mb-3 text-slate-800">
                ⚠️ Severity Scale
              </h3>
              <ul className="text-sm space-y-2 text-slate-600">
                <li><strong>1–3:</strong> Minor impact</li>
                <li><strong>4–6:</strong> Moderate impact</li>
                <li><strong>7–10:</strong> Severe impact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
