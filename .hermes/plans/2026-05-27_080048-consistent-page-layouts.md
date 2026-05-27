# Consistent Page Layouts Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Make all Nasaq pages use one layout system, with explicit exceptions only where the product needs them.

**Architecture:** Next.js App Router already has `app/layout.tsx` and `app/dashboard/layout.tsx`; use those for route chrome, then enforce page content rhythm through shared primitives. Upgrade `PageShell` and `PageHeader` into the only allowed dashboard content wrappers. Marketing/login/setup remain specialized, but should still use shared layout primitives where possible instead of ad-hoc `min-h-screen p-* max-w-*` soup.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind 4, shadcn/ui, RTL Arabic.

**Docs checked:** Context7 `/vercel/next.js`: App Router layouts wrap pages/nested layouts; root layout must define `<html>`/`<body>`; `layout.tsx` defines shared UI for route segments.

## Root Cause Analysis

- `PageShell` exists, but it is too weak: only `p-6 space-y-8 max-w-*`, no variants, no centering policy, no dashboard/home/full-height behavior.
- Pages bypass it because special cases were solved locally: dashboard home uses custom `p-4 sm:p-6 lg:p-8`; reports overrides with `className="lg:p-8"`; inbox hardcodes viewport height math; setup/login/marketing own their own wrappers.
- Existing guardrail only catches one copy-pasted class string. It does not prevent new wrapper drift.
- Real fix: encode layout options in components + enforce forbidden wrapper patterns in `scripts/check-design-tokens.sh`.

---

## Layout Contract

### Dashboard route chrome

File: `app/dashboard/layout.tsx`

Keep responsibility narrow:

- sidebar shell
- RTL route container
- `<main id="main-content">`
- no per-page padding here, because inbox/reports/home need controlled variants

Target shape:

```tsx
<main id="main-content" className="min-w-0 flex-1 pt-16 lg:pt-0 lg:ms-64">
  {children}
</main>
```

### PageShell variants

File: `components/ui/page-shell.tsx`

Add typed variants:

```ts
type PageShellSize = "default" | "wide" | "full";
type PageShellSpacing = "default" | "compact" | "none";
type PageShellSurface = "plain" | "gradient";
type PageShellHeight = "auto" | "viewport";
```

Required behavior:

- default dashboard padding: `p-4 sm:p-6 lg:p-8`
- default vertical rhythm: `space-y-6 sm:space-y-8`
- default max width: `max-w-4xl mx-auto w-full`
- wide: `max-w-6xl mx-auto w-full`
- full: `w-full max-w-none`
- viewport: min height works with sidebar/header chrome, no fragile page-local math unless unavoidable
- gradient surface: one canonical dashboard top gradient used by dashboard home only

### PageHeader contract

File: `components/ui/page-header.tsx`

Add:

- `eyebrow?: ReactNode`
- `description?: string` as alias or replacement for `subtitle`
- `align?: "start" | "between"`
- `size?: "default" | "hero"`
- `actionsClassName?: string`

Required behavior:

- consistent `h1` sizing
- responsive action wrapping
- no page-level duplicated header flex wrappers

---

## Tasks

### Task 1: Snapshot current layout drift

**Objective:** Create a quick inventory before changing files.

**Files:**
- Read: `app/dashboard/page.tsx`
- Read: `app/dashboard/*/page.tsx`
- Read: `app/page.tsx`
- Read: `app/setup/page.tsx`
- Read: `app/login/page.tsx`
- Read: `components/ui/page-shell.tsx`
- Read: `components/ui/page-header.tsx`

**Steps:**

1. Record each page root wrapper and whether it uses `PageShell`.
2. Record each `PageShell` prop usage.
3. Record hardcoded page layout classes: `min-h-screen`, `p-4`, `p-6`, `lg:p-8`, `max-w-* mx-auto`, `h-[calc(...)]`.
4. Confirm no visual route is missed: `/`, `/login`, `/setup`, `/dashboard`, `/dashboard/bookings`, `/dashboard/inbox`, `/dashboard/invoices`, `/dashboard/reports`, `/dashboard/settings`, `/dashboard/crm`, `/dashboard/reminders`.

**Verify:** inventory matches filesystem.

---

### Task 2: Upgrade `PageShell`

**Objective:** Make layout choices explicit and typed.

**Modify:** `components/ui/page-shell.tsx`

**Implementation target:**

```tsx
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
```

**Verify:** `npm run lint` should not fail from this file.

---

### Task 3: Upgrade `PageHeader`

**Objective:** Stop pages from rebuilding header layout locally.

**Modify:** `components/ui/page-header.tsx`

**Implementation target:**

```tsx
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
```

**Verify:** existing `subtitle` users still compile.

---

### Task 4: Normalize dashboard home

**Objective:** Remove dashboard home as a layout outlier without killing its custom hero feel.

**Modify:** `app/dashboard/page.tsx`

**Change:**

- import `PageShell` and `PageHeader`
- replace root wrapper:

```tsx
<PageShell surface="gradient" size="wide">
```

- remove local gradient div:

```tsx
<div className="absolute inset-0 bg-gradient-to-b ..." />
```

- replace custom title/header wrapper with `PageHeader size="hero"` and actions/status.
- keep `RiyadhClock` as header body/eyebrow area or immediate element below header.

**Verify:** dashboard still shows setup warning, quick actions, stat cards, live demo.

---

### Task 5: Normalize dashboard child pages

**Objective:** One page wrapper API across all dashboard pages.

**Modify:**
- `app/dashboard/bookings/page.tsx`
- `app/dashboard/crm/page.tsx`
- `app/dashboard/invoices/page.tsx`
- `app/dashboard/reminders/page.tsx`
- `app/dashboard/reports/page.tsx`
- `app/dashboard/settings/page.tsx`

**Changes:**

- Use `<PageShell size="default">` for standard pages.
- Use `<PageShell size="wide">` for data-heavy pages: reports, invoices, bookings, CRM if table/kanban feels cramped.
- Remove `maxWidth="6xl" className="lg:p-8"` from reports; replace with `size="wide"`.
- No bare page-root `p-*`, `max-w-*`, or `mx-auto` in route files.

**Verify:** each page has exactly one route-level `PageShell` and one main `PageHeader`, except intentionally modal/detail internals.

---

### Task 6: Fix inbox height without layout math sprawl

**Objective:** Inbox should fit the dashboard shell consistently.

**Modify:** `app/dashboard/inbox/page.tsx`

**Change:**

- Use:

```tsx
<PageShell size="full" height="viewport" className="flex flex-col">
```

- Replace page-local:

```tsx
h-[calc(100vh-12rem)]
```

with a layout inside shell:

```tsx
<div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
```

- Put scrolling on inner panels, not the page root.

**Verify:** mobile conversation list does not overflow; desktop chat panel fills remaining height.

---

### Task 7: Treat marketing/setup/login as explicit route classes

**Objective:** Keep product-specific layouts, but stop pretending every exception is random.

**Modify / Create:**
- Create: `components/ui/centered-page.tsx`
- Modify: `app/login/page.tsx`
- Modify: `app/setup/page.tsx`
- Optional later: `components/marketing/*` for `app/page.tsx`

**CenteredPage target:**

```tsx
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
```

**Changes:**

- login: replace outer `div + main` with `<CenteredPage maxWidth="sm">`.
- setup: replace outer wrapper with `<CenteredPage maxWidth="4xl" surface="muted" contentClassName="space-y-8">` and keep background decoration as a child/prop.
- marketing home: do not force into dashboard `PageShell`; later split repeated marketing section wrappers into `MarketingSection` if needed.

**Verify:** login/setup stay centered and RTL.

---

### Task 8: Add real guardrails

**Objective:** Prevent layout drift from returning. Future copy-paste goblins get stopped at lint time.

**Modify:** `scripts/check-design-tokens.sh`

Add checks:

1. dashboard route pages must use `PageShell` unless allowlisted.
2. dashboard route pages must not have root-ish wrappers:
   - `className="p-4 sm:p-6 lg:p-8`
   - `className="p-6 space-y-8`
   - `max-w-4xl mx-auto`
   - `max-w-6xl mx-auto`
   - `h-[calc(100vh-`
3. `app/dashboard/*/page.tsx` must not pass legacy `maxWidth=` after migration; use `size=`.

Keep allowlist tiny:

- none for dashboard pages after this plan
- marketing/login/setup handled outside `app/dashboard`, so guardrail should not block them

**Verify:**

```bash
npm run check-tokens
```

Expected: pass.

---

### Task 9: Add tests for layout primitives and guardrail script

**Objective:** Validate the system without needing browser snapshots.

**Create:** `tests/layout-primitives.test.ts`

Test by reading source files, same style as existing tests:

- `PageShell` supports `size`, `spacing`, `surface`, `height`.
- `PageShell` includes default responsive padding `p-4 sm:p-6 lg:p-8`.
- `PageHeader` supports `description`, `actionsClassName`, `size="hero"`.
- each dashboard page imports/uses `PageShell`.
- no dashboard page contains banned page-root wrappers.

**Verify:**

```bash
npm test
```

Expected: all tests pass.

---

### Task 10: Visual smoke pass

**Objective:** Catch the stuff unit tests cannot: cramped headers, broken RTL, dead scroll regions.

**Run:**

```bash
npm run dev
```

Visit:

- `/`
- `/login`
- `/setup`
- `/dashboard`
- `/dashboard/bookings`
- `/dashboard/inbox`
- `/dashboard/invoices`
- `/dashboard/reports`
- `/dashboard/settings`
- `/dashboard/crm`
- `/dashboard/reminders`

Check:

- consistent top padding
- consistent content width
- header actions wrap cleanly on mobile
- RTL spacing uses logical directions
- inbox scrolls inside panels, not body-chaos
- no horizontal overflow

---

### Task 11: Full quality gate

**Run:**

```bash
npm run verify
```

Expected:

- tests pass
- eslint clean
- Next build succeeds
- design token/layout guardrails pass

---

## Files Likely To Change

- `components/ui/page-shell.tsx`
- `components/ui/page-header.tsx`
- `components/ui/centered-page.tsx`
- `app/dashboard/page.tsx`
- `app/dashboard/bookings/page.tsx`
- `app/dashboard/crm/page.tsx`
- `app/dashboard/inbox/page.tsx`
- `app/dashboard/invoices/page.tsx`
- `app/dashboard/reminders/page.tsx`
- `app/dashboard/reports/page.tsx`
- `app/dashboard/settings/page.tsx`
- `app/login/page.tsx`
- `app/setup/page.tsx`
- `scripts/check-design-tokens.sh`
- `tests/layout-primitives.test.ts`

## Do Not Do

- Do not shove all pages into `app/dashboard/layout.tsx` padding. Inbox will suffer. Reports will sulk. Both are right.
- Do not use grep-and-replace only. That fixes today and re-breaks tomorrow.
- Do not add random one-off layout classes in route files after the primitives exist.
- Do not touch API/business logic.
- Do not rewrite marketing page content in this pass unless layout extraction is trivial.

## Acceptance Criteria

- Dashboard pages use `PageShell` consistently.
- Header layout uses `PageHeader` consistently.
- Login/setup use `CenteredPage` instead of ad-hoc duplicated centered wrappers.
- Reports/inbox have explicit `PageShell` variants, not local hacks.
- Guardrail script fails on new dashboard layout drift.
- `npm run verify` passes.
