---
version: alpha
name: Nasaq (نسق)
description: Teal + warm red palette for Saudi clinic SaaS. Clean, clinical, trustworthy. Arabic-first AI clinic flow for Riyadh clinics.
colors:
  primary: "oklch(0.55 0.12 180)"
  secondary: "oklch(0.96 0.01 180)"
  background: "oklch(0.99 0.005 180)"
  foreground: "oklch(0.2 0.02 180)"
  card: "oklch(1 0 0)"
  card-foreground: "oklch(0.2 0.02 180)"
  muted: "oklch(0.96 0.01 180)"
  muted-foreground: "oklch(0.5 0.02 180)"
  accent: "oklch(0.95 0.02 180)"
  border: "oklch(0.9 0.02 180)"
  input: "oklch(0.9 0.02 180)"
  ring: "oklch(0.55 0.12 180)"
  brand: "oklch(0.55 0.12 180)"
  brand-foreground: "oklch(0.98 0.01 180)"
  brand-hover: "oklch(0.5 0.11 180)"
  brand-muted: "oklch(0.95 0.03 180)"
  brand-surface: "oklch(0.97 0.02 180)"
  whatsapp: "#25D366"
  whatsapp-dark: "#128C7E"
  whatsapp-muted: "#DCF8C6"
  success: "oklch(0.6 0.15 150)"
  success-surface: "oklch(0.95 0.03 150)"
  warning: "oklch(0.65 0.15 85)"
  warning-foreground: "oklch(0.25 0.05 85)"
  warning-surface: "oklch(0.96 0.04 85)"
  destructive: "oklch(0.6 0.15 20)"
  destructive-foreground: "oklch(0.98 0.01 20)"
  info: "oklch(0.55 0.12 240)"
  info-foreground: "oklch(0.98 0.01 240)"
  info-surface: "oklch(0.95 0.02 240)"
  sidebar: "oklch(0.99 0.005 180)"
  sidebar-foreground: "oklch(0.2 0.02 180)"
  sidebar-primary: "oklch(0.55 0.12 180)"
typography:
  h1:
    fontFamily: "var(--font-noto-arabic), var(--font-geist-sans), sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  h2:
    fontFamily: "var(--font-noto-arabic), var(--font-geist-sans), sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "var(--font-noto-arabic), var(--font-geist-sans), sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "var(--font-noto-arabic), var(--font-geist-sans), sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  mono:
    fontFamily: "var(--font-geist-mono), ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "calc(0.75rem * 0.6)"
  md: "calc(0.75rem * 0.8)"
  lg: "0.75rem"
  xl: "calc(0.75rem * 1.4)"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  "2xl": "3rem"
components:
  button-primary:
    backgroundColor: "var(--primary)"
    textColor: "var(--primary-foreground)"
    rounded: "0.5rem"
    padding: "0 0.625rem"
    typography: "0.875rem medium"
  button-secondary:
    backgroundColor: "var(--secondary)"
    textColor: "var(--secondary-foreground)"
    rounded: "0.5rem"
    padding: "0 0.625rem"
  sidebar:
    backgroundColor: "var(--card)"
    textColor: "var(--foreground)"
    width: "16rem"
  card:
    backgroundColor: "var(--card)"
    textColor: "var(--card-foreground)"
    rounded: "0.75rem"
  input:
    backgroundColor: "transparent"
    borderColor: "var(--input)"
    rounded: "0.5rem"
    padding: "0.25rem 0.625rem"
  input-focus:
    borderColor: "var(--ring)"
    ringColor: "var(--ring)"
---

## Overview

Nasaq (نسق) is an Arabic-first AI clinic flow platform serving Riyadh clinics. The design communicates **cleanliness, trust, and clinical precision** — a healthcare SaaS that feels modern, calm, and professional. The teal primary evokes medical hygiene and calm efficiency; warm reds and ambers provide clear status signaling without anxiety.

Arabic is the primary language. All typography, spacing, and component design must support RTL layout without degradation. Every design decision considers a clinic manager scanning a dashboard between patient consultations — fast recognition, clear hierarchy, minimal decoration.

**Color strategy: Light, airy, teal-driven.** The primary teal carries ~10–15% of the surface (sidebar highlights, CTAs, active states, links). The overall UI is intentionally light — near-white backgrounds, subtle borders, and teal accents only where interaction demands attention. Status colors (success/warning/destructive) are used sparingly for semantic meaning.

**Scene:** A clinic manager at their desk in Riyadh, midday, checking WhatsApp bookings, CRM leads, and daily reports. Fast scanning, high-contrast data, and touch-friendly controls for tablet use.

**Standard:** shadcn/ui design tokens via Tailwind 4 CSS custom properties. Colors use OKLCH for perceptual uniformity. No hex colors in components (WhatsApp brand colors exempt). Every color is a CSS variable — never a hardcoded Tailwind class.

## Colors

- **Primary (`oklch(0.55 0.12 180)`):** Teal — the core interaction color. Medical-grade without being cold. Used for primary buttons, active nav states, focus rings, and links. Do NOT use as body text on light backgrounds — use for UI chrome and interaction cues only.
- **Secondary (`oklch(0.96 0.01 180)`):** Near-white teal tint. Used for secondary buttons, muted surfaces, and subtle backgrounds.
- **Background (`oklch(0.99 0.005 180)`):** Page background. Off-white with a whisper of teal — cleaner than pure white, avoids clinical sterility.
- **Foreground (`oklch(0.2 0.02 180)`):** Dark teal for body text. High contrast on light backgrounds (WCAG AAA). Warmer than pure black.

### Surface

- **Card (`oklch(1 0 0)`):** Pure white cards on near-white background. Cards are distinguished by `ring-1 ring-foreground/10` — a subtle 10%-opacity foreground ring, NOT a border class. This creates softer separation than solid borders.
- **Border (`oklch(0.9 0.02 180)`):** Light teal-gray for dividers, card separators within cards, and sidebar borders.
- **Input (`oklch(0.9 0.02 180)`):** Same as border — used for input field borders.
- **Ring (`oklch(0.55 0.12 180)`):** Focus ring — matches primary. Applied as `ring-2 ring-primary ring-offset-2`.

### Muted

- **Muted (`oklch(0.96 0.01 180)`):** Secondary backgrounds, hover states, disabled surfaces. Same value as secondary — aliased for semantic clarity.
- **Muted FG (`oklch(0.5 0.02 180)`):** Secondary text, placeholders, captions, metadata. WCAG AA on white and near-white backgrounds.

### Brand Accent

- **Brand (`oklch(0.55 0.12 180)`):** Same as primary — the teal interaction driver. Aliased under `--brand` for semantic usage (branded elements vs. generic UI). All references in DESIGN.md's globals.css comment: "Brand accent — teal, the interaction driver per DESIGN.md."
- **Brand Hover (`oklch(0.5 0.11 180)`):** Darker teal for hover states.
- **Brand Muted (`oklch(0.95 0.03 180)`):** Light teal tint for selected rows, subtle highlights.
- **Brand Surface (`oklch(0.97 0.02 180)`):** Background for brand-accented containers (info badges, brand-colored icon containers in StatCard).

### Status

- **Success (`oklch(0.6 0.15 150)`):** Green. Confirmation, booking confirmed, positive trends, online indicators.
- **Warning (`oklch(0.65 0.15 85)`):** Amber. Pending actions, setup incomplete banners, warm alerts.
- **Destructive (`oklch(0.6 0.15 20)`):** Warm red. Errors, human-needed indicators, delete actions. Used as `bg-destructive/10` + `text-destructive` — never solid fill for destructive elements in the main UI.
- **Info (`oklch(0.55 0.12 240)`):** Blue. Informational banners, tips, neutral notifications.

### WhatsApp

WhatsApp brand colors use hex values (exempt from the no-hex rule — these are third-party brand requirements):

- **WhatsApp (`#25D366`):** WhatsApp green. Used for WhatsApp-specific UI elements and badges.
- **WhatsApp Dark (`#128C7E`):** Dark teal-green. WhatsApp conversation indicators, WhatsApp-related icons.
- **WhatsApp Muted (`#DCF8C6`):** Light green. WhatsApp message bubble backgrounds, timeline step backgrounds.

## Typography

### Font stack

- **Sans-serif / Heading:** Noto Arabic → Geist Sans → sans-serif. Noto Arabic handles Arabic text with excellent Naskh proportions across all weights. Geist Sans carries Latin and numerals with clean geometric precision. Both have full RTL support.
- **Monospace:** Geist Mono. Code blocks, API responses, data tables.

### Scale

| Token | Size | Weight | Line | Usage |
|-------|------|--------|------|-------|
| Hero (PageHeader size="hero") | 1.875rem / 2.25rem (sm+) | 700 | 1.2 | Dashboard landing, marketing pages |
| H1 (PageHeader default) | 1.5rem | 700 | 1.3 | Page titles |
| Card Title | 1rem | 500 | 1.3 | Card headers |
| Body | 0.875rem | 400 | 1.5 | Prose, descriptions, table cells |
| Body-sm / Caption | 0.75rem | 400 | 1.5 | Labels, metadata, footnotes |
| Mono | 0.875rem | 400 | 1.5 | Code, API responses |

### Arabic notes

- Noto Arabic is the primary Arabic font. It has native Naskh proportions that read well at body sizes.
- Line-height: Arabic needs slightly taller line-height than Latin due to diacritics. 1.5 for body text, 1.3 for headings.
- No all-caps Arabic — Arabic has no uppercase. Use weight + color for emphasis instead.
- All user-facing text is Arabic. Code and comments are English.

## Layout & Spacing

- **Sidebar:** Fixed 16rem (256px, `w-64`). White/light background (`bg-card`), border-end separator. Independent scroll. Not a dark sidebar like Wasl — Nasaq uses a light, airy sidebar that blends with the card-based layout.
- **Page max-width:** 4xl (56rem / 896px) default, 6xl (72rem / 1152px) wide, full-width available.
- **PageShell padding:** `p-4 sm:p-6 lg:p-8` default, `p-4 sm:p-6` compact.
- **Section gap:** `space-y-6 sm:space-y-8` default, `space-y-4 sm:space-y-6` compact.
- **Card padding:** 1rem (16px, `py-4 px-4`). Cards use `gap-4` internally.
- **Grid:** Cards grid uses `gap-6`. StatCard grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`.
- **Form spacing:** `space-y-2` between label and input (within PageHeader subtitle area).
- **Touch targets:** Minimum 44px (`min-h-[44px]`) via `size="touch"` prop on buttons and inputs — never inline classes.

## Elevation & Depth

- **Cards:** Use `ring-1 ring-foreground/10` for separation — a 10%-opacity ring, NOT a border class. This is a key distinction: `ring-1` creates softer, more modern separation than `border`. Cards do NOT use box-shadow by default.
- **Card hover:** `hover:shadow-md` on StatCards for subtle lift on interaction.
- **Sidebar:** Flat color, no shadow. Border-end (`border-e border-border/50`).
- **Mobile sidebar backdrop:** `bg-black/40 backdrop-blur-sm` overlay.
- **Modals/Dialogs:** shadcn/ui dialog with backdrop blur.
- **Z-index scale:** dropdown (10) → sticky header (20) → sidebar (30) → hamburger (40) → mobile sidebar/modal (50).
- **Nav elements:** `shadow-sm` on logo container, user avatar.

## Shapes

- **Radius:** 0.75rem (12px) base. Derived sizes: sm (~7px), md (~10px), lg (12px), xl (~17px).
- **Buttons:** `rounded-lg` (8px via Tailwind's lg = 0.5rem).
- **Cards:** `rounded-xl` (12px via Tailwind's xl = 0.75rem, matching the base radius).
- **Badges:** `rounded-md` (6px).
- **Inputs:** `rounded-lg` (8px).
- **Sidebar nav items:** `rounded-xl` (12px).
- **StatCard icon containers:** `rounded-xl` (12px).
- **User avatar / logo container:** `rounded-xl` (12px).
- **Status badges:** `rounded-md` (6px). Pill shapes used for WhatsApp badges (`rounded-full`).
- No pill shapes for cards. No glassmorphism outside landing page. No gradient text in the app dashboard.

## Components

### Button

- **Primary (default):** Teal background (`bg-primary`), white text (`text-primary-foreground`). The single highest-emphasis action on a page. `h-8` default, `rounded-lg`.
- **Secondary:** Light teal background (`bg-secondary`), dark teal text (`text-secondary-foreground`).
- **Outline:** Transparent, border, hover background. Alternative actions, cancel.
- **Ghost:** Transparent, hover bg. Subtle actions, toolbar items.
- **Destructive:** Light red background (`bg-destructive/10`), red text (`text-destructive`). Irreversible actions.
- **Link:** Teal text, underline on hover. Inline navigation.
- **Touch (`size="touch"`):** `min-h-[44px]` for mobile/tablet. Reduces to `sm:h-9 sm:min-h-0` on desktop.
- **Sizes:** xs (24px), sm (28px), default (32px), lg (36px), touch (44px mobile / 36px desktop).
- **Focus:** `focus-visible:ring-3 focus-visible:ring-ring/50`.
- **Loading:** `disabled:opacity-50 disabled:pointer-events-none`. Keep width stable.
- **Active press:** `active:not-aria-[haspopup]:translate-y-px` — subtle press-down feedback.

### Sidebar

- Light background (`bg-card`), not dark. Fixed 256px width (`w-64`). `border-e border-border/50`.
- Header: Logo + brand name (Nasaq / نسق). `px-5 py-6`.
- Clinic selector: `rounded-xl` button with clinic name and location. `px-3 py-2.5`.
- Nav items: `rounded-xl`, `px-3 py-2.5`, `space-y-1.5`.
- Active state: `bg-primary/5 text-primary` + right border accent (`border-e-2 border-primary rounded-e-none`).
- Inactive: `text-muted-foreground`, hover → `bg-muted text-foreground`.
- Notification badges: `min-w-[20px] h-5 rounded-full` pill. Active → `bg-primary`, inactive → `bg-destructive`.
- User footer: Avatar with online indicator (`bg-success border-2 border-card rounded-full`).
- Mobile: Slide-in from start (RTL-aware), backdrop blur overlay.

### Card

- White background (`bg-card`), `rounded-xl`, `ring-1 ring-foreground/10` — key: ring, not border.
- Internal padding: `py-4 px-4`. Internal gap: `gap-4`.
- CardHeader: `px-4`, optional bottom border via `border-b border-border/50 pb-4`.
- CardTitle: `text-base font-medium leading-snug font-heading`.
- CardContent: `px-4`.
- CardFooter: `border-t bg-muted/50 p-4 rounded-b-xl`.
- Compact size (`size="sm"`): `gap-3 py-3`, header px-3, content px-3.
- Do NOT nest cards. Do NOT add box-shadows to base cards.

### StatCard

- Full-width card with icon container, large metric, and optional trend indicator.
- Icon container: `w-10 h-10 rounded-xl` with semantic background (brand-surface, success-surface, warning-surface, destructive/10, muted).
- Value: `text-3xl font-bold tracking-tight`.
- Label: `text-sm font-medium text-muted-foreground`.
- Trend: Small arrow icon + percentage in success/destructive color.
- Sparkline: Optional Recharts line chart (80px max-width, muted opacity).
- Color variants: `brand`, `success`, `warning`, `danger`, `neutral`, `primary`, `muted` — typed `StatCardColor`, NOT raw string props.

### Input

- `h-8`, `rounded-lg`, `border border-input`, `bg-transparent`.
- Padding: `px-2.5 py-1`.
- Placeholder: `text-muted-foreground`.
- Focus: `border-ring ring-3 ring-ring/50`.
- Error: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`.
- Disabled: `bg-input/50 opacity-50`.
- Touch (`size="touch"`): `min-h-[44px]` mobile, `sm:h-9 sm:min-h-0` desktop.
- Label above input via PageHeader subtitle area or standard form layout.

### Badge / StatusBadge

- **Badge:** `rounded-md border px-2.5 py-0.5 text-xs font-semibold`. Variants: default (primary), secondary, destructive, outline, neutral, count, whatsapp.
- **StatusBadge:** Semantic wrapper over Badge. Variants: success, warning, danger, info, whatsapp, neutral, default. Each variant maps to the appropriate surface + text tokens (e.g., success → `bg-success-surface text-success border-success/20`).
- Never use inline color classes on Badge/StatusBadge — use typed variants only.

### PageShell & PageHeader

- **PageShell:** Every dashboard page and feature component is wrapped in exactly one PageShell. Sizes: default (max-w-4xl), wide (max-w-6xl), full. Spacing: default, compact, none. Surface: plain or gradient (dashboard overview gets gradient surface with teal-tinted top).
- **PageHeader:** Title + optional eyebrow/subtitle/actions. Sizes: default (text-2xl) or hero (text-3xl/sm:text-4xl). Eyebrow renders in `text-sm font-medium text-primary`.

### Data Display

- **Tables:** shadcn/ui table. Striped rows via alternating bg. Border-bottom separators.
- **Timeline:** Vertical line (`bg-border w-0.5`) + circular icon steps with semantic colors (whatsapp-muted, primary/10, brand-surface, success-surface, warning-surface).
- **Empty states:** `EmptyState` component with icon + title + description + action button.

## Do's and Don'ts

### ✅ Do

- Use primary teal for the single most important action on a page
- Use CSS variables for ALL colors — never hardcoded Tailwind color classes (bg-blue-500, text-green-600, etc.)
- Use `ring-1 ring-foreground/10` for card separation — not border classes
- Use `rounded-xl` for cards, `rounded-lg` for buttons and inputs
- Use `lucide-react` for all icons — never emojis in UI
- Use `size="touch"` prop for touch-friendly controls — never inline `min-h-[44px]`
- Use PageShell + PageHeader for consistent page structure
- Use StatusBadge typed variants — never inline color classes on badges
- Use StatCard `iconColor` typed prop — never raw string props
- Support RTL — test every component with Arabic text
- Use `font-heading` for card titles, `font-sans` for body
- Keep route files thin (≤80 LOC) — feature UI in `features/`

### ❌ Don't

- Don't use hex colors in components (WhatsApp `#25D366` / `#128C7E` / `#DCF8C6` exempt)
- Don't use hardcoded Tailwind color classes (bg-blue-500, text-red-400, etc.)
- Don't use primary teal as body text — use foreground or muted-foreground
- Don't add box shadows to base cards — ring separation is the system
- Don't nest cards inside cards
- Don't use inline touch-target patterns — use `size="touch"`
- Don't use emojis in UI code — use lucide-react
- Don't use gradient text, glassmorphism, or decorative SVGs in the dashboard
- Don't use all-caps labels (Arabic has no uppercase)
- Don't skip PageShell wrapping — every page must have exactly one
- Don't use inline color classes on Badge or StatusBadge — use typed variants
- Don't use raw string props for StatCard iconColor — use the `StatCardColor` type
