# Design Consistency V3 — Colors, Fonts, Spacing, Responsiveness

> **For Hermes:** Root-cause first. Use Jules only for bounded, disjoint file migrations. Pull sequentially, verify hard, then merge.

**Goal:** Finish the remaining UI consistency pass across Nasaq: colors, typography, spacing, touch targets, RTL-safe layout, and mobile responsiveness.

**Architecture:** Keep the current design-system foundation: CSS tokens in `app/globals.css`, typed primitives in `components/ui/*`, `PageShell` for dashboard, `CenteredPage` for auth/setup, `LandingSection` for marketing. This pass does not invent a second design system. It removes remaining drift and strengthens guardrails so drift fails CI.

**Tech Stack:** Next.js 15.5, React 19, Tailwind 4, shadcn/base-ui, RTL Arabic UI, Node test runner.

**Root Cause Analysis:**
- Prior passes fixed layout wrappers and many hardcoded tokens, but residual drift remains in page-level details: ad-hoc widths, one-off gradients, inline Badge classes, inconsistent heading tracking, scattered mobile touch overrides.
- Several values are legitimate component internals (`Button size="touch"`, `PageShell height="viewport"`), but page files still carry raw `min-h-[40px]`, `w-[140px]`, `text-teal-400`, and custom Badge color classes.
- Fixing instances alone is not enough. The end state must include better guardrails in `scripts/check-design-tokens.sh` for colors, badges, headings, touch targets, and page-level physical spacing.

---

## Audit Snapshot — 2026-05-27

Counts from current `main` after PR #17:

- Raw Tailwind color classes: 2
  - `app/page.tsx` uses `to-teal-400` in hero gradients.
- Hex colors outside token foundation: 1
  - `app/layout.tsx` metadata `themeColor` uses `#0B7D72` intentionally but should be documented/guarded.
- Physical spacing / physical direction candidates: 3
  - Mostly shared Base UI internals; audit before changing because some transform utilities are not RTL spacing bugs.
- Inline styles: 3
  - progress width, reminder left-border color, Sonner CSS variables.
- Arbitrary widths/heights in app/components: 51
  - Many are legitimate component internals; page-level touch/width drift should be reduced.
- Heading typography drift: 7
  - `text-2xl font-bold` without `tracking-tight` in landing pricing, reports metrics, login title, StatCard value.
- Raw Badge inline classes: 4
  - count chips/status-like chips need either `Badge` variant cleanup or `StatusBadge` when semantic.

---

## Task 1 — Foundation Guardrail Upgrade (local)

**Objective:** Make future drift fail CI without blocking legitimate component internals.

**Files:**
- Modify: `scripts/check-design-tokens.sh`
- Optional modify: `app/globals.css` if missing semantic token alias is needed.

**Steps:**
1. Add page-level checks for raw Tailwind color classes in `app/**/*.tsx` and `components/**/*.tsx`, keeping current WhatsApp/global token exemptions.
2. Add a check for `<Badge className=` in `app/dashboard/**/page.tsx`; allow only documented count badges if class is token-neutral.
3. Add a heading consistency check for dashboard page headings: `text-2xl font-bold` and `text-3xl font-bold` should include `tracking-tight`, except numeric metric values inside `StatCard` or chart cards if explicitly allowed.
4. Add page-level touch-target drift check: flag `min-h-[36px]`, `min-h-[40px]`, `min-h-[44px]` in page files unless line contains an exemption comment.
5. Run `npm run check-tokens` and calibrate false positives.
6. Commit.

**Verification:**
- `npm run check-tokens`
- `npm run verify`

---

## Task 2 — Marketing Landing Polish (Jules Session A)

**Objective:** Remove remaining landing color/typography inconsistencies and improve responsive polish without touching dashboard pages.

**Files:**
- Touch only: `app/page.tsx`
- Optional: `components/landing/landing-section.tsx` only if a typed prop is needed for repeated landing section behavior.

**Required fixes:**
- Replace `to-teal-400` gradient usage with existing semantic token classes (`to-brand`, `from-primary`, `to-primary`, or token-safe equivalents).
- Add `tracking-tight` to the landing pricing card `h3` if visually appropriate.
- Audit mobile layout spacing in hero, pricing cards, CTA, and FAQ. Prefer shared props/consistent Tailwind token classes over arbitrary one-offs.
- Do not change Arabic copy except where line wrapping is accidentally damaged.

**Verification:**
- `npm run lint`
- `npm run build`
- `npm run check-tokens`

---

## Task 3 — Dashboard Controls + Tables Responsiveness (Jules Session B)

**Objective:** Normalize controls, filter rows, tables, and touch targets in booking/invoice/CRM pages.

**Files:**
- Touch only:
  - `app/dashboard/bookings/page.tsx`
  - `app/dashboard/invoices/page.tsx`
  - `app/dashboard/crm/page.tsx`

**Required fixes:**
- Replace page-level `min-h-[40px]` / `min-h-[36px]` button hacks with `Button size="touch"` where the element is a real touch control.
- Normalize `SelectTrigger` usage: use `size="touch"` for mobile-friendly filters; avoid raw `h-9` unless there is a documented reason.
- Audit hardcoded widths like `w-[140px]`, `w-[150px]`, `min-w-[180px]` and make them responsive/token-consistent where safe.
- Preserve table/kanban usability. Do not force data-dense tables into cramped mobile layouts.

**Verification:**
- `npm run lint`
- `npm run build`
- `npm run check-tokens`

---

## Task 4 — Inbox + Reminders Responsiveness / Semantic Styling (Jules Session C)

**Objective:** Clean the remaining chat/reminder responsive rough edges without breaking the custom chat layout.

**Files:**
- Touch only:
  - `app/dashboard/inbox/page.tsx`
  - `app/dashboard/reminders/page.tsx`

**Required fixes:**
- Replace real Button touch-target hacks with `size="touch"` / `size="touch-icon"` where applicable.
- Keep documented custom chat container exemptions; do not replace chat bubble sizing blindly.
- Replace reminder border inline style if a semantic token/class approach can preserve the per-status visual. If not, document an exemption comment in code and guardrail.
- Normalize raw Badge classes to neutral Badge or StatusBadge where semantic.

**Verification:**
- `npm run lint`
- `npm run build`
- `npm run check-tokens`

---

## Task 5 — Shared Primitives + Error/Loading States (Jules Session D)

**Objective:** Make small shared-state pages and primitives consistent without changing page features.

**Files:**
- Touch only:
  - `app/error.tsx`
  - `app/dashboard/error.tsx`
  - `app/dashboard/loading.tsx`
  - `app/login/page.tsx`
  - `components/ui/stat-card.tsx`
  - `components/ui/empty-state.tsx`
  - `components/ui/badge.tsx`
  - `components/ui/status-badge.tsx`

**Required fixes:**
- Audit error/loading pages for consistent centered layout, typography, spacing, and RTL-safe structure.
- Add/confirm `tracking-tight` where headings need it.
- Keep numeric StatCard values readable; if adding `tracking-tight`, verify no visual regression.
- If Badge needs a neutral/count variant to remove page-level `className="bg-muted"` hacks, add typed variant support rather than page hacks.
- Do not touch `button.tsx`, `select.tsx`, package files, auth, or routes.

**Verification:**
- `npm run lint`
- `npm run build`
- `npm run check-tokens`

---

## Integration Order

1. Push `sabi/design-consistency-v3`.
2. Dispatch Jules Sessions A–D in parallel against `sabi/design-consistency-v3`.
3. Pull sessions sequentially:
   - D first if it adds shared Badge/StatusBadge variants.
   - A next (isolated landing).
   - B then C (dashboard pages).
4. After each pull:
   - `git diff --stat`
   - `git diff --check`
   - remove stray Jules files.
   - commit that session separately.
5. Add/local-calibrate guardrails last.
6. Run full gate:
   - `npm run verify`
7. Open PR.
8. Merge only after GitHub CI and Vercel preview are green.
9. Verify production deploy and live app HTTP 200.

---

## Final Acceptance Criteria

- `npm run verify` passes.
- No raw non-semantic Tailwind color classes in page/component code, except documented/token-safe exemptions.
- No dashboard page-level raw touch-target hacks unless explicitly exempted.
- Badge usage is either semantic `StatusBadge` or neutral/count `Badge` variant without ad-hoc color classes.
- Headings use consistent `tracking-tight` where they are headings, not numeric metric values unless visually appropriate.
- Mobile controls remain tappable and data-heavy views remain usable.
- Guardrails catch the same categories in CI.
