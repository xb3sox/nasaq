import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("card-hover-lift", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-primary/10 rounded-full">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend !== undefined && (
          <p className="flex items-center text-xs text-muted-foreground mt-1">
            <span
              className={cn(
                "flex items-center me-1",
                trend > 0 ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {trend > 0 ? (
                <ArrowUpIcon className="w-3 h-3 me-1" />
              ) : (
                <ArrowDownIcon className="w-3 h-3 me-1" />
              )}
              {Math.abs(trend)}%
            </span>
            {trendLabel && <span>{trendLabel}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}