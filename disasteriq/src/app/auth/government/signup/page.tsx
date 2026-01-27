"use client";

import { Building2, Shield } from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function GovernmentSignup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-3xl bg-background border border-border rounded-2xl shadow-lg p-8">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Government Signup</h1>
            <p className="text-sm text-muted-foreground">
              Register a government authority for disaster management
            </p>
          </div>
        </div>

        {/* Government Info */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Authority Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="Authority Name" />
            <input className="input" placeholder="Level (STATE / DISTRICT)" />

            <input className="input" placeholder="State" />
            <input className="input" placeholder="District" />

            <input className="input" placeholder="Department" />
            <input className="input" type="email" placeholder="Official Email" />

            <input
              className="input md:col-span-2"
              placeholder="Contact Phone"
            />
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-border my-8" />

        {/* Admin Info */}
        <section>
          <h2 className="text-lg font-semibold mb-4">
            Admin Account Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="input" placeholder="Admin Name" />
            <input className="input" type="email" placeholder="Admin Email" />

            <input
              className="input md:col-span-2"
              type="password"
              placeholder="Password"
            />
          </div>
        </section>

        {/* Action */}
        <div className="mt-10 flex justify-end">
          <Button size="lg" className="px-10">
            Register Government
          </Button>
        </div>
      </div>
    </div>
  );
}
