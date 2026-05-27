# Nasaq Design System Consolidation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Replace copy-paste UI patterns with a small set of typed, composable primitives that make inconsistency impossible — not just fix existing instances.

**Architecture:** Three layers: (1) semantic design tokens in globals.css — single source of truth for all color/spacing/radius, (2) shadcn/ui primitives extended with project-specific variants (touch-target sizes, RTL-aware defaults), (3) thin layout shell components (PageShell, PageHeader) that enforce the standard page skeleton. No raw Tailwind color classes, no inline `min-h-[44px]`, no copy-pasted wrapper divs.

**Tech Stack:** Next.js 15.5, React 19, Tailwind 4, shadcn/ui (base-ui), TypeScript strict.

---

## Why Inconsistency Keeps Happening

The last two waves fixed *instances* but not *causes*:

1. **No forced path** — Every page author copies an existing page's `<div className="p-6 space-y-8 max-w-4xl">`. If someone forgets `max-w-4xl` or picks `p-8` instead, nothing stops them.
2. **StatCard `color` prop is a raw string** — `"bg-brand-surface text-brand"` — no type safety. Someone could write `"bg-blue-500 text-red-500"` and TS wouldn't complain.
3. **Touch targets are inline** — `min-h-[44px] sm:min-h-0 sm:h-9` copy-pasted 24+ times across 7 files. If Button size variants supported a `touch` modifier, this disappears.
4. **EmptyState exists but nobody uses it** — 0 imports. Dead code. Either kill it or wire it in.
5. **No design token checklist at PR time** — No lint rule says "don't use `text-blue-500`". Human review catches some, misses others.
6. **DESIGN.md is hex, globals.css is oklch** — Two sources of truth drifting apart.

---

## Implementation Plan

### Task 1: Add `touch` size variant to Button

**Objective:** Eliminate `min-h-[44px] sm:min-h-0 sm:h-{8,9}` repetition across all pages.

**Files:**
- Modify: `components/ui/button.tsx`
- Modify: `components/ui/input.tsx`
- Modify: `components/ui/select.tsx`

**Changes:**

1. Add `"touch"` size to `buttonVariants` in `button.tsx`:
```ts
"touch": "min-h-[44px] h-auto sm:h-9 sm:min-h-0 px-3 py-2.5 gap-1.5",
"touch-icon": "min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:size-8",
```

2. Add `"touch"` size to `SelectTrigger` variants:
```ts
data-[size=touch]:min-h-[44px] data-[size=touch]:sm:min-h-0 data-[size=touch]:sm:h-9
```

3. Add `"touch"` size to `Input` via a `data-size` attribute:
```ts
data-[size=touch]:min-h-[44px] data-[size=touch]:sm:min-h-0 data-[size=touch]:sm:h-9
```

4. Search-replace all 24 `min-h-[44px] sm:min-h-0 sm:h-{8,9}` patterns in page files with `size="touch"` (or `size="touch-icon"` for icon buttons).

**Verification:**
```bash
grep -rn 'min-h-\[44px\]' app/    # should return 0
grep -rn 'size="touch"' app/      # should show all previously-inline instances
npm run build && npm test
```

---

### Task 2: Create PageShell + PageHeader layout components

**Objective:** Eliminate copy-pasted `<div className="p-6 space-y-8 max-w-4xl">` / `<div className="space-y-2"><h1>...</h1><p>...</p></div>` across 7 pages.

**Files:**
- Create: `components/ui/page-shell.tsx`
- Create: `components/ui/page-header.tsx`

**PageShell:**
```tsx
interface PageShellProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "4xl" | "6xl" | "full";  // default "4xl"
}

export function PageShell({ children, className, maxWidth = "4xl" }: PageShellProps) {
  return (
    <div className={cn(
      "p-6 space-y-8",
      maxWidth === "4xl" && "max-w-4xl",
      maxWidth === "6xl" && "max-w-6xl",
      maxWidth === "full" && "",
      className
    )}>
      {children}
    </div>
  );
}
```

**PageHeader:**
```tsx
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;  // e.g. "New" button on the right
  className?: string;
}

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4 flex-wrap", className)}>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
```

4. Replace in all 7 dashboard pages + setup/login pages.

**Verification:**
```bash
grep -rn 'className="p-6 space-y-8' app/  # only in PageShell itself
grep -rn 'import.*PageShell' app/          # all pages
npm run build && npm test
```

---

### Task 3: Type-safe StatCard – kill the `color` string prop

**Objective:** Make StatCard's icon container styling type-safe. No more raw `"bg-brand-surface text-brand"` strings.

**Files:**
- Modify: `components/ui/stat-card.tsx`
- Modify: all page files using `color` prop

**Changes:**

1. Define a `StatCardColor` type mapped to semantic tokens:
```ts
type StatCardColor = "brand" | "success" | "warning" | "danger" | "neutral" | "primary";
```

2. Map each to the correct Tailwind classes:
```ts
const COLOR_MAP: Record<StatCardColor, { icon: string; container: string }> = {
  brand:   { icon: "text-brand",          container: "bg-brand-surface" },
  success: { icon: "text-success",        container: "bg-success-surface" },
  warning: { icon: "text-warning",        container: "bg-warning-surface" },
  danger:  { icon: "text-destructive",    container: "bg-destructive/10" },
  neutral: { icon: "text-muted-foreground", container: "bg-muted" },
  primary: { icon: "text-primary",        container: "bg-primary/10" },
};
```

3. Replace `color?: string` prop with `color?: StatCardColor`.

4. Remove the `hasExtendedProps` branch entirely — unify into a single render path.

5. Update all page callers: `color="bg-brand-surface text-brand"` → `color="brand"`.

**Verification:**
```bash
grep -rn 'color="bg-' app/   # should return 0
grep -rn 'color="text-' app/ # should return 0
tsc --noEmit                  # type-check
npm run build && npm test
```

---

### Task 4: Unify StatCard render paths (kill `hasExtendedProps`)

**Objective:** One StatCard component with one render path, no `if (hasExtendedProps)` branch.

**Files:**
- Modify: `components/ui/stat-card.tsx`

**Changes:**

Current state: two completely different Card structures based on whether `trendDirection`/`sparklineData`/`sub`/`color` are passed. The "extended" path uses `Card className="p-5 ..."`, the "original" uses `CardHeader + CardContent`. These should be one unified layout.

Choose the "extended" layout as canonical (it's more flexible) and adapt existing dashboard usages:

```tsx
export function StatCard({ title, value, icon: Icon, iconColor = "primary", trend, trendDirection, trendLabel, description, sub, sparklineData, className, valueClassName }: StatCardProps) {
  const colors = COLOR_MAP[iconColor];

  return (
    <Card className={cn("p-5 hover:shadow-md transition-shadow duration-200 flex flex-col justify-between min-w-0", className)}>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-muted-foreground truncate">{title}</div>
            <div className={cn("text-2xl font-bold mt-1 truncate", valueClassName)}>{value}</div>
            {(sub || description) && (
              <div className="text-xs text-muted-foreground mt-1 truncate">{sub || description}</div>
            )}
          </div>
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", colors.container)} role="img">
            <Icon className={cn("w-5 h-5", colors.icon)} aria-hidden="true" />
          </div>
        </div>
      </div>

      {(trendDirection || trend !== undefined || sparklineData) && (
        <div className="mt-4 flex items-end justify-between h-10 gap-4">
          {/* trend display */}
          {trendDirection ? (
            <div className={cn("flex items-center gap-1 text-xs font-medium mb-1",
              trendDirection === "up" ? "text-success" : "text-destructive")}>
              {trendDirection === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              <span>{trendLabel || (trendDirection === "up" ? "↑" : "↓")}</span>
            </div>
          ) : trend !== undefined ? (
            <div className="flex items-center gap-1 text-xs font-medium mb-1">
              <span className={cn("flex items-center",
                trend > 0 ? "text-success" : trend < 0 ? "text-destructive" : "text-muted-foreground")}>
                {trend > 0 ? <ArrowUpRight className="w-3 h-3 me-1" /> : trend < 0 ? <ArrowDownIcon className="w-3 h-3 me-1" /> : null}
                <span>{trend > 0 ? "+" : ""}{trend}%</span>
              </span>
              {trendLabel && <span className="text-muted-foreground">{trendLabel}</span>}
            </div>
          ) : <div />}

          {sparklineData && <Sparkline data={sparklineData} direction={trendDirection} />}
        </div>
      )}
    </Card>
  );
}
```

5. Use consistent icon sizing: always `w-10 h-10 rounded-xl` (was `p-2 rounded-lg` in original path). Update dashboard page if visual changes needed.

**Verification:**
- Dashboard page StatCards render identically
- Reports page StatCards render identically
- `npm run build && npm test`
- Visual comparison: `browser_navigate` to each page

---

### Task 5: EmptyState – adopt or delete

**Objective:** Stop pretending `components/ui/empty-state.tsx` exists. Either wire it into pages or remove it.

**Files:**
- Either: use in 3+ pages, or delete `components/ui/empty-state.tsx`

**Decision:** Wire it in. The component is well-designed and matches shadcn patterns.

**Pages to wire:**
- `app/dashboard/inbox/page.tsx` — replace inline "لا توجد محادثات" with `<EmptyState title="لا توجد محادثات" description="..." />`
- `app/dashboard/bookings/page.tsx` — replace inline empty filter state
- `app/dashboard/crm/page.tsx` — replace inline empty filter state
- `app/dashboard/invoices/page.tsx` — replace inline empty state
- `app/dashboard/reminders/page.tsx` — replace inline empty state

**Verification:**
```bash
grep -rn 'import.*EmptyState' app/  # 5+ imports
grep -rn 'لا توجد' app/             # should find EmptyState usages, not raw divs
npm run build && npm test
```

---

### Task 6: ESLint rule – ban hardcoded Tailwind colors

**Objective:** Catch hardcoded colors at lint time, not during PR review.

**Files:**
- Create/modify: `eslint.config.mjs` (or `.eslintrc`)

**Rule:** `@stylistic/no-restricted-syntax` or a custom `no-restricted-classes` (use `tailwindcss/no-custom-classname` if an ESLint plugin exists, or write a simple regex rule):

```js
// In eslint.config.mjs, add a custom rule or use no-restricted-syntax:
rules: {
  'no-restricted-syntax': ['error', {
    selector: 'Literal[value=/\\b(text|bg|border|ring|outline|from|to|via|fill|stroke|shadow|placeholder|accent|caret|scrollbar)-(blue|green|red|yellow|purple|pink|orange|gray|slate|zinc|neutral|stone|amber|lime|emerald|teal|cyan|sky|indigo|violet|fuchsia|rose)-\\d/]',
    message: 'Use design tokens instead of raw Tailwind color classes (e.g. "text-brand" not "text-teal-500")'
  }]
}
```

Also ban hex colors in className strings:
```js
{
  selector: 'Literal[value=/\\b#[0-9a-fA-F]{3,8}\\b/]',
  message: 'Use CSS custom properties (var(--brand)) not hex values in className'
}
```

**Verification:**
```bash
npm run lint  # should pass with 0 violations
# Test: temporarily add `text-blue-500` to a page, lint should fail
```

---

### Task 7: DESIGN.md ↔ globals.css audit and alignment

**Objective:** Single source of truth for design tokens. DESIGN.md for human reference, globals.css for machine. They must agree.

**Files:**
- Modify: `DESIGN.md`
- Modify: `app/globals.css`

**Changes:**

1. Add `--info` semantic token (used by StatusBadge `info` variant but not defined in CSS):
```css
--info: oklch(0.55 0.12 240);
--info-foreground: oklch(0.98 0.01 240);
--info-surface: oklch(0.95 0.02 240);
```

2. Update DESIGN.md to match globals.css (use oklch values, not hex):
   - Current DESIGN.md says `brand: "#0D9488"` but globals.css uses `oklch(0.55 0.12 180)` (teal). Align to oklch.
   - Add `info` token
   - Add `--radius-*` scale
   - Add dark mode token variants

3. Add a `check-design-tokens` script to `package.json`:
```json
"check-tokens": "node scripts/check-design-tokens.js"
```
That verifies every CSS variable referenced in components exists in globals.css.

**Verification:**
```bash
npm run check-tokens  # should pass
diff <(grep '--color-' app/globals.css | sort) <(grep '@theme' app/globals.css -A 100 | grep '--color-' | sort)  # should match
```

---

### Task 8: Component usage guide (documentation)

**Objective:** One markdown doc that answers "which component do I use for X?" so future devs don't guess.

**Files:**
- Create: `docs/COMPONENTS.md`

**Content outline:**
```markdown
# Component Guide

## When to use what

### Showing a metric → `StatCard`
```tsx
<StatCard title="حجوزات اليوم" value={12} icon={CalendarCheck} iconColor="primary" trend={8} trendLabel="مقارنة بأمس" />
```

### Showing a status → `StatusBadge`
```tsx
<StatusBadge variant="success">مؤكد</StatusBadge>
```

### Page shell → `PageShell` + `PageHeader`
```tsx
<PageShell>
  <PageHeader title="الحجوزات" subtitle="..." actions={<Button size="touch">+ جديد</Button>} />
  {/* content */}
</PageShell>
```

### Empty state → `EmptyState`
```tsx
<EmptyState title="لا توجد نتائج" description="..." action={<Button>إضافة</Button>} />
```

### Color tokens
| Token | Usage |
|-------|-------|
| `text-brand` | Primary interaction, CTAs |
| `text-success` | Confirmed, completed, paid |
| `text-warning` | Pending, attention needed |
| `text-destructive` | Cancelled, errors, danger |
| `text-muted-foreground` | Secondary text, labels |
| `bg-brand-surface` | Highlighted sections |
| `bg-success-surface` | Success backgrounds |
| `bg-warning-surface` | Warning backgrounds |

### Touch targets
- Mobile: use `size="touch"` on Button, Input, SelectTrigger
- Desktop: default `size` auto-compacts
- Never write `min-h-[44px]` — use the variant
```

**Verification:** Doc exists, covers all major patterns.

---

## Execution Order

Tasks are ordered by dependency:

1. **Task 1** — Touch target variants (Button/Input/Select) → foundation, blocks nothing
2. **Task 2** — PageShell + PageHeader → new components, no dependency
3. **Task 3** — StatCard type-safe color → depends on nothing, but callers must be updated
4. **Task 4** — Unify StatCard → depends on Task 3 (same file)
5. **Task 5** — EmptyState adoption → depends on Task 2 (pages may use PageShell/PageHeader by then)
6. **Task 6** — ESLint rule → depends on Tasks 3-5 to clean existing violations first
7. **Task 7** — DESIGN.md ↔ globals.css audit → independent, can run in parallel
8. **Task 8** — Documentation → last, after all changes land

**Parallelism:** Tasks 1, 6, 7 can run in parallel with other work. Tasks 3+4 must be sequential. Task 2 should complete before Task 5.

---

## Success Metrics

After all tasks:

```bash
# Zero hardcoded touch targets
grep -rn 'min-h-\[44px\]' app/ components/  # 0 results

# Zero raw color strings
grep -rn 'bg-brand\|bg-success\|bg-warning\|bg-destructive' app/ components/ --include='*.tsx' | grep -v 'COLOR_MAP\|global.css\|DESIGN.md'  # only in token definitions

# Zero copy-paste wrappers
grep -rn 'className="p-6 space-y-8' app/   # only in PageShell.tsx

# EmptyState imported
grep -rn 'import.*EmptyState' app/          # 5+ results

# PageShell imported everywhere
grep -rn 'import.*PageShell' app/           # 7+ results

# Lint clean
npm run lint && npm run build && npm test   # all pass
```

---

## Anti-Patterns This Plan Prevents

| Before | After |
|--------|-------|
| `<div className="p-6 space-y-8 max-w-4xl">` on every page | `<PageShell>` |
| `<h1 className="text-2xl font-bold tracking-tight">` copy-paste | `<PageHeader title="..." />` |
| `min-h-[44px] sm:min-h-0 sm:h-9` on every button | `size="touch"` |
| `color="bg-brand-surface text-brand"` — raw strings | `iconColor="brand"` — type-safe |
| Inline divs for empty states | `<EmptyState />` |
| PR reviewer catches hardcoded colors | Lint rule catches them |
| DESIGN.md says `#0D9488`, CSS says `oklch(...)` | Both agree |
| "I don't know which component to use" | `docs/COMPONENTS.md` |
