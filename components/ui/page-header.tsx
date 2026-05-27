import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  eyebrow?: ReactNode;
  actions?: ReactNode;
  className?: string;
  actionsClassName?: string;
  align?: "start" | "between";
  size?: "default" | "hero";
}

export function PageHeader({
  title,
  subtitle,
  description,
  eyebrow,
  actions,
  className,
  actionsClassName,
  align = "between",
  size = "default",
}: PageHeaderProps) {
  const body = description ?? subtitle;

  return (
    <header
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-start",
        align === "between" && "sm:justify-between",
        className
      )}
    >
      <div className="min-w-0 space-y-2">
        {eyebrow && <div className="text-sm font-medium text-primary">{eyebrow}</div>}
        <h1 className={cn("font-bold tracking-tight text-balance", size === "hero" ? "text-3xl sm:text-4xl" : "text-2xl")}>{title}</h1>
        {body && <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{body}</p>}
      </div>
      {actions && <div className={cn("flex flex-wrap items-center gap-2", actionsClassName)}>{actions}</div>}
    </header>
  );
}
