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

/* ===================== NAV CONFIG ===================== */

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

const roleLabels: Record<DashboardLayoutProps["role"], string> = {
  admin: "Administrator",
  government: "Government Authority",
  responder: "NGO / Hospital",
  public: "Public User",
};

const roleColors: Record<DashboardLayoutProps["role"], string> = {
  admin: "bg-primary",
  government: "bg-blue-500",
  responder: "bg-green-500",
  public: "bg-amber-500",
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
    <div className="min-h-screen flex w-full bg-background">
      {/* ================= Sidebar ================= */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r border-border transition-all duration-300 lg:relative",
          sidebarOpen ? "w-64" : "w-0 lg:w-20"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link href="/" className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                roleColors[role]
              )}
            >
              <Shield className="w-5 h-5 text-white" />
            </div>
            {sidebarOpen && (
              <span className="font-semibold text-foreground">
                DisasterRelief
              </span>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive &&
                    "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div
            className={cn(
              "flex items-center gap-3",
              !sidebarOpen && "justify-center"
            )}
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>

            {sidebarOpen && (
              <div>
                <p className="text-sm font-medium text-foreground truncate">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {roleLabels[role]}
                </p>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <Button variant="ghost" className="w-full mt-3 justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </aside>

      {/* ================= Main ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            <h1 className="hidden sm:block text-lg font-semibold">
              {items.find((item) => item.href === pathname)?.label ||
                "Dashboard"}
            </h1>
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              3
            </span>
          </Button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
