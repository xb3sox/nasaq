import { ArrowDownIcon, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
  valueClassName?: string;
  iconClassName?: string;
  iconContainerClassName?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  description,
  className,
  valueClassName,
  iconClassName,
  iconContainerClassName,
}: StatCardProps) {
  return (
    <Card className={cn("card-hover-lift shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className={cn("p-2 bg-primary/10 rounded-lg", iconContainerClassName)}>
          <Icon className={cn("w-4 h-4 text-primary", iconClassName)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("text-2xl font-bold", valueClassName)}>{value}</div>
        {trend !== undefined ? (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground font-medium">
            <span
              className={cn(
                "flex items-center",
                trend > 0 ? "text-green-600" : trend < 0 ? "text-rose-500" : "text-muted-foreground"
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
        ) : description ? (
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            {description}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}