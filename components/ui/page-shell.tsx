import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "4xl" | "6xl" | "full";
}

export function PageShell({ children, className, maxWidth = "4xl" }: PageShellProps) {
  return (
    <div className={cn(
      "p-6 space-y-8",
      maxWidth === "4xl" && "max-w-4xl",
      maxWidth === "6xl" && "max-w-6xl",
      maxWidth === "full" && "max-w-full",
      className
    )}>
      {children}
    </div>
  );
}
