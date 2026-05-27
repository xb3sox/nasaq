# Nasaq Component Guide

Which component to use when. If it's not here, ask before building your own.

## Layout

### Page shell

**Use** `<PageShell>` for every dashboard page. Wraps content with standard padding, spacing, and max-width (default `max-w-6xl`).

```tsx
import { PageShell } from "@/components/ui/page-shell";

<PageShell size="wide">
  <PageHeader title="..." subtitle="..." />
  {/* content */}
</PageShell>
```

Props: `size="wide"` (default for dashboard), `"full"` (no max-width constraint).

### Landing section

**Use** `<LandingSection>` for marketing/landing page sections. Provides alternating background surfaces with centered max-width container.

```tsx
import { LandingSection } from "@/components/landing/landing-section";

<LandingSection
  background="muted"
  maxWidth="6xl"
  padded={true}
>
  {/* section content */}
</LandingSection>
```

Props:
- `background` — `"plain"` (default) | `"muted"` | `"gradient"`
- `maxWidth` — `"4xl"` | `"6xl"` (default) | `"7xl"` | `"full"`
- `padded` — boolean, adds vertical padding (default `true`)
- `className` — applied to the outer `<section>` (background, borders, positioning)
- `containerClassName` — applied to the inner max-width container (text alignment, `space-y-*`, grid layout)

### Centered page

**Use** `<CenteredPage>` for auth and setup pages. Centers content both vertically and horizontally.

```tsx
import { CenteredPage } from "@/components/ui/centered-page";

<CenteredPage surface="muted">
  {/* centered content */}
</CenteredPage>
```

**Use** `<PageHeader>` for every page title + optional subtitle + action buttons.

```tsx
import { PageHeader } from "@/components/ui/page-header";

<PageHeader
  title="الحجوزات"
  subtitle="جميع الحجوزات من واتساب والاستقبال"
  actions={<Button size="touch"><Plus /> حجز جديد</Button>}
/>
```

Props: `title` (required), `subtitle` (optional), `actions` (optional ReactNode).

## Data display

### StatCard

**Use** when showing a metric — number + label + trend indicator.

```tsx
import { StatCard } from "@/components/ui/stat-card";

<StatCard
  title="حجوزات اليوم"
  value={12}
  icon={CalendarCheck}
  iconColor="primary"
  trend={8}
  trendLabel="مقارنة بأمس"
/>
```

Props:
- `title` — card label
- `value` — the big number
- `icon` — Lucide icon component
- `iconColor` — `"brand" | "success" | "warning" | "danger" | "neutral" | "primary" | "muted"` (default `"primary"`)
- `trend` — percentage number (positive = green up arrow, negative = red down)
- `trendDirection` — `"up" | "down"` (string instead of percentage)
- `trendLabel` — text next to trend indicator
- `description` / `sub` — secondary text under the value
- `sparklineData` — `number[]` for inline mini chart

**Never** use `color="bg-brand-surface text-brand"` — use `iconColor="brand"`.

### StatusBadge

**Use** for any status indicator — booking state, payment state, lead state.

```tsx
import { StatusBadge } from "@/components/ui/status-badge";

<StatusBadge variant="success">مؤكد</StatusBadge>
<StatusBadge variant="warning">معلق</StatusBadge>
<StatusBadge variant="danger">ملغي</StatusBadge>
<StatusBadge variant="info">AI WhatsApp</StatusBadge>
<StatusBadge variant="whatsapp">واتساب</StatusBadge>
<StatusBadge variant="neutral">مكتمل</StatusBadge>
```

Variants: `"success" | "warning" | "danger" | "info" | "whatsapp" | "neutral" | "default"`

**Never** use `<Badge className="bg-success-surface text-success">` — use `<StatusBadge variant="success">`.

### Badge (raw shadcn)

**Use** the raw `<Badge>` with typed variants:

```tsx
<Badge variant="count">5</Badge>        {/* numeric count pill */}
<Badge variant="whatsapp">1</Badge>     {/* WhatsApp notification pill */}
<Badge variant="secondary">منتج</Badge> {/* generic secondary label */}
<Badge variant="neutral">مكتمل</Badge>  {/* neutral state */}
```

Variants: `"default" | "secondary" | "destructive" | "outline" | "neutral" | "count" | "whatsapp"`

**Never** use `<Badge className="bg-... text-...">` — use a variant instead.

### EmptyState

**Use** when a filtered list or page returns zero results.

```tsx
import { EmptyState } from "@/components/ui/empty-state";

<EmptyState
  title="لا توجد محادثات"
  description="لا توجد محادثات تطابق معايير البحث"
  action={<Button>مسح الفلاتر</Button>}
/>
```

## Interactive

### Button sizes

- `size="default"` — standard buttons (h-8)
- `size="touch"` — mobile-friendly 44px touch targets (auto-compacts to h-9 on desktop)
- `size="touch-icon"` — icon-only touch targets
- `size="sm" | "lg"` — small/large variants
- `size="icon" | "icon-sm" | "icon-lg"` — icon-only buttons

```tsx
<Button size="touch">حفظ</Button>
<Button size="touch-icon" variant="ghost"><MessageCircle /></Button>
```

**Never** write `className="min-h-[44px] sm:min-h-0 sm:h-9"` — use `size="touch"`.

### Input sizes

```tsx
<Input size="touch" placeholder="..." />
```

### SelectTrigger sizes

```tsx
<SelectTrigger size="touch"><SelectValue placeholder="..." /></SelectTrigger>
```

## Color tokens

All colors are semantic. Never use raw Tailwind color classes (`text-blue-500`, `bg-green-100`).

| Purpose | Text | Background | Border |
|---------|------|------------|--------|
| Primary action | `text-primary` | `bg-primary` | `border-primary` |
| Brand accent | `text-brand` | `bg-brand-surface` | `border-brand/20` |
| Success / confirmed | `text-success` | `bg-success-surface` | `border-success/20` |
| Warning / pending | `text-warning` | `bg-warning-surface` | `border-warning/20` |
| Error / cancelled | `text-destructive` | `bg-destructive/10` | `border-destructive/20` |
| Informational | `text-info` | `bg-info-surface` | `border-info/20` |
| WhatsApp | `text-whatsapp-dark` | `bg-whatsapp-muted` | `border-whatsapp/20` |
| Neutral / muted | `text-muted-foreground` | `bg-muted` | `border-transparent` |
| Secondary text | `text-muted-foreground` | — | — |
| Default surface | `text-card-foreground` | `bg-card` | `border-border` |

## Typography

- Page headings: `text-2xl font-bold tracking-tight` (via `PageHeader`)
- Card titles: `text-base font-semibold` or `text-sm font-medium` (shadcn CardTitle)
- Body text: default `text-sm` with `text-muted-foreground` for secondary
- Arabic text: `font-sans` (Noto Arabic) — auto-applied via `html.font-sans`
- Numbers/code: `font-mono` for phone numbers, IDs, code

## Spacing

- Page content: `space-y-8` between sections (via `PageShell`)
- Between cards: `gap-4` to `gap-6`
- Card padding: `p-5` or `p-6`
- Form fields: `space-y-4` with `gap-3` in grid layouts

## Grid/layout patterns

```tsx
// Stat card grid (4 columns)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

// Two-column layout
<div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

// Form field grids
<div className="grid grid-cols-2 gap-3">
```

## Guardrails

Run `npm run check-tokens` before committing. It catches:
- Hardcoded Tailwind color classes (`text-blue-500`)
- Hex colors in components (`#059669`)
- Inline touch-target classes (`min-h-[44px]`)
- Raw string color props on StatCard
- Copy-pasted page wrappers

Run `npm run check-docs` before committing. It catches:
- Stale framework version strings
- Stale test counts
- Stale localhost ports
- Doc files over their line budget

Run `npm run verify` for full gate: tests + lint + build + check-tokens + check-docs.
