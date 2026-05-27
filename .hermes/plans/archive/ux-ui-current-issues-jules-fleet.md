# Nasaq UX/UI Current-Issues Jules Fleet Plan

**Goal:** Audit and fix current UX/UI problems across the app without creating overlapping spaghetti or breaking the clean-foundation work.

**Source standards used:**
- UI/UX Pro Max: accessibility, touch targets, responsive layout, forms, charts, navigation, typography/color.
- Frontend Design: intentional healthcare SaaS aesthetic; polished, restrained, not generic AI slop.
- Vercel Web Interface Guidelines: labels, aria, focus states, semantic controls, URL state, Intl formatting, reduced motion, no `transition-all`.
- Dogfood QA: test actual flows, console, visual issues, responsive risks.

**Design direction:** Arabic-first healthcare SaaS. Trustworthy, accessible, calm teal/green system, Noto Sans Arabic, strong hierarchy, WCAG AA+, no neon, no decorative motion, no emoji icons.

**Current known risk areas:**
- Fat route pages mixing view logic and UI.
- Many client pages with direct demo data wiring.
- Forms need stronger labels, helper text, autocomplete/inputmode, saving/error feedback.
- Icon-only/compact actions may need accessible names.
- Filters/tabs use local state but URLs do not preserve user state.
- Charts need better screen-reader summaries/table fallback and mobile simplification.
- Touch target consistency on dense dashboard controls.
- Long Arabic text needs `min-w-0`, wrapping/truncation discipline.

---

## Workstream 1 — Global shell, landing, setup, login

**Files:**
- `app/page.tsx`
- `app/login/**`
- `app/setup/**`
- `app/layout.tsx`
- `app/globals.css`
- `components/layout/Sidebar.tsx`
- shared UI primitives only if needed for fixes

**Focus:**
- Landing visual hierarchy, CTA clarity, mobile layout.
- Setup wizard form UX: labels, helper text, autocomplete, inputmode, skip/back clarity, unsaved state warnings if practical.
- Login form accessibility and error/saving states.
- Sidebar nav labels, active state, keyboard/focus, mobile drawer behavior.
- Skip link/main landmark/focus visibility if missing.

## Workstream 2 — Dashboard overview, inbox, CRM

**Files:**
- `app/dashboard/page.tsx`
- `app/dashboard/inbox/page.tsx`
- `app/dashboard/crm/page.tsx`
- feature/shared helpers directly needed for these pages

**Focus:**
- Dashboard overview clarity, stat hierarchy, live demo feedback.
- Inbox: message list readability, empty/loading/error states, accessible send controls, long-message handling.
- CRM: Kanban/card density, state badges not color-only, touch targets, mobile responsiveness.
- URL state for filters/tabs where low-risk.

## Workstream 3 — Bookings + invoices

**Files:**
- `app/dashboard/bookings/page.tsx`
- `app/dashboard/invoices/page.tsx`
- `features/bookings/**` if foundation refactor exists in Jules context
- `features/invoices/**` if foundation refactor exists in Jules context
- invoice/booking tests if needed

**Focus:**
- Booking dialog form UX: names, autocomplete/inputmode, validation hints, loading/success/error feedback.
- Booking filters/timeline: accessible controls, no hover-only actions, mobile density.
- Invoice table/actions/modal/PDF: aria labels, keyboard, toast feedback, long text, ZATCA QR fallback, currency via `Intl.NumberFormat`.
- Avoid conflict with foundation refactor by preserving route behavior and keeping changes scoped.

## Workstream 4 — Reports, reminders, settings

**Files:**
- `app/dashboard/reports/page.tsx`
- `app/dashboard/reminders/page.tsx`
- `app/dashboard/settings/page.tsx`
- chart wrappers/helpers if needed

**Focus:**
- Charts: aria summaries, table fallback or text insights, better mobile behavior, color-not-only semantics.
- Reports: metric cards, filters, export affordance, number/currency formatting via Intl.
- Reminders: due/failed states, retry UX, timeline readability, empty/error states.
- Settings: form grouping, labels/helper text, save feedback, dangerous actions separation.

---

## Guardrails for every Jules session

- Start from `main`.
- Audit first, then fix only within assigned files.
- Preserve Arabic copy unless fixing clarity/accessibility.
- Use CSS logical utilities (`start/end`, `ms/me`, `ps/pe`) for app code.
- No raw hex in components unless existing design token cannot support it.
- No `any`.
- No package dependency changes unless absolutely necessary and justified.
- No auth/Supabase/migration/CI/env changes.
- Do not edit unrelated workstream files.
- Run `npm run verify` and `git diff --check`.

## Merge order

1. Pull/apply WS1 first: global UX can affect all pages.
2. Pull/apply WS2.
3. Pull/apply WS4.
4. Pull/apply WS3 last because foundation-refactor session may also touch bookings/invoices.

If conflicts happen: prefer smaller accessibility/UX fixes over broad rewrites. Routes must remain working. Tests/build win arguments.
