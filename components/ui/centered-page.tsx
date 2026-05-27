import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CenteredPageProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: "sm" | "4xl";
  surface?: "plain" | "muted";
}

export function CenteredPage({ children, className, contentClassName, maxWidth = "sm", surface = "plain" }: CenteredPageProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh items-center justify-center p-4 sm:p-6 lg:p-8",
        surface === "muted" ? "bg-muted/30" : "bg-background",
        className
      )}
      dir="rtl"
    >
      <main id="main-content" className={cn("w-full space-y-6", maxWidth === "sm" ? "max-w-sm" : "max-w-4xl", contentClassName)}>
        {children}
      </main>
    </div>
  );
}
