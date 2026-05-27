import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type PageShellSize = "default" | "wide" | "full";
type PageShellSpacing = "default" | "compact" | "none";
type PageShellSurface = "plain" | "gradient";
type PageShellHeight = "auto" | "viewport";

interface PageShellProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "4xl" | "6xl" | "full"; // temporary backwards compatibility
  size?: PageShellSize;
  spacing?: PageShellSpacing;
  surface?: PageShellSurface;
  height?: PageShellHeight;
}

const sizeClasses: Record<PageShellSize, string> = {
  default: "max-w-4xl mx-auto w-full",
  wide: "max-w-6xl mx-auto w-full",
  full: "w-full max-w-none",
};

const legacySizeClasses: Record<NonNullable<PageShellProps["maxWidth"]>, string> = {
  "4xl": sizeClasses.default,
  "6xl": sizeClasses.wide,
  full: sizeClasses.full,
};

const spacingClasses: Record<PageShellSpacing, string> = {
  default: "p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8",
  compact: "p-4 sm:p-6 space-y-4 sm:space-y-6",
  none: "p-0",
};

export function PageShell({
  children,
  className,
  maxWidth,
  size = "default",
  spacing = "default",
  surface = "plain",
  height = "auto",
}: PageShellProps) {
  return (
    <div
      className={cn(
        "relative",
        spacingClasses[spacing],
        maxWidth ? legacySizeClasses[maxWidth] : sizeClasses[size],
        height === "viewport" && "min-h-[calc(100dvh-4rem)] lg:min-h-dvh",
        surface === "gradient" && "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-[300px] before:rounded-b-3xl before:bg-gradient-to-b before:from-primary/10 before:to-background",
        className
      )}
    >
      {children}
    </div>
  );
}
