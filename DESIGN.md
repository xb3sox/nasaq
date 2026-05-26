---
version: alpha
name: Nasaq
description: Arabic-first AI clinic management dashboard — warm, professional, and data-dense with a human touch.
colors:
  primary: "#0F172A"
  primary-foreground: "#FFFFFF"
  brand: "#0B7D72"
  brand-hover: "#096B60"
  brand-muted: "#CCFBF1"
  brand-surface: "#F0FDFA"
  surface: "#FFFFFF"
  surface-elevated: "#F8FAFC"
  muted: "#F1F5F9"
  muted-foreground: "#64748B"
  border: "#E2E8F0"
  border-light: "#F1F5F9"
  text: "#0F172A"
  text-secondary: "#475569"
  success: "#059669"
  success-surface: "#ECFDF5"
  warning: "#D97706"
  warning-surface: "#FEF3C7"
  danger: "#DC2626"
  danger-surface: "#FEF2F2"
  whatsapp: "#25D366"
  whatsapp-dark: "#128C7E"
  chart-1: "#0D9488"
  chart-2: "#6366F1"
  chart-3: "#F59E0B"
  chart-4: "#EF4444"
  chart-5: "#8B5CF6"
typography:
  h1:
    fontFamily: "Noto Sans Arabic"
    fontSize: 2rem
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0em"
  h2:
    fontFamily: "Noto Sans Arabic"
    fontSize: 1.5rem
    fontWeight: 700
    lineHeight: 1.35
  h3:
    fontFamily: "Noto Sans Arabic"
    fontSize: 1.25rem
    fontWeight: 600
    lineHeight: 1.4
  body-lg:
    fontFamily: "Noto Sans Arabic"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
  body-md:
    fontFamily: "Noto Sans Arabic"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Noto Sans Arabic"
    fontSize: 0.75rem
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 20px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: 10px 20px
  button-primary-hover:
    backgroundColor: "{colors.brand-hover}"
    textColor: "{colors.primary-foreground}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: 10px 20px
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    padding: 20px
  sidebar:
    backgroundColor: "{colors.surface}"
    width: 256px
    rounded: "0px"
  badge-status:
    rounded: "{rounded.full}"
    padding: 2px 10px
  chat-bubble-bot:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.primary-foreground}"
    rounded: "14px 14px 4px 14px"
  chat-bubble-user:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.text}"
    rounded: "14px 14px 14px 4px"
---

## Overview

Nasaq (نسق) is an Arabic-first AI clinic management platform for Saudi Arabia. The visual identity balances professional healthcare credibility with modern SaaS polish. Teal/emerald serves as the brand accent — signaling trust, growth, and the clinical domain. The interface is data-dense but never cluttered: clear hierarchy, purposeful whitespace, and consistent RTL layout using CSS logical properties.

Arabic text uses Noto Sans Arabic for legibility at all sizes. English labels (code, phone numbers, IDs) use Geist Mono. The design is light-mode first (clinical context demands readability), with a dark mode defined for after-hours use.

## Colors

- **Primary (#0F172A):** Slate ink — headlines, core text, high-contrast surfaces.
- **Brand (#0D9488):** Teal — the sole interaction driver. Used for primary buttons, active nav items, chart accents, and key CTAs.
- **Brand Surface (#F0FDFA):** Ultra-light teal for highlighted backgrounds and AI-identified content.
- **WhatsApp (#25D366):** For WhatsApp-specific UI elements — chat headers, message indicators, source badges.
- **Success (#059669):** Confirmed bookings, completed actions, healthy metrics.
- **Warning (#D97706):** Pending items, human-needed flags, attention states.
- **Danger (#DC2626):** Cancelled items, errors, failed deliveries.
- **Surface (#FFFFFF):** Card and page backgrounds.
- **Muted (#F1F5F9):** Secondary surfaces, chat bubbles (user), subtle backgrounds.

## Typography

Noto Sans Arabic for all Arabic text. Geist / Geist Mono for Latin text, numbers, and code.
- Hierarchy through size and weight, not color.
- Arabic text needs larger sizes for equivalent legibility vs Latin.
- Tight line-height on headings (1.3), relaxed on body (1.6).
- Numbers and phone numbers use tabular-nums and monospace.

## Layout

- RTL-first using CSS logical properties (ms/me/ps/pe not left/right).
- Sidebar on the right (RTL), content on the left.
- Max content width: 1440px for dashboard, unlimited for landing.
- Dashboard padding: 24px mobile → 32px tablet → 40px desktop.
- Stat cards: 4-column grid on desktop, 2 on mobile.
- Data tables: full-width with sticky headers.

## Shapes

- Cards: 16px radius — warm but professional.
- Buttons: 10px radius — slightly rounded, not pill.
- Badges/pills: full radius (9999px).
- Avatars: circular.
- Chat bubbles: asymmetric radius (14px general, 4px tail corner).

## Components

- Primary button: teal background, white text, 10px radius. Only one per screen.
- Cards: white background, subtle border, 16px radius. No shadow by default.
- Status badges: full-radius pills with color-coded backgrounds.
- Chat: bot messages right-aligned (brand teal), user messages left-aligned (muted gray).
- Tables: clean, minimal borders, row hover tint.

## Do's and Don'ts

- **Do** use CSS logical properties for all spacing in RTL.
- **Do** use brand teal sparingly — it's the interaction signal.
- **Do** ensure all Arabic text is legible at the target size.
- **Don't** use left/right — use inline-start/end and block-start/end.
- **Don't** introduce colors outside the palette — extend the palette first.
- **Don't** use heavy shadows — depth through borders and surface elevation.
- **Don't** mix Latin and Arabic in the same visual hierarchy without size adjustment.
