# Layout Consistency — All Pages

> **For Hermes:** Implement directly task-by-task.

**Goal:** Make every page in the app use a shared layout primitive with consistent sizing, spacing, and surface treatment.

**Architecture:** One primitive (`PageShell`) for dashboard pages, one (`CenteredPage`) for auth/wizard pages, and a new `LandingSection` for the marketing page. Each has typed variants. A guardrail script prevents regressions.

**Root Cause Analysis:**
- The landing page predates PageShell — each section hardcodes `max-w-6xl mx-auto px-6` (or other max-width manually), creating drift
- No guardrail existed to catch new pages bypassing PageShell
- PR #15/#16 aligned all 8 dashboard pages to `PageShell size="wide"` — those are done ✅

**Current State after PR #15/#16:**
| Page | Wrapper | Width | Status |
|------|---------|-------|--------|
| dashboard/ | PageShell | size="wide" + surface="gradient" | ✅ |
| dashboard/bookings | PageShell | size="wide" | ✅ |
| dashboard/crm | PageShell | size="wide" | ✅ |
| dashboard/inbox | PageShell | size="wide" | ✅ |
| dashboard/invoices | PageShell | size="wide" | ✅ |
| dashboard/reminders | PageShell | size="wide" | ✅ |
| dashboard/reports | PageShell | size="wide" | ✅ |
| dashboard/settings | PageShell | size="wide" | ✅ |
| login | CenteredPage | maxWidth="sm" | ⚠️ surface differs from setup |
| setup | CenteredPage | maxWidth="4xl" + surface="muted" | ⚠️ surface differs from login |
| landing (/) | raw HTML | hardcoded in each section | ❌ no wrapper |

---

## Task 1: Create LandingSection component

**Objective:** Extract the repeated `max-w-{width} mx-auto px-6` pattern on the landing page into a shared `LandingSection` component with typed props.

**Files:**
- Create: `components/landing/landing-section.tsx`
- No changes yet — just build the component

**Step 1: Create the component file**

```tsx
// components/landing/landing-section.tsx
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type LandingSectionWidth = "6xl" | "5xl" | "4xl" | "3xl" | "full";
type LandingSectionBg = "default" | "muted" | "card" | "primary" | "transparent";

interface LandingSectionProps {
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
```

**Step 2: Create barrel export**

```tsx
// components/landing/index.ts
export { LandingSection } from "./landing-section";
export type { LandingSectionProps } from "./landing-section";
```

**Step 3: Guard — run build to make sure it compiles**

Run: `cd /home/basem/Projects/nasaq && npm run build 2>&1 | tail -20`
Expected: Build succeeds, no errors.

**Step 4: Test — verify type safety**

Run: `npx tsc --noEmit components/landing/landing-section.tsx`
Expected: Exit code 0, no type errors.

**Step 5: Commit**

```bash
cd /home/basem/Projects/nasaq
git add components/landing/
git commit -m "feat: add LandingSection layout component for marketing page"
```

---

## Task 2: Migrate landing page to LandingSection

**Objective:** Replace every raw section wrapper in `app/page.tsx` with `LandingSection`. Fix inconsistent max-widths — standardize where possible, keep intentional exceptions.

**Files:**
- Modify: `app/page.tsx`

**Mapping (section → LandingSection props):**

| Section | Current pattern | New props |
|---------|----------------|-----------|
| Nav | no section, inline | skip — nav is standalone |
| Hero (#hero) | `max-w-6xl mx-auto px-6 py-20 lg:py-32` | `maxWidth="6xl"` but keep custom py-20 — use `padded={false}` + manual padding class |
| How it works | `max-w-6xl mx-auto px-6 py-24 bg-muted/30 border-y` | `maxWidth="6xl" background="muted"` + `className="border-y border-border/50"` |
| Problem | `max-w-5xl mx-auto px-6 py-24` | `maxWidth="5xl"` |
| Features | `max-w-6xl mx-auto px-6 py-24 bg-card border-y` | `maxWidth="6xl" background="card"` + `className="border-y border-border/50"` |
| Pricing | `max-w-6xl mx-auto px-6 py-24 bg-muted/30` | `maxWidth="6xl" background="muted"` |
| FAQ | `max-w-3xl mx-auto px-6 py-24` | `maxWidth="3xl"` |
| CTA | `max-w-4xl mx-auto px-6 py-24 bg-primary` | `maxWidth="4xl" background="primary"` |
| Footer | `max-w-6xl mx-auto px-6` | `maxWidth="6xl" padded={false}` |

**Pitfall:** The import path `@/components/landing/landing-section` might need barrel export. Use `import { LandingSection } from "@/components/landing"`.

**Step 1: Modify the hero section**

Replace:
```tsx
<section id="hero" className="max-w-6xl mx-auto px-6 py-20 lg:py-32 overflow-hidden">
```
With:
```tsx
<LandingSection id="hero" maxWidth="6xl" padded={false} className="py-20 lg:py-32 overflow-hidden" background="transparent">
```
And close with `</LandingSection>` instead of `</section>`.

**Step 2: Modify "How it works" section**

Replace:
```tsx
<section className="py-24 bg-muted/30 border-y border-border/50">
  <div className="max-w-6xl mx-auto px-6">
```
With:
```tsx
<LandingSection maxWidth="6xl" background="muted" className="border-y border-border/50">
```

And remove the inner `</div>` + change `</section>` to `</LandingSection>`.

**Step 3: Modify "Problem" section**

Replace:
```tsx
<section className="py-24">
  <div className="max-w-5xl mx-auto px-6 text-center space-y-12">
```
With:
```tsx
<LandingSection maxWidth="5xl" className="text-center space-y-12">
```

**Step 4: Modify "Features" section**

Replace:
```tsx
<section className="py-24 bg-card border-y border-border/50">
  <div className="max-w-6xl mx-auto px-6">
```
With:
```tsx
<LandingSection maxWidth="6xl" background="card" className="border-y border-border/50">
```

**Step 5: Modify "Pricing" section**

Replace:
```tsx
<section id="pricing" className="bg-muted/30 py-24">
  <div className="max-w-6xl mx-auto px-6">
```
With:
```tsx
<LandingSection id="pricing" maxWidth="6xl" background="muted">
```

**Step 6: Modify "FAQ" section**

Replace:
```tsx
<section className="py-24 max-w-3xl mx-auto px-6">
```
With:
```tsx
<LandingSection maxWidth="3xl">
```

**Step 7: Modify "CTA" section**

Replace:
```tsx
<section className="py-24 relative overflow-hidden">
  <div className="absolute inset-0 bg-primary z-0"></div>
  <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10 z-0"></div>
  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent"></div>
  <div className="max-w-4xl mx-auto px-6 text-center space-y-8 relative z-10">
```
With:
```tsx
<LandingSection maxWidth="4xl" background="primary" className="relative overflow-hidden" padded={false}>
  <div className="absolute inset-0 bg-primary z-0"></div>
  <div className="absolute inset-0 bg-[url('/bg-pattern.svg')] opacity-10 z-0"></div>
  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent"></div>
  <div className="text-center space-y-8 relative z-10 py-24">
```

**Step 8: Modify "Footer" section**

Replace:
```tsx
<footer className="bg-background border-t border-border/50 pt-16 pb-8">
  <div className="max-w-6xl mx-auto px-6">
```
With:
```tsx
<footer className="bg-background border-t border-border/50 pt-16 pb-8">
  <LandingSection maxWidth="6xl" padded={false}>
```
And close with `</LandingSection>` before `</footer>`.

**Step 9: Add import**

```typescript
import { LandingSection } from "@/components/landing";
```

**Step 10: Verify**

Run: `cd /home/basem/Projects/nasaq && npm run build 2>&1 | tail -20`
Expected: Build succeeds.

**Step 11: Commit**

```bash
git add app/page.tsx components/landing/
git commit -m "refactor: migrate landing page sections to LandingSection component"
```

---

## Task 3: Align CenteredPage surface between login and setup

**Objective:** Make login and setup pages use consistent surface treatment. Login uses "plain", setup uses "muted" — align login to use "muted" for visual harmony (setup flow and login should feel like the same app).

**Files:**
- Modify: `app/login/page.tsx`

**Step 1: Change login page surface**

Find: `<CenteredPage maxWidth="sm">`
Replace: `<CenteredPage maxWidth="sm" surface="muted">`

**Verification:** The login page will have a subtle background tint matching the setup wizard, creating a visual frame around the centered card.

**Step 2: Verify build**

Run: `cd /home/basem/Projects/nasaq && npm run build 2>&1 | tail -10`
Expected: Succeeds.

**Step 3: Commit**

```bash
git add app/login/page.tsx
git commit -m "fix: align login surface with setup page for visual consistency"
```

---

## Task 4: Add layout guardrail to lint script

**Objective:** Prevent new pages from being added without using PageShell (dashboard) or CenteredPage (auth). The guardrail checks page.tsx files for one of the required layout components.

**Files:**
- Modify: `scripts/check-design-tokens.sh` (extend it, or create a new check)

**Step 1: Add layout check to check-design-tokens.sh**

Append to `scripts/check-design-tokens.sh`:

```bash
echo "=== Layout Consistency Check ==="

ERRORS=0

# Check all page.tsx files in app/dashboard/ use PageShell
for f in app/dashboard/*/page.tsx; do
  if [ -f "$f" ]; then
    if ! grep -q 'PageShell' "$f" 2>/dev/null; then
      echo "❌ $f: missing PageShell import/usage"
      ERRORS=$((ERRORS + 1))
    fi
  fi
done

# Check app/dashboard/page.tsx also has PageShell
if [ -f "app/dashboard/page.tsx" ]; then
  if ! grep -q 'PageShell' "app/dashboard/page.tsx" 2>/dev/null; then
    echo "❌ app/dashboard/page.tsx: missing PageShell import/usage"
    ERRORS=$((ERRORS + 1))
  fi
fi

# Check login and setup use CenteredPage
for f in app/login/page.tsx app/setup/page.tsx; do
  if [ -f "$f" ]; then
    if ! grep -q 'CenteredPage' "$f" 2>/dev/null; then
      echo "❌ $f: missing CenteredPage import/usage"
      ERRORS=$((ERRORS + 1))
    fi
  fi
done

echo ""
if [ "$ERRORS" -eq 0 ]; then
  echo "✅ Layout check: $CHECK_NAME — all pages use correct layout wrappers"
else
  echo "❌ Layout check: $CHECK_NAME — $ERRORS page(s) with incorrect layout"
  exit 1
fi
```

**Step 2: Update package.json scripts**

Check if `npm run verify` already includes `check-design-tokens.sh`. If not, add it to the verify script.

Run: `cd /home/basem/Projects/nasaq && cat package.json | grep -A2 '"verify"'`
If it exists, it already runs the design tokens check — the new checks will run automatically.

**Step 3: Run the check to verify**

Run: `cd /home/basem/Projects/nasaq && bash scripts/check-design-tokens.sh 2>&1`
Expected: All ✅, no errors.

**Step 4: Commit**

```bash
git add scripts/check-design-tokens.sh
git commit -m "feat: add layout consistency guardrail to design tokens check"
```

---

## Task 5: Run full quality gate and PR

**Objective:** Ensure everything passes before creating the PR.

**Step 1: Run full quality gate**

```bash
cd /home/basem/Projects/nasaq && npm test && npm run lint && npm run build
```

Expected: All 93+ tests pass, lint clean, build succeeds.

**Step 2: Create branch and PR**

```bash
cd /home/basem/Projects/nasaq
git checkout -b sabi/layout-consistency-v2
git push origin sabi/layout-consistency-v2
gh pr create --title "fix: consistent layout wrappers across all pages" \
  --body "## What

- Created \`LandingSection\` component — shared layout primitive for marketing page
- Migrated all 8 landing page sections from raw HTML to \`LandingSection\`
- Aligned login page surface with setup (\`surface=\"muted\"\`)
- Added layout guardrail to check-design-tokens.sh

## Why

Before this PR, the landing page had no shared layout component — each section hand-coded \`max-w-{width} mx-auto px-6\` with varying max-widths. Login and setup used different surface treatments. The new guardrail prevents future drift.

## Checks

- [x] npm test — 93 tests pass
- [x] npm run lint — clean
- [x] npm run build — succeeds
- [x] Layout guardrail — all pages verified" \
  --label ui
```

**Step 3: Verify the PR description**

Run: `cd /home/basem/Projects/nasaq && gh pr view --json title,body`
Expected: Shows the correct title and description.

---

## Summary

| Before | After |
|--------|-------|
| Landing page: 8 sections with raw `max-w-{w} mx-auto px-6` | Landing page: `LandingSection` component with typed props |
| Login: `CenteredPage maxWidth="sm" surface="plain"` | Login: `CenteredPage maxWidth="sm" surface="muted"` (matches setup) |
| No guardrail for layout drift | `check-design-tokens.sh` verifies all pages use correct wrappers |
