"use client";

import { cn } from "@/app/lib/utils";

type StatusType = "critical" | "warning" | "success" | "info" | "default";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  pulse?: boolean;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  critical: "bg-red-100 text-red-700 border-red-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  success: "bg-green-100 text-green-700 border-green-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  default: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, label, pulse, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        statusStyles[status],
        pulse && "animate-pulse",
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "critical" && "bg-red-500",
          status === "warning" && "bg-amber-500",
          status === "success" && "bg-green-500",
          status === "info" && "bg-blue-500",
          status === "default" && "bg-muted-foreground"
        )}
      />
      {label}
    </span>
  );
}
