import { cn } from "@/lib/utils";

type StatusType = "critical" | "warning" | "success" | "info" | "default";

interface StatusBadgeProps {
  status: StatusType;
  label: string;
  pulse?: boolean;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  critical: "bg-critical/10 text-critical border-critical/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  success: "bg-success/10 text-success border-success/20",
  info: "bg-info/10 text-info border-info/20",
  default: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, label, pulse, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
        statusStyles[status],
        pulse && "pulse-alert",
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          status === "critical" && "bg-critical",
          status === "warning" && "bg-warning",
          status === "success" && "bg-success",
          status === "info" && "bg-info",
          status === "default" && "bg-muted-foreground"
        )}
      />
      {label}
    </span>
  );
}
