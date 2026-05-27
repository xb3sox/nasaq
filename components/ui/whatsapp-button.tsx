import * as React from "react"
import { Button, type buttonVariants } from "./button"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { MessageCircle } from "lucide-react"

export interface WhatsAppButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  buttonVariant?: "default" | "icon"
  size?: "default" | "sm"
  icon?: React.ElementType
}

export const WhatsAppButton = React.forwardRef<HTMLButtonElement, WhatsAppButtonProps>(
  ({ className, buttonVariant = "default", size = "default", icon: Icon = MessageCircle, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="outline"
        className={cn(
          "bg-whatsapp-muted text-whatsapp-dark border-whatsapp/20 hover:bg-whatsapp/10 hover:text-whatsapp-dark",
          {
            "rounded-full p-2 h-auto aspect-square": buttonVariant === "icon",
          },
          className
        )}
        size={buttonVariant === "icon" ? (size === "sm" ? "icon-sm" : "icon") : size}
        {...props}
      >
        <Icon className={cn("w-4 h-4 shrink-0", { "me-2": buttonVariant !== "icon" && children })} aria-hidden="true" />
        {buttonVariant !== "icon" && children}
      </Button>
    )
  }
)
WhatsAppButton.displayName = "WhatsAppButton"
