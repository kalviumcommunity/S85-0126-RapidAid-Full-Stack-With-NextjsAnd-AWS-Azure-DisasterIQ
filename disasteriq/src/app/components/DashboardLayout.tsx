"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  Building2,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
} from "lucide-react";

import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";

/* ===================== TYPES ===================== */

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardLayoutProps {
  children: ReactNode;
  role: "admin" | "government" | "responder" | "public";
  userName?: string;
}

/* ===================== CONFIG ===================== */

const navItems: Record<DashboardLayoutProps["role"], NavItem[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Disasters", href: "/admin/disasters", icon: AlertTriangle },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Organizations", href: "/admin/organizations", icon: Building2 },
    { label: "Reports", href: "/admin/reports", icon: FileText },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
  government: [
    { label: "Dashboard", href: "/government", icon: LayoutDashboard },
    { label: "Disasters", href: "/government/disasters", icon: AlertTriangle },
    { label: "Coordination", href: "/government/coordination", icon: Building2 },
    { label: "Resources", href: "/government/resources", icon: Shield },
    { label: "Reports", href: "/government/reports", icon: FileText },
  ],
  responder: [
    { label: "Dashboard", href: "/responder", icon: LayoutDashboard },
    { label: "Assigned Disasters", href: "/responder/disasters", icon: AlertTriangle },
    { label: "Resources", href: "/responder/resources", icon: Shield },
    { label: "Operations", href: "/responder/operations", icon: Building2 },
  ],
  public: [],
};

const roleLabels = {
  admin: "Administrator",
  government: "Government Authority",
  responder: "NGO / Hospital",
  public: "Public User",
};

/* ===================== COMPONENT ===================== */

export function DashboardLayout({
  children,
  role,
  userName = "User",
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const items = navItems[role];

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">

      {/* ================= SIDEBAR ================= */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-black/30 backdrop-blur border-r border-white/10 transition-all duration-300 lg:relative",
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-semibold">DisasterRelief</span>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition",
                  active
                    ? "bg-blue-600 text-white"
                    : "text-white/80 hover:bg-white/10"
                )}
              >
                <item.icon className="h-5 w-5" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <span className="text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>

            {sidebarOpen && (
              <div>
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-white/60">
                  {roleLabels[role]}
                </p>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <Button
              variant="ghost"
              className="w-full mt-3 justify-start text-white/80 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="h-16 bg-black/20 backdrop-blur border-b border-white/10 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <h1 className="text-lg font-semibold hidden sm:block">
              {items.find((i) => i.href === pathname)?.label || "Dashboard"}
            </h1>
          </div>

          <div className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
