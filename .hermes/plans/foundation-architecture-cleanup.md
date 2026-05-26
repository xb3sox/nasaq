# Nasaq Foundation Architecture Cleanup Plan

> **For Hermes/Jules:** Implement in small bounded slices. Preserve Arabic-first UI and current product behavior. No rewrites for ego. No spaghetti relocation — extract by domain boundaries.

**Goal:** Keep Nasaq clean, structured, and maintainable before adding revenue features.

**Current Evidence**
- `npm run verify` passes: 93 tests, lint, build.
- App is functional but page components are too fat:
  - `app/dashboard/invoices/page.tsx` — 434 lines
  - `app/dashboard/bookings/page.tsx` — 413 lines
  - `app/dashboard/reports/page.tsx` — 347 lines
  - `app/dashboard/crm/page.tsx` — 338 lines
  - `app/dashboard/inbox/page.tsx` — 319 lines
  - `app/dashboard/page.tsx` — 312 lines
- `app/*/page.tsx` files contain UI, filtering, derived metrics, dialogs, PDF generation, and demo-data wiring in same files.
- `lib/setup-store.ts` mixes persisted-ish product setup shape, UI form state, and credential fields. It is not persisted and has no version/default boundaries.
- Demo data is imported directly by many dashboard pages. This is OK for demo mode, but should sit behind feature data adapters before real persistence lands.
- `tsconfig.json` has `allowJs: true` though repo is TypeScript-only app code. Loose foundation.
- RTL is mostly good. Physical left/right hits are mostly Recharts margins and internal shadcn positioning; avoid noisy churn unless actual layout bug.

**Architecture Direction**
- App Router route files should be thin shells.
- Feature code belongs under `features/<domain>/`.
- Shared pure domain types/helpers belong under `lib/<domain>/`.
- Demo data access belongs behind feature-level adapters/selectors, not scattered through pages.
- Browser-only utilities like PDF generation must live outside route page files.
- Setup wizard state must have explicit defaults, versioning, selectors, and no accidental secret persistence.

---

## Phase 1 — Foundation Refactor Slice

### Task 1: Add architecture conventions doc

**Objective:** Make structure explicit so future Jules/Codex agents do not freestyle spaghetti.

**Files:**
- Create: `docs/ARCHITECTURE.md`
- Modify: `AGENTS.md`

**Requirements:**
- Document folder ownership:
  - `app/`: routing only; thin pages/layouts/errors/loading.
  - `features/`: route/domain UI, hooks, view-models.
  - `lib/`: pure domain logic, adapters, config, external integrations.
  - `components/ui/`: generic design-system primitives only.
- Add rule: keep route `page.tsx` files under ~80 LOC unless page is static marketing content.
- Add rule: no direct env access from components.
- Add rule: no direct demo-data imports in route files after migration; use feature adapters/selectors.
- Add rule: Arabic-first + logical Tailwind spacing (`ms/me/ps/pe`, `start/end`) for app code.

### Task 2: Add setup domain boundaries

**Objective:** Stop setup state becoming random client soup.

**Files:**
- Create: `lib/setup/types.ts`
- Create: `lib/setup/defaults.ts`
- Modify: `lib/setup-store.ts`
- Modify/Add tests: `tests/setup-store.test.ts`

**Requirements:**
- Move setup types from `lib/setup-store.ts` to `lib/setup/types.ts`.
- Move initial/default state to `lib/setup/defaults.ts`.
- Keep zustand store API backward-compatible for existing setup steps.
- Add `resetSetup()` action for tests/dev.
- Add `SETUP_STATE_VERSION` constant.
- Do **not** persist API keys/tokens to localStorage in this slice.
- Tests must verify defaults, update actions, complete setup, reset setup, and secret fields remain empty by default.

### Task 3: Extract bookings feature module

**Objective:** Make booking route a composition shell, not 400-line mixed logic.

**Files:**
- Create directory: `features/bookings/`
- Create as needed:
  - `features/bookings/types.ts`
  - `features/bookings/constants.tsx` or `constants.ts`
  - `features/bookings/selectors.ts`
  - `features/bookings/components/NewBookingDialog.tsx`
  - `features/bookings/components/BookingStats.tsx`
  - `features/bookings/components/BookingFilters.tsx`
  - `features/bookings/components/BookingTimeline.tsx`
  - `features/bookings/BookingsPageClient.tsx`
- Modify: `app/dashboard/bookings/page.tsx`
- Add/modify tests as practical.

**Requirements:**
- `app/dashboard/bookings/page.tsx` should only import/render `BookingsPageClient` and metadata/static wrapper if possible.
- Preserve current UI and behavior.
- Keep client boundary in feature client component, not route shell unless required.
- Filtering/stat derivation should be in selectors/helpers, not JSX body.
- No `any`.

### Task 4: Extract invoices feature module

**Objective:** Move invoice PDF/modal/table/filter logic out of route file.

**Files:**
- Create directory: `features/invoices/`
- Create as needed:
  - `features/invoices/types.ts`
  - `features/invoices/selectors.ts`
  - `features/invoices/pdf.ts`
  - `features/invoices/components/InvoiceDetailModal.tsx`
  - `features/invoices/components/InvoiceStats.tsx`
  - `features/invoices/components/InvoiceFilters.tsx`
  - `features/invoices/components/InvoiceTable.tsx`
  - `features/invoices/InvoicesPageClient.tsx`
- Modify: `app/dashboard/invoices/page.tsx`
- Add/modify tests as practical.

**Requirements:**
- `app/dashboard/invoices/page.tsx` should only import/render `InvoicesPageClient`.
- PDF generation lives in `features/invoices/pdf.ts`.
- `generateZatcaPDF` must restore hidden buttons in `finally`, not duplicate restore logic.
- Replace `console.error` in PDF flow with user-facing toast failure or controlled return value.
- Preserve current UI and behavior.
- No `any`.

### Task 5: Tighten TypeScript app config

**Objective:** Remove loose compiler defaults if safe.

**Files:**
- Modify: `tsconfig.json`

**Requirements:**
- Set `allowJs` to `false` if `npm run verify` passes.
- Do not introduce config churn beyond this.

### Task 6: Verification

Run:
```bash
npm run verify
git diff --check
```

Expected:
- tests pass
- lint pass
- build pass
- no whitespace errors
- no visual/product copy regressions

---

## Later Slices — Do Not Implement In Phase 1

1. Extract reports/reminders/CRM/inbox to feature modules.
2. Add real data adapter interfaces for dashboard domains.
3. Replace direct demo-data route imports with adapter contracts.
4. Add component/integration tests for dashboard feature selectors.
5. Introduce route-level loading/error conventions per feature.
6. Add bundle/perf budget checks if routes keep growing.
