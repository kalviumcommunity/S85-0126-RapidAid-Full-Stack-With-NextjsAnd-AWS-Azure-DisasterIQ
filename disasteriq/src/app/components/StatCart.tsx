import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "critical" | "warning" | "success" | "info";
  className?: string;
}

const variantStyles = {
  default: "border-border",
  critical: "border-l-4 border-l-critical border-t-0 border-r-0 border-b-0",
  warning: "border-l-4 border-l-warning border-t-0 border-r-0 border-b-0",
  success: "border-l-4 border-l-success border-t-0 border-r-0 border-b-0",
  info: "border-l-4 border-l-info border-t-0 border-r-0 border-b-0",
};

const iconStyles = {
  default: "bg-primary/10 text-primary",
  critical: "bg-critical/10 text-critical",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
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
    <div className={cn("stat-card", variantStyles[variant], className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-sm font-medium flex items-center gap-1",
                trend.isPositive ? "text-success" : "text-critical"
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
