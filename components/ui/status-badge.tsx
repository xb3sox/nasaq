import * as React from "react"
import { Badge, type BadgeProps } from "./badge"
import { cn } from "@/lib/utils"

export interface StatusBadgeProps extends Omit<BadgeProps, "variant"> {
  variant?: "success" | "warning" | "danger" | "info" | "whatsapp" | "neutral" | "default"
}

export function StatusBadge({ className, variant = "default", ...props }: StatusBadgeProps) {
  return (
    <Badge
      className={cn(
        "font-medium border",
        {
          "bg-success-surface text-success border-success/20": variant === "success",
          "bg-warning-surface text-warning border-warning/20": variant === "warning",
          "bg-destructive/10 text-destructive border-destructive/20": variant === "danger",
          "bg-blue-100 text-blue-800 border-blue-200": variant === "info",
          "bg-whatsapp-muted text-whatsapp-dark border-whatsapp/20": variant === "whatsapp",
          "bg-muted text-muted-foreground border-transparent": variant === "neutral",
          "bg-primary text-primary-foreground border-transparent": variant === "default",
        },
        className
      )}
      variant={variant === "default" ? "default" : "outline"}
      {...props}
    />
  )
}
