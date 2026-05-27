# Nasaq — Complete Repo Audit & Foundation Plan

> **Audit Date:** 2026-05-26
> **Auditor:** Sabi (Hermes Agent)
> **Scope:** Full codebase audit — security, quality, accessibility, performance, architecture, RTL compliance, test coverage, DX

---

## Executive Summary

Nasaq is a **solid MVP** with good architecture patterns (store adapter, provider-swappable AI, proper env handling). The codebase is clean: 0 vulnerabilities, strict TypeScript (zero `any`), lint clean, build clean, 88 tests passing.

**But the foundation has cracks.** Hardcoded demo credentials in production code, a landing page that's unreachable due to a redirect, zero accessibility attributes, and 200 kB invoice page bloating the bundle. These aren't edge cases — they're the first things a paying clinic or auditor will hit.

Fix the foundation before adding features. This plan is ordered: security → routing → accessibility → performance → quality → polish.

---

## Audit Results

### Codebase Metrics
| Metric | Value | Status |
|---|---|---|
| Total files | 147 (86 source) | — |
| Lines of code | 8,672 (64.1% code, 8.8% comments) | Good ratio |
| TSX files | 42 | — |
| TypeScript files | 47 | — |
| SQL migrations | 5 | — |
| `any` types | 0 | ✅ Excellent |
| npm vulnerabilities | 0 | ✅ Clean |
| Tests | 88/88 passing | ✅ |
| Lint | Clean | ✅ |
| Build | Clean | ✅ |
| Lib test coverage | 86.5% | ✅ |
| Component test coverage | 0% | ❌ |
| Aria attributes | 0 | ❌ Critical |

### Tech Stack
- Next.js 15.5.18, React 19.2.4, TypeScript 5
- Tailwind 4, shadcn/ui, Noto Sans Arabic
- NextAuth v5 (beta.25), Supabase JS 2.106
- Recharts 3.8, Zod 4.4, Zustand 5.0
- Node test runner (no framework)

---

## Issues Found (Priority Ordered)

### P0 — Critical (Fix Now)

**P0-1: Hardcoded Demo Credentials in Production**
- **File:** `auth.ts:27`
- **Issue:** `email === "owner@clinic.com" && password === "demo1234"` is baked into the auth provider. Anyone who reads the repo source knows the login.
- **Impact:** Security risk, unprofessional, blocks real auth implementation.
- **Fix:** Move demo credentials to env vars with a `DEMO_MODE` guard, or implement Supabase auth.

**P0-2: Landing Page Unreachable**
- **File:** `next.config.ts:7-12`
- **Issue:** `Source: "/" → Destination: "/dashboard"` redirect. The landing/marketing page at `app/page.tsx` (with features, pricing, FAQ) is never served. Visitors hitting the root get redirected to a login wall.
- **Impact:** Zero conversion funnel. No public-facing page for prospects.
- **Fix:** Remove the redirect. Let `/` serve the landing page. Add auth guard only for `/dashboard`.

**P0-3: Zero Accessibility (WCAG)**
- **Scope:** All 30 client components, 0 `aria-*` or `role` attributes found.
- **Impact:** Fails WCAG AA entirely. Screen readers get nothing. Forms, dialogs, tables, nav — all invisible to assistive tech.
- **Fix:** Add `aria-label`, `role`, `aria-describedby`, `aria-expanded` to interactive elements. Priority: sidebar nav, forms, dialogs, tables, tabs.

**P0-4: Physical CSS Properties Breaking RTL**
- **Files:**
  - `components/ui/alert.tsx` — `text-left`, `pr-18`
  - `components/ui/select.tsx` — `text-left`
  - `app/dashboard/invoices/page.tsx` — `text-right`, `text-left` on table headers/cells
  - `app/dashboard/reports/page.tsx` — Recharts `margin={{ top: 10, right: 10, left: -20, bottom: 0 }}`
  - `app/dashboard/reminders/page.tsx` — same Recharts margin issue
- **Impact:** Charts render wrong in RTL. Table alignment is inconsistent. Alert icon positioning breaks.
- **Fix:** Replace `text-left` → `text-start`, `text-right` → `text-end`, `pr-18` → `pe-18`. For Recharts, use `margin` with logical considerations or inline RTL detection.

### P1 — High

**P1-1: Invoice Page 200 kB Bundle Bloat**
- **File:** `app/dashboard/invoices/page.tsx` (429 lines)
- **Issue:** `html2canvas` + `jsPDF` imported at top level. First Load JS: 200 kB (vs avg 6-14 kB for other pages).
- **Impact:** Every dashboard visit loads PDF generation libraries even if user never exports a PDF.
- **Fix:** Dynamic import: `const html2canvas = (await import('html2canvas')).default` inside the export handler.

**P1-2: Zero Component Test Coverage**
- **Coverage:** `components/` = 0%, `app/` = 0%, `lib/setup-store.ts` = 0%, `lib/supabase.ts` = 0%, `pwa-registry.tsx` = 0%
- **Impact:** UI regressions slip through. 88 tests all test lib functions — none test actual user-facing components.
- **Fix:** Add component tests for critical paths: Sidebar, LoginForm, Setup wizard steps. Use Node test runner or add Vitest/Playwright.

**P1-3: No Root Error Boundary**
- **Files:** `app/dashboard/error.tsx` exists, but `app/error.tsx` does not.
- **Impact:** Errors in `/setup`, `/login`, `/` (landing) crash the entire app with no recovery UI.
- **Fix:** Create `app/error.tsx` and `app/global-error.tsx`.

**P1-4: No API Rate Limiting**
- **Files:** All API routes (`/api/messages/send`, `/api/bookings`, `/api/ai/suggest-reply`)
- **Impact:** Unlimited requests. WhatsApp API costs can explode. AI provider costs unbounded.
- **Fix:** Add basic rate limiting middleware or per-route guards. Use `@upstash/ratelimit` or simple in-memory sliding window for MVP.

**P1-5: SPEC.md Stale**
- **File:** `SPEC.md`
- **Issues:** Says "48 tests" (actually 88). Architecture section lists old file structure. Missing onboarding wizard, n8n workflows, reports/reminders/invoices pages.
- **Fix:** Update to reflect current state.

**P1-6: Supabase Client Throws on Missing Env**
- **File:** `lib/supabase.ts:10-13`
- **Issue:** `getSupabaseClient()` throws `Error` if env vars missing. This breaks any component that imports `supabase` directly in demo mode.
- **Fix:** Return a mock/no-op client or null when env vars are absent. The `supabase` proxy already handles this partially but the lazy singleton throws first.

### P2 — Medium

**P2-1: No CHANGELOG**
- Commits reference v1.1, v1.2, v1.3, v1.5 but no CHANGELOG.md exists.
- **Fix:** Create CHANGELOG.md from git history.

**P2-2: Shadcn Components Use Physical Properties**
- Several shadcn/ui components (`alert`, `select`, `dropdown-menu`, `sheet`, `radio-group`) were auto-generated and contain `text-left`, `pr-*` etc.
- **Fix:** Audit and fix all shadcn components for RTL compliance.

**P2-3: Setup Wizard Not Protected**
- `/setup` route is accessible without auth. Clinic setup should require owner authentication.
- **Fix:** Add auth guard to `/setup` or integrate setup into dashboard.

**P2-4: Demo Data Hardcoded to Dental Clinic**
- **File:** `lib/demo-data.ts`
- All doctors, services, customers are dental-specific.
- **Impact:** Harder to demo to non-dental clinics.
- **Fix:** Make demo data configurable or add a second clinic profile.

**P2-5: No PWA Implementation**
- **File:** `components/pwa-registry.tsx` exists (0% coverage, 17 lines)
- No `manifest.json`, no service worker registration.
- **Fix:** Either implement PWA properly or remove the placeholder.

**P2-6: n8n Workflows Directory Stale**
- `n8n/workflows/` directory exists but is empty. `n8n/import-ready/` also empty.
- Only `reminders-sender.json` has content.
- **Fix:** Remove empty directories or populate them.

---

## Implementation Plan

> **Principle:** Fix foundation before features. Each phase is independently deployable. Verify `npm test && npm run lint && npm run build` after each phase.

### Phase 1: Security & Routing (P0-1, P0-2)

**Goal:** Remove hardcoded credentials, fix landing page routing.

**Task 1.1: Extract demo credentials to env**
- Modify: `auth.ts`
- Add `DEMO_EMAIL` and `DEMO_PASSWORD` to `.env.example`
- Default to env values, fallback to safe empty (no default credentials)
- Add comment: "For production, replace with Supabase auth"

**Task 1.2: Fix root routing**
- Modify: `next.config.ts` — remove the `/` → `/dashboard` redirect
- Verify: `/` serves landing page, `/dashboard` requires auth (already handled by middleware)
- Verify: Logged-in users visiting `/` still redirect to `/dashboard` (add to middleware or `app/page.tsx`)

**Task 1.3: Verify**
- Run: `npm test && npm run lint && npm run build`
- Smoke: `curl -s http://localhost:3001/ | head -20` should show landing HTML
- Smoke: `curl -s -I http://localhost:3001/dashboard` should show 302 to /login

---

### Phase 2: Accessibility Foundation (P0-3)

**Goal:** Add baseline WCAG AA compliance to all interactive components.

**Task 2.1: Sidebar navigation**
- Modify: `components/layout/Sidebar.tsx`
- Add `role="navigation"` and `aria-label="القائمة الرئيسية"` to nav element
- Add `aria-current="page"` to active link
- Add `aria-label` to all nav links

**Task 2.2: Forms and inputs**
- Modify: `app/login/login-form.tsx`, `app/setup/steps/*.tsx`
- Add `aria-label` or associate `<label>` with `htmlFor` on all inputs
- Add `aria-invalid` and `aria-describedby` for form errors
- Add `role="alert"` to error messages

**Task 2.3: Dialogs and modals**
- Modify: `components/ui/dialog.tsx`, `app/dashboard/invoices/page.tsx` (ZATCA modal)
- Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby` to dialog containers
- Ensure focus trap on open

**Task 2.4: Tables**
- Modify: `app/dashboard/invoices/page.tsx`, `app/dashboard/crm/page.tsx`
- Add `role="table"`, `aria-label` to table containers
- Add `scope="col"` to header cells
- Add `aria-sort` to sortable columns

**Task 2.5: Tabs**
- Modify: `app/dashboard/settings/page.tsx`, any page using Tabs
- Add `role="tablist"`, `role="tab"`, `role="tabpanel"`
- Add `aria-selected`, `aria-controls`, `id` associations

**Task 2.6: Verify**
- Run: `npm test && npm run lint && npm run build`
- Manual: Run Lighthouse accessibility audit on key pages

---

### Phase 3: RTL Polish (P0-4, P2-2)

**Goal:** Eliminate all physical CSS properties, fix Recharts RTL rendering.

**Task 3.1: Fix shadcn components**
- Modify: `components/ui/alert.tsx` — `text-left` → `text-start`, `pr-18` → `pe-18`
- Modify: `components/ui/select.tsx` — `text-left` → `text-start`
- Scan all `components/ui/*.tsx` for `left`, `right`, `ml-`, `mr-`, `pl-`, `pr-`, `text-left`, `text-right`

**Task 3.2: Fix dashboard pages**
- Modify: `app/dashboard/invoices/page.tsx` — all `text-right`/`text-left` → `text-end`/`text-start`
- Modify: `app/dashboard/crm/page.tsx` — `rtl:text-right` → remove (already RTL, `text-end` is default)
- Modify: `app/login/login-form.tsx` — `text-right` in credential display → `text-end`

**Task 3.3: Fix Recharts RTL**
- Modify: `app/dashboard/reports/page.tsx`, `app/dashboard/reminders/page.tsx`
- Replace `margin={{ top: 10, right: 10, left: -20, bottom: 0 }}` with dynamic margin based on `dir="rtl"`:
  ```ts
  const chartMargin = { top: 10, start: 10, end: -20, bottom: 0 };
  // Recharts uses physical left/right — detect RTL and swap:
  const isRtl = true; // or use document.dir
  const margin = { top: 10, right: isRtl ? -20 : 10, left: isRtl ? 10 : -20, bottom: 0 };
  ```
- Or better: use `margin={{ top: 10, right: 10, left: 20, bottom: 0 }}` and adjust the chart container padding instead.

**Task 3.4: Verify**
- Run: `npm test && npm run lint && npm run build`
- Manual: Check all pages in Chrome with `dir="rtl"` — no visual regressions

---

### Phase 4: Performance (P1-1)

**Goal:** Reduce invoice page bundle from 200 kB to under 50 kB.

**Task 4.1: Lazy-load PDF export dependencies**
- Modify: `app/dashboard/invoices/page.tsx`
- Replace top-level imports:
  ```ts
  // Remove: import html2canvas from 'html2canvas';
  // Remove: import { jsPDF } from 'jspdf';
  // Add inside export function:
  const [html2canvas, jsPDF] = await Promise.all([
    import('html2canvas').then(m => m.default),
    import('jspdf').then(m => m.jsPDF),
  ]);
  ```
- Convert the export handler to async

**Task 4.2: Verify**
- Run: `npm run build`
- Check: `/dashboard/invoices` first-load JS should drop from 200 kB to ~14 kB
- Verify: PDF export still works after lazy load

---

### Phase 5: Quality & DX (P1-2, P1-3, P1-5, P1-6, P2-1, P2-6)

**Goal:** Improve test coverage, error handling, documentation.

**Task 5.1: Add root error boundary**
- Create: `app/error.tsx` — reuse dashboard error UI pattern
- Create: `app/global-error.tsx` — for root layout errors

**Task 5.2: Add component tests**
- Create: `tests/sidebar.test.ts` — Sidebar renders, active state, mobile drawer
- Create: `tests/login-form.test.ts` — Form validation, submission
- Create: `tests/setup-store.test.ts` — Zustand store CRUD

**Task 5.3: Fix Supabase client demo mode**
- Modify: `lib/supabase.ts` — return mock client or null when env vars absent
- Verify: App boots without Supabase env vars (demo mode)

**Task 5.4: Update SPEC.md**
- Modify: `SPEC.md` — update test count (88), add new pages, update architecture diagram

**Task 5.5: Create CHANGELOG.md**
- Create: `CHANGELOG.md` from git history (v1.0 through current)

**Task 5.6: Clean up stale directories**
- Remove: `n8n/workflows/` (empty), `n8n/import-ready/` (empty) — or document their purpose

**Task 5.7: Verify**
- Run: `npm test && npm run lint && npm run build`
- Target: 90+ tests passing

---

### Phase 6: Future (P1-4, P2-3, P2-4, P2-5) — Separate PR

These are important but not blocking. Schedule after foundation is solid:

- **P1-4:** API rate limiting (requires infra decision — Upstash, Vercel KV, or custom)
- **P2-3:** Setup wizard auth guard (requires auth flow design)
- **P2-4:** Multi-clinic demo data (requires data model change)
- **P2-5:** PWA implementation (requires manifest.json, service worker, icon assets)

---

## Verification Checklist

After each phase:
- [ ] `npm test` — all tests pass
- [ ] `npm run lint` — zero warnings
- [ ] `npm run build` — zero errors
- [ ] `npm audit --omit=dev` — zero vulnerabilities
- [ ] Manual smoke test of affected pages
- [ ] Commit with conventional commit message

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| RTL regressions from CSS changes | Medium | High | Visual testing after each phase |
| Breaking demo mode with Supabase changes | Low | Medium | Test without env vars before merge |
| Lazy load breaks PDF export | Low | Low | Test export flow manually |
| Auth changes break login | Medium | High | Test login flow after P0-1 |

---

## Order of Execution

1. **Phase 1** (Security & Routing) — 3 tasks, ~15 min
2. **Phase 2** (Accessibility) — 5 tasks, ~30 min
3. **Phase 3** (RTL Polish) — 4 tasks, ~20 min
4. **Phase 4** (Performance) — 2 tasks, ~10 min
5. **Phase 5** (Quality & DX) — 7 tasks, ~40 min

**Total:** ~2 hours of focused work. Each phase is independently mergeable.
