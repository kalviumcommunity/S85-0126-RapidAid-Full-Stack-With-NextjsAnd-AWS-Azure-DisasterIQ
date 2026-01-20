import { MapPin, Clock, Users, AlertTriangle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface DisasterCardProps {
  id: string;
  title: string;
  type: string;
  location: string;
  severity: "critical" | "warning" | "info";
  status: "active" | "monitoring" | "resolved";
  affectedCount: number;
  lastUpdate: string;
  className?: string;
  onViewDetails?: () => void;
}

const severityLabels = {
  critical: "Critical",
  warning: "Severe",
  info: "Moderate",
};

const statusMap = {
  active: { type: "critical" as const, label: "Active" },
  monitoring: { type: "warning" as const, label: "Monitoring" },
  resolved: { type: "success" as const, label: "Resolved" },
};

export function DisasterCard({
  title,
  type,
  location,
  severity,
  status,
  affectedCount,
  lastUpdate,
  className,
  onViewDetails,
}: DisasterCardProps) {
  const statusInfo = statusMap[status];

  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-5 transition-all duration-200 hover:shadow-md",
        severity === "critical" && "border-l-4 border-l-critical",
        severity === "warning" && "border-l-4 border-l-warning",
        severity === "info" && "border-l-4 border-l-info",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle
              className={cn(
                "h-4 w-4",
                severity === "critical" && "text-critical",
                severity === "warning" && "text-warning",
                severity === "info" && "text-info"
              )}
            />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {type}
            </span>
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge
            status={statusInfo.type}
            label={statusInfo.label}
            pulse={status === "active"}
          />
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded",
              severity === "critical" && "bg-critical/10 text-critical",
              severity === "warning" && "bg-warning/10 text-warning",
              severity === "info" && "bg-info/10 text-info"
            )}
          >
            {severityLabels[severity]}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{affectedCount.toLocaleString()} affected</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{lastUpdate}</span>
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={onViewDetails}>
        View Details
      </Button>
    </div>
  );
}
