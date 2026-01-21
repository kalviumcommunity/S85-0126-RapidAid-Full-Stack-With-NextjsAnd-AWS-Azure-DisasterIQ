"use client";

import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/app/lib/utils";

/* ===================== THEMES ===================== */

const THEMES = {
  light: "",
  dark: ".dark",
} as const;

/* ===================== TYPES ===================== */

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode;
    icon?: React.ComponentType;
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>;

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />");
  }
  return context;
}

/* ===================== CONTAINER ===================== */

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig;
    children: React.ComponentProps<
      typeof RechartsPrimitive.ResponsiveContainer
    >["children"];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        ref={ref}
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs",
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
          "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
          "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
          "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-layer]:outline-none",
          "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-radial-bar-background-sector]:fill-muted",
          "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
          "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
          "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
          "[&_.recharts-sector]:outline-none",
          "[&_.recharts-surface]:outline-none",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = "ChartContainer";

/* ===================== STYLE ===================== */

const ChartStyle = ({
  id,
  config,
}: {
  id: string;
  config: ChartConfig;
}) => {
  const colorConfig = Object.entries(config).filter(
    ([, cfg]) => cfg.color || cfg.theme
  );

  if (!colorConfig.length) return null;

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart="${id}"] {
${colorConfig
  .map(([key, cfg]) => {
    const color = cfg.theme?.[theme as keyof typeof THEMES] ?? cfg.color;
    return color ? `  --color-${key}: ${color};` : "";
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  );
};

/* ===================== TOOLTIP ===================== */

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  RechartsPrimitive.TooltipProps & {
    hideLabel?: boolean;
    hideIndicator?: boolean;
    indicator?: "line" | "dot" | "dashed";
    nameKey?: string;
    labelKey?: string;
    className?: string;
  }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      formatter,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    if (!active || !payload?.length) return null;

    const tooltipLabel = !hideLabel
      ? labelFormatter
        ? labelFormatter(label, payload)
        : label
      : null;

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {tooltipLabel && <div className="font-medium">{tooltipLabel}</div>}

        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
            const itemConfig = getPayloadConfigFromPayload(
              config,
              item,
              key
            );
            const indicatorColor = item.color ?? "currentColor";

            return (
              <div
                key={index}
                className="flex items-center gap-2"
              >
                {!hideIndicator && (
                  <div
                    className={cn(
                      "shrink-0 rounded",
                      indicator === "dot" && "h-2.5 w-2.5",
                      indicator === "line" && "w-1 h-4",
                      indicator === "dashed" &&
                        "w-0 border-[1.5px] border-dashed"
                    )}
                    style={{
                      backgroundColor:
                        indicator === "dashed" ? "transparent" : indicatorColor,
                      borderColor: indicatorColor,
                    }}
                  />
                )}

                <span className="text-muted-foreground">
                  {itemConfig?.label ?? item.name}
                </span>

                {item.value != null && (
                  <span className="ml-auto font-mono font-medium">
                    {Number(item.value).toLocaleString()}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

/* ===================== LEGEND ===================== */

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  RechartsPrimitive.LegendProps & {
    hideIcon?: boolean;
    nameKey?: string;
    className?: string;
  }
>(({ payload, hideIcon = false, nameKey, className }, ref) => {
  const { config } = useChart();

  if (!payload?.length) return null;

  return (
    <div
      ref={ref}
      className={cn("flex items-center justify-center gap-4", className)}
    >
      {payload.map((item, index) => {
        const key = `${nameKey ?? item.dataKey ?? "value"}`;
        const itemConfig = getPayloadConfigFromPayload(
          config,
          item,
          key
        );

        return (
          <div key={index} className="flex items-center gap-1.5">
            {!hideIcon && itemConfig?.icon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="h-2 w-2 rounded"
                style={{ backgroundColor: item.color }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = "ChartLegendContent";

/* ===================== HELPERS ===================== */

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) return undefined;

  const raw =
    "payload" in payload && typeof payload.payload === "object"
      ? payload.payload
      : undefined;

  const labelKey =
    typeof (payload as any)[key] === "string"
      ? (payload as any)[key]
      : typeof raw?.[key] === "string"
      ? raw[key]
      : key;

  return config[labelKey] ?? config[key];
}

/* ===================== EXPORTS ===================== */

export {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
