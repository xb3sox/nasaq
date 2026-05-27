import { ArrowDownIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card } from "./card";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { ChartWrapper } from "../ChartWrapper";
import React from "react";

export type StatCardColor = "brand" | "success" | "warning" | "danger" | "neutral" | "primary" | "muted";

export const COLOR_MAP: Record<StatCardColor, { icon: string; container: string }> = {
  brand:   { icon: "text-brand",          container: "bg-brand-surface" },
  success: { icon: "text-success",        container: "bg-success-surface" },
  warning: { icon: "text-warning",        container: "bg-warning-surface" },
  danger:  { icon: "text-destructive",    container: "bg-destructive/10" },
  neutral: { icon: "text-muted-foreground", container: "bg-muted" },
  primary: { icon: "text-primary",        container: "bg-primary/10" },
  muted:   { icon: "text-muted-foreground", container: "bg-muted" },
};

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ElementType;
  iconColor?: StatCardColor;
  iconClassName?: string;
  iconContainerClassName?: string;
  trend?: number;
  trendDirection?: "up" | "down";
  trendLabel?: React.ReactNode;
  description?: React.ReactNode;
  sub?: React.ReactNode;
  sparklineData?: number[];
  className?: string;
  valueClassName?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  iconColor = "primary",
  iconClassName,
  iconContainerClassName,
  trend,
  trendDirection,
  trendLabel,
  description,
  sub,
  sparklineData,
  className,
  valueClassName,
}: StatCardProps) {
  const iconContainerClasses = cn(
    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
    COLOR_MAP[iconColor].container,
    iconContainerClassName
  );
  
  const iconClasses = cn(
    "w-5 h-5",
    COLOR_MAP[iconColor].icon,
    iconClassName
  );

  return (
    <Card className={cn("p-5 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-w-0", className)}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-muted-foreground truncate" title={typeof description === 'string' ? description : title}>{title}</div>
            <div className={cn("text-3xl font-bold mt-1 truncate", valueClassName)}>{value}</div>
            {sub && <div className="text-xs text-muted-foreground mt-1 truncate">{sub}</div>}
            {description && !sub && <div className="text-xs text-muted-foreground mt-1 truncate">{description}</div>}
          </div>
          <div
            className={iconContainerClasses}
            title={typeof description === 'string' ? description : title}
            role="img"
            aria-label={typeof description === 'string' ? description : title}
          >
            <Icon className={iconClasses} aria-hidden="true" />
          </div>
        </div>
      </div>
      
      {(trendDirection || sparklineData || trend !== undefined) && (
        <div className="mt-4 flex items-end justify-between h-10 gap-4">
          {trendDirection ? (
            <div className={cn("flex items-center gap-1 text-xs font-medium mb-1", trendDirection === "up" ? "text-success" : "text-destructive")}>
              {trendDirection === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span>{trendLabel || (trendDirection === "up" ? "↑" : "↓")}</span>
            </div>
          ) : trend !== undefined ? (
            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium mb-1">
              <span
                className={cn(
                  "flex items-center",
                  trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {trend > 0 ? (
                  <ArrowUpRight className="w-3 h-3 me-1" />
                ) : trend < 0 ? (
                  <ArrowDownIcon className="w-3 h-3 me-1" />
                ) : null}
                <span>{trend > 0 ? "+" : ""}{trend}%</span>
              </span>
              {trendLabel && <span>{trendLabel}</span>}
            </div>
          ) : <div />}

          {sparklineData && (
            <div className="h-full flex-1 max-w-[80px] ms-auto opacity-70" dir="ltr">
              <ChartWrapper>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData.map((val, i) => ({ val, i }))}>
                    <Line type="monotone" dataKey="val" stroke={trendDirection === "up" ? "var(--success)" : "var(--destructive)"} strokeWidth={2} dot={false} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartWrapper>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
