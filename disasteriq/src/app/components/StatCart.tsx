"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/app/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "critical" | "warning" | "success" | "info" | "primary";
  className?: string;
}

const variantStyles = {
  default: "border-border",
  critical: "border-l-4 border-l-red-500 border-t-0 border-r-0 border-b-0",
  warning: "border-l-4 border-l-amber-500 border-t-0 border-r-0 border-b-0",
  success: "border-l-4 border-l-green-500 border-t-0 border-r-0 border-b-0",
  info: "border-l-4 border-l-blue-500 border-t-0 border-r-0 border-b-0",
  primary: "border-l-4 border-l-primary border-t-0 border-r-0 border-b-0",
};

const iconStyles = {
  default: "bg-primary/10 text-primary",
  critical: "bg-red-100 text-red-600",
  warning: "bg-amber-100 text-amber-600",
  success: "bg-green-100 text-green-600",
  info: "bg-blue-100 text-blue-600",
  primary: "bg-primary/10 text-primary",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-xl p-5", variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-sm font-medium flex items-center gap-1",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
              <span className="text-muted-foreground font-normal">vs last week</span>
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-xl", iconStyles[variant])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
