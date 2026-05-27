import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type LandingSectionWidth = "6xl" | "5xl" | "4xl" | "3xl" | "full";
type LandingSectionBg = "default" | "muted" | "card" | "primary" | "transparent";

export interface LandingSectionProps {
  children: ReactNode;
  className?: string;
  /** Container max-width, default "6xl" */
  maxWidth?: LandingSectionWidth;
  /** Background variant, default "default" (none) */
  background?: LandingSectionBg;
  /** Extra padding on top/bottom, default true */
  padded?: boolean;
  id?: string;
}

const widthClasses: Record<LandingSectionWidth, string> = {
  "6xl": "max-w-6xl",
  "5xl": "max-w-5xl",
  "4xl": "max-w-4xl",
  "3xl": "max-w-3xl",
  "full": "max-w-full",
};

const bgClasses: Record<LandingSectionBg, string> = {
  default: "bg-background",
  muted: "bg-muted/30",
  card: "bg-card",
  primary: "bg-primary",
  transparent: "bg-transparent",
};

export function LandingSection({
  children,
  className,
  maxWidth = "6xl",
  background = "default",
  padded = true,
  id,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        bgClasses[background],
        padded && "py-24",
        className
      )}
    >
      <div className={cn(widthClasses[maxWidth], "mx-auto px-6")}>
        {children}
      </div>
    </section>
  );
}
