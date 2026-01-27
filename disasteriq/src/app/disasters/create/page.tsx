"use client";

import { DashboardLayout } from "@/app/components/DashboardLayout";
import CreateDisasterForm from "@/app/components/CreateDisasterForm";

export default function CreateDisasterPage() {
  return (
    <DashboardLayout role="government">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Disaster Management</h1>
          <p className="text-muted-foreground">
            Report and manage disaster incidents in your region
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form - takes 2 columns */}
          <div className="lg:col-span-2">
            <CreateDisasterForm />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border p-4 bg-blue-50">
              <h3 className="font-semibold mb-2">📋 What to include:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Clear disaster name</li>
                <li>✓ Disaster type/category</li>
                <li>✓ Affected location</li>
                <li>✓ Severity assessment</li>
                <li>✓ Current status</li>
              </ul>
            </div>

            <div className="rounded-lg border p-4 bg-green-50">
              <h3 className="font-semibold mb-2">📸 Media Guidelines:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Use direct image/video URLs</li>
                <li>✓ HTTPS recommended</li>
                <li>✓ Multiple media items OK</li>
                <li>✓ Optional but encouraged</li>
              </ul>
            </div>

            <div className="rounded-lg border p-4 bg-amber-50">
              <h3 className="font-semibold mb-2">⚠️ Severity Scale:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li><strong>1-3:</strong> Minor impact</li>
                <li><strong>4-6:</strong> Moderate impact</li>
                <li><strong>7-10:</strong> Severe impact</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
