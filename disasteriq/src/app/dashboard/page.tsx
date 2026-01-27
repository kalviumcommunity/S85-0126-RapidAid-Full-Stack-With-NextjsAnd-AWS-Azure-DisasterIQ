import Link from "next/link";
import { Shield, Building2, Users } from "lucide-react";
import { DashboardLayout } from "@/app/components/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout role="public">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-center">
          Select your role
        </h1>

        <p className="mb-10 text-center text-muted-foreground">
          Choose how you want to access the DisasterRelief platform
        </p>

        <div className="grid gap-6 md:grid-cols-4">
          {/* Admin */}
          <Link
            href="/auth/admin/signup"
            className="rounded-xl border p-6 hover:shadow-md transition"
          >
            <Shield className="h-8 w-8 mb-4 text-primary" />
            <h2 className="text-lg font-semibold">Admin</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Full system access and control
            </p>
            <span className="mt-4 inline-block text-sm font-medium">
              Register →
            </span>
          </Link>

          {/* Government */}
          <Link
            href="/auth/government/signup"
            className="rounded-xl border p-6 hover:shadow-md transition"
          >
            <Building2 className="h-8 w-8 mb-4 text-blue-600" />
            <h2 className="text-lg font-semibold">
              Government Authority
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Disaster coordination and declarations
            </p>
            <span className="mt-4 inline-block text-sm font-medium">
              Register →
            </span>
          </Link>

          {/* NGO / Hospital */}
          <Link
            href="/auth/ngo/signup"
            className="rounded-xl border p-6 hover:shadow-md transition"
          >
            <Users className="h-8 w-8 mb-4 text-green-600" />
            <h2 className="text-lg font-semibold">
              NGO / Hospital
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage resources and relief operations
            </p>
            <span className="mt-4 inline-block text-sm font-medium">
              Register →
            </span>
          </Link>

          {/* Public */}
          <Link
            href="/auth/citizen/signup"
            className="rounded-xl border p-6 hover:shadow-md transition"
          >
            <Users className="h-8 w-8 mb-4 text-amber-500" />
            <h2 className="text-lg font-semibold">
              Public User
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              View alerts and request help
            </p>
            <span className="mt-4 inline-block text-sm font-medium">
              Register →
            </span>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
