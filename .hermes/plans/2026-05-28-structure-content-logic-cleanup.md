# Nasaq Structure, Content, and Logic Cleanup Plan

> **For Hermes:** This is cleanup work only. No new product features. No visual redesign. No production behavior changes unless a test proves existing behavior.

**Goal:** Reduce repo complexity after the recent docs/design work: remove duplicate/stale files, thin route files, centralize content, clarify business-logic boundaries, and add guardrails so the mess does not grow back.

**Architecture:** Keep Next.js routes as shells. Move domain UI/state/view-models into `features/*`. Keep pure business logic in `lib/*`. Keep Arabic user-facing content in typed content/config modules instead of scattered JSX strings when reused or structurally important.

**Current evidence from source audit:**
- Tests pass: `93/93`.
- `features/` does not exist, although `AGENTS.md` and `docs/ARCHITECTURE.md` declare it as target architecture.
- Route files violate the documented thin-route rule:
  - `app/page.tsx` — 641 LOC, 96 Arabic strings.
  - `app/dashboard/invoices/page.tsx` — 441 LOC, 6 `useState`, 18 inline handlers.
  - `app/dashboard/bookings/page.tsx` — 410 LOC, 8 `useState`.
  - `app/dashboard/crm/page.tsx` — 353 LOC.
  - `app/dashboard/inbox/page.tsx` — 345 LOC, 11 `useState`.
  - `app/dashboard/reminders/page.tsx` — 314 LOC.
  - `app/dashboard/reports/page.tsx` — 304 LOC, 68 Arabic strings.
  - `app/dashboard/page.tsx` — 297 LOC, still imports `demo-clinic` legacy data.
- `.hermes/plans/` has duplicated files at top-level and `archive/`, despite the index saying completed plans are archived.
- New root `.jules/` directory exists (`.jules/bolt.md`, `.jules/palette.md`) while repo convention is `.hermes/jules/` or `.hermes/plans/`.
- Demo data is split between `lib/demo-data.ts` and legacy `lib/demo-clinic.ts`; app routes import both.
- `SPEC.md` still says `tests/ # 88 passing` in the file map while review results say `93/93`.
- `SPEC.md` still contains task queue/history content that now overlaps with README roadmap and CHANGELOG.
- `docs/DOCS.md` says `docs/COMPONENTS.md` max 180, while current `docs/COMPONENTS.md` is 240 and `check-docs.sh` allowlists it to 280. Docs disagree.

---

## Non-goals

- No new modules from roadmap: no real WhatsApp setup, no real AI rollout, no Supabase live rollout, no new onboarding features.
- No design overhaul.
- No dependency upgrades.
- No auth/security behavior changes except tests around extracted logic.
- No database migration unless required to preserve existing behavior — currently not required.

---

## Best-practice rules before implementation

These rules are mandatory for every phase. If a task conflicts with them, stop and fix the plan first.

### Next.js App Router boundaries

Source-checked against current Next.js App Router docs via Context7 (`/vercel/next.js`):

- `app/**/page.tsx` files should default to Server Components and stay as thin route shells.
- Add `"use client"` only to the smallest component/hook that needs React state, effects, event handlers, browser APIs, `toast`, dialogs, charts, drag/drop, or PDF/export behavior.
- Server Components may read demo/domain data, build view models, and pass plain serializable props into Client Components.
- Client Components should not import large demo datasets unless the interaction truly needs local mutation.
- Route files depend inward on `features/*`; `features/*` must never import from `app/*`.
- `lib/*` must stay UI/framework-free: no imports from `@/components`, `@/features`, `react`, or `next/*` unless explicitly allowlisted for a server integration module.

### Content/config boundaries

- Content modules should be plain serializable config where practical: ids, slugs, strings, numbers, status keys.
- Do not put Lucide/React components into `content.ts`; use icon keys in content and map them to components in render code.
- Extract repeated/structured Arabic content arrays, status maps, pricing, FAQ, and field configs.
- Keep one-off headings close to JSX if extracting them makes the code less readable.

### Safety and verification

- Start every implementation PR from a clean tree and named branch.
- Before destructive deletes/moves, prove files are identical or intentionally superseded.
- Use `git mv` / `git rm` for tracked moves/deletes.
- Use narrow staging. Avoid broad `git add app`, `git add lib`, `git add tests`, or `git add components/ui` unless `git diff --name-only` proves only intended files changed.
- Before every commit:
  ```bash
  git diff --stat
  git diff --check
  git status --short
  ```
- After every TypeScript/React extraction:
  ```bash
  npm test
  npm run lint
  npm run build
  ```
- After docs-only tasks:
  ```bash
  npm run check-docs
  ```
- After architecture-script tasks:
  ```bash
  npm run check-architecture
  npm run verify
  ```

### Guardrail ratchet

`check-architecture.sh` starts permissive only for current known debt. It must fail on:

- any new route page over target LOC,
- any existing fat route growing above baseline,
- any extracted route regressing above target LOC,
- `app/**/page.tsx` containing `"use client"` after extraction unless allowlisted,
- `features/**` importing `app/**`,
- `lib/**` importing UI/framework/client-only modules,
- root `.jules/`,
- duplicate plan files in `.hermes/plans/*.md` and `.hermes/plans/archive/*.md`,
- new `@/lib/demo-clinic` imports outside the temporary compatibility shim/test.

### Review gate before implementation

This plan was reviewed by two independent agents:

- Architecture review: aligned with repo architecture, but required stronger Server/Client Component rules, plain content modules, and dependency-boundary guardrails.
- Execution review: required preflight safety, hash checks before deletions, narrower staging, per-task verification, and splitting oversized refactors.

The edits below incorporate those findings.

---

## Phase -1 — Preflight safety

### Task -1.1: Confirm branch, clean tree, and baseline quality

**Objective:** Start from known-good state before touching structure.

**Commands:**
```bash
git status --short
git branch --show-current
npm test
npm run lint
npm run build
npm run check-tokens
npm run check-docs
```

**Expected:**
- `git status --short` is empty.
- Branch is an implementation branch, not `main`.
- Quality baseline is green before refactor work starts.

**Stop if:**
- unrelated local changes exist,
- baseline fails for reasons unrelated to the planned task,
- branch is `main`.

## Phase 0 — Repo hygiene first

### Task 0.1: Remove duplicate plan files from hot path

**Objective:** Make `.hermes/plans/` match its own index: active plans at top-level, completed plans only under `archive/`.

**Files:**
- Delete top-level duplicates:
  - `.hermes/plans/2026-05-27-design-consistency-v3.md`
  - `.hermes/plans/2026-05-27-design-system-consolidation.md`
  - `.hermes/plans/2026-05-27-layout-consistency.md`
  - `.hermes/plans/2026-05-27_080048-consistent-page-layouts.md`
  - `.hermes/plans/complete-audit-foundation.md`
  - `.hermes/plans/foundation-architecture-cleanup.md`
  - `.hermes/plans/nasaq-jules-10-v2.md`
  - `.hermes/plans/nasaq-jules-scopes.md`
  - `.hermes/plans/nasaq-ui-ux-10-parallel.md`
  - `.hermes/plans/preparation-and-feature-roadmap.md`
  - `.hermes/plans/ux-ui-current-issues-jules-fleet.md`
- Keep archive copies.
- Modify: `.hermes/plans/README.md`

**Steps:**
1. Delete duplicated top-level files only.
2. Update `.hermes/plans/README.md` active section:
   - mark docs roadmap as completed/archived if done.
   - add this plan as active until implemented.
3. Before deleting, verify every top-level/archive duplicate is byte-identical:
   ```bash
   python3 - <<'PY'
   from pathlib import Path
   import hashlib

   root = Path(".hermes/plans")
   archive = root / "archive"
   for top in sorted(root.glob("*.md")):
       if top.name == "README.md":
           continue
       archived = archive / top.name
       if archived.exists():
           a = hashlib.sha256(top.read_bytes()).hexdigest()
           b = hashlib.sha256(archived.read_bytes()).hexdigest()
           if a != b:
               raise SystemExit(f"Non-identical duplicate requires manual review: {top.name}")
   PY
   ```
4. Delete confirmed identical duplicates with `git rm`.
5. Run duplicate check:
   ```bash
   python3 - <<'PY'
   from pathlib import Path
   root=Path('.hermes/plans')
   top={p.name for p in root.glob('*.md') if p.name!='README.md'}
   archived={p.name for p in (root/'archive').glob('*.md')}
   dup=sorted(top & archived)
   assert not dup, dup
   PY
   ```
6. Verify and commit:
   ```bash
   git diff --stat
   git diff --check
   git status --short
   git add <exact removed plan files> .hermes/plans/README.md
   git commit -m "chore: remove duplicated archived plans from hot path"
   ```

### Task 0.2: Normalize Jules learning notes

**Objective:** Remove root `.jules/` scatter and keep agent notes in one convention.

**Files:**
- Move/delete:
  - `.jules/bolt.md`
  - `.jules/palette.md`
- Existing:
  - `.hermes/jules/sentinel.md`
- Optional create:
  - `.hermes/jules/bolt.md`
  - `.hermes/jules/palette.md`

**Decision:** Do not delete `.jules/*` until content is reviewed.

- If content has reusable workflow/design value: move it with `git mv` under `.hermes/jules/`.
- If content is already captured elsewhere: document where it is captured, then delete with `git rm`.
- Commit message body should state which option was chosen and why.

**Guardrail candidate:** Add `.jules/` to a repo hygiene check so it cannot come back.

**Commit:**
```bash
git add -A .jules .hermes/jules
git commit -m "chore: normalize agent notes location"
```

### Task 0.3: Fix remaining docs drift

**Objective:** Clean stale content left after docs cleanup.

**Files:**
- `SPEC.md`
- `docs/DOCS.md`
- `scripts/check-docs.sh`

**Fixes:**
- `SPEC.md` line map: `tests/ # 88 passing` → `tests/ # 93 passing`.
- Decide whether `SPEC.md` still owns task queue. Preferred: keep only current MVP state and point roadmap/task queue to README or GitHub issues. At minimum, remove redundant version-history mini-changelog and let `CHANGELOG.md` own history.
- `docs/DOCS.md`: component doc max lines should match actual guardrail allowlist (`280`) or the component doc should be split. Prefer split in Phase 6; for now align the documented budget with current guardrail to stop lying.

**Verification:**
```bash
npm run check-docs
```

**Commit:**
```bash
git add SPEC.md docs/DOCS.md scripts/check-docs.sh
git commit -m "docs: fix remaining structure cleanup drift"
```

---

## Phase 1 — Establish feature boundaries without changing behavior

### Task 1.1: Create `features/` skeleton and README

**Objective:** Make the architecture real before moving files.

**Files:**
- Create: `features/README.md`
- Do **not** create empty directories just to satisfy architecture. Git does not track them, and `.gitkeep` noise is not architecture.
- Create each feature directory with its first real file during the extraction task that needs it.

**Rules to document:**
- `app/**/page.tsx` imports one page component from `features/*`.
- `app/**/page.tsx` defaults to a Server Component and should not contain `"use client"` after extraction unless explicitly allowlisted.
- Feature page components default to Server Components. Put `"use client"` only on the smallest component/hook that needs state/effects/event handlers/browser APIs.
- `features/*/components` may use UI primitives and domain view models.
- `features/*/view-models` can transform demo/domain data and should be pure/testable where possible.
- `features/*/content.ts` owns structured Arabic copy/config arrays and should stay serializable when practical.
- `lib/*` stays framework-free business logic/integrations.

**Commit:**
```bash
git add features/README.md
git commit -m "docs: establish feature boundary conventions"
```

### Task 1.2: Add route-size guardrail in warning mode first

**Objective:** Measure route obesity without breaking CI on day one.

**Files:**
- Modify: `scripts/check-docs.sh` or create `scripts/check-architecture.sh`
- Modify: `package.json`

**Checks:**
- Generate `scripts/architecture-baseline.json` once from current source.
- Warn for current routes over target LOC.
- Fail if any existing route grows above its baseline.
- Fail if any new route page exceeds target LOC.
- Fail if an extracted route later regresses above target LOC.
- Baseline updates are allowed only in the same commit as intentional extraction/LOC reduction.

**Reason:** Prevent worsening before extraction is complete.

**Commit:**
```bash
git add scripts/check-architecture.sh scripts/architecture-baseline.json package.json
git commit -m "test: add route size architecture guardrail baseline"
```

---

## Phase 2 — Centralize content/config that is currently scattered

### Task 2.1: Extract marketing landing content

**Objective:** Make `app/page.tsx` smaller and separate content from layout.

**Files:**
- Create: `features/marketing/content.ts`
- Create: `features/marketing/landing-page.tsx`
- Modify: `app/page.tsx`

**Move from `app/page.tsx`:**
- `FEATURES`
- `PRICING`
- `FAQS`
- other structured section copy/config that is not JSX structure.

**Content rule:** Use plain serializable config where practical. If current arrays reference Lucide icon components, convert those to icon keys in `content.ts` and map keys to React components inside render code.

**Target:**
- `app/page.tsx` under 30 LOC:
  ```tsx
  import { LandingPage } from "@/features/marketing/landing-page";
  export default function RootPage() {
    return <LandingPage />;
  }
  ```

**Tests:**
- Add lightweight import test: `tests/marketing-content.test.ts` checking non-empty arrays and unique ids/slugs.

**Commit:**
```bash
git add app/page.tsx features/marketing/content.ts features/marketing/landing-page.tsx tests/marketing-content.test.ts
git commit -m "refactor: extract marketing landing content and page"
```

### Task 2.2: Extract dashboard navigation/user copy

**Objective:** Remove hardcoded repeated admin/demo user copy from layout components.

**Files:**
- Create: `features/dashboard/content.ts`
- Modify: `components/layout/Sidebar.tsx`

**Move:**
- nav labels/routes/icons mapping if currently inline.
- demo user label/email if intentionally demo-only.

**Guard:** Content module must make demo nature explicit: `DEMO_ADMIN_USER`, not generic `user`.

**Commit:**
```bash
git add features/dashboard/content.ts components/layout/Sidebar.tsx
git commit -m "refactor: centralize dashboard navigation content"
```

### Task 2.3: Extract settings content sections

**Objective:** Turn `settings/page.tsx` from card wall into a feature page with section configs.

**Files:**
- Create: `features/dashboard/settings/settings-page.tsx`
- Create: `features/dashboard/settings/content.ts`
- Create: `features/dashboard/settings/config-readiness-panel.tsx`
- Modify: `app/dashboard/settings/page.tsx`

**Target:**
- `app/dashboard/settings/page.tsx` under 30 LOC.
- Arabic field labels live in `content.ts`.
- `ConfigReadinessPanel` isolated and testable.
- Runtime readiness should be read in a Server Component/server-safe helper where possible and passed as safe flags only. Never expose env values; only readiness/missing variable names.

**Commit:**
```bash
git add app/dashboard/settings/page.tsx features/dashboard/settings/settings-page.tsx features/dashboard/settings/content.ts features/dashboard/settings/config-readiness-panel.tsx
git commit -m "refactor: extract settings page content and readiness panel"
```

---

## Phase 3 — Collapse duplicate demo data sources

### Task 3.1: Audit `demo-data` vs `demo-clinic`

**Objective:** Identify exact overlap and consumers before moving anything.

**Files to inspect:**
- `lib/demo-data.ts`
- `lib/demo-clinic.ts`
- `app/dashboard/page.tsx`
- `app/dashboard/inbox/page.tsx`
- `app/api/demo/flow/route.ts`
- `app/api/messages/send/route.ts`
- `app/api/bookings/route.ts`
- `app/api/webhooks/whatsapp/route.ts`
- `lib/reminder-sender.ts`
- related tests

**Output:**
- Create temporary audit notes inside this plan or a short `docs` note only if needed.
- Do not commit audit-only junk unless it has lasting value.

### Task 3.2a: Add canonical demo exports without changing consumers

**Objective:** Prepare `lib/demo-data.ts` as the canonical source while preserving behavior.

**Files:**
- Modify: `lib/demo-data.ts`
- Test: `tests/demo-data.test.ts` or new focused demo export test

**Rules:**
- Do not change demo object values, IDs, dates, phone masks, or API response shapes.
- Add missing exports by deriving from existing canonical data where possible.

**Verification:**
```bash
npm test -- tests/demo-data.test.ts
npm run lint
npm run build
```

**Commit:**
```bash
git diff --name-only
git add lib/demo-data.ts tests/demo-data.test.ts
git commit -m "refactor: add canonical demo-data exports"
```

### Task 3.2b: Convert consumers from `demo-clinic` to `demo-data`

**Objective:** Move app/API/lib consumers to the canonical demo source one layer at a time.

**Files:**
- Modify: `app/dashboard/page.tsx`
- Modify: `app/dashboard/inbox/page.tsx`
- Modify: `app/api/demo/flow/route.ts`
- Modify: `app/api/messages/send/route.ts`
- Modify: `app/api/bookings/route.ts`
- Modify: `app/api/webhooks/whatsapp/route.ts`
- Modify: `lib/reminder-sender.ts`
- Modify/add related tests

**Verification:**
```bash
npm test -- tests/clinic-api.test.ts tests/reminder-sender.test.ts tests/demo-data.test.ts
npm run lint
npm run build
```

**Commit:**
```bash
git diff --name-only
git add <exact intended files only>
git commit -m "refactor: migrate demo consumers to canonical demo-data"
```

### Task 3.2c: Keep or remove `demo-clinic` compatibility shim

**Objective:** Retire split-brain data without breaking remaining imports.

**Files:**
- Modify/delete: `lib/demo-clinic.ts`
- Test: compatibility test only if shim remains

**Rules:**
- If zero consumers remain, prefer deleting `lib/demo-clinic.ts`.
- If shim remains, it must only re-export from `demo-data.ts` and include a removal deadline in this plan/PR body.
- Phase 7 final guardrail should fail if shim remains without explicit allowlist.

**Commit:**
```bash
git add <exact intended files only>
git commit -m "refactor: retire legacy demo-clinic source"
```

### Task 3.3: Guard against new `demo-clinic` imports

**Objective:** Stop the legacy split from returning.

**Files:**
- Modify/create: `scripts/check-architecture.sh`
- Modify: `package.json`

**Rule:**
- New imports from `@/lib/demo-clinic` fail except inside `lib/demo-clinic.ts` and its compatibility test while shim exists.

**Commit:**
```bash
git add scripts/check-architecture.sh package.json
git commit -m "test: block new legacy demo-clinic imports"
```

---

## Phase 4 — Thin dashboard route files into feature pages

Do these one page per PR or one commit per page. No behavior changes. Each step: extract, import shell, run tests/build.

### Client-boundary rule for all Phase 4 tasks

- Route shell stays server-safe and under target LOC.
- If extracted feature code uses React state/effects/browser APIs, put `"use client"` at the top of the smallest owning component/hook.
- `npm run build` is mandatory after every extraction; server/client boundary bugs like to hide until build time.

### Task 4.1: Extract invoices page

**Why first:** largest dashboard route and highest inline handler count.

**Files:**
- Create: `features/dashboard/invoices/invoices-page.tsx`
- Create: `features/dashboard/invoices/invoice-detail-modal.tsx`
- Create: `features/dashboard/invoices/use-invoices-table.ts`
- Create: `features/dashboard/invoices/content.ts`
- Modify: `app/dashboard/invoices/page.tsx`

**Move:**
- `InvoiceDetailModal`
- PDF/export handler stays in a Client Component/hook because it uses DOM/browser libraries. Only pure invoice math/formatting may move to `lib/invoice-pdf.ts`.
- sorting/filtering/select/bulk-selection state into `use-invoices-table.ts`.
- labels/status copy into `content.ts`.

**Tests:**
- Add `tests/invoices-view-model.test.ts` for filtering/sorting/selection helpers if extracted as pure functions.

**Target:** route shell under 30 LOC.

**Commit:**
```bash
git add app/dashboard/invoices/page.tsx features/dashboard/invoices/invoices-page.tsx features/dashboard/invoices/invoice-detail-modal.tsx features/dashboard/invoices/use-invoices-table.ts features/dashboard/invoices/content.ts <exact new/modified test files>
git commit -m "refactor: extract invoices feature page and table logic"
```

### Task 4.2: Extract bookings page

**Files:**
- Create: `features/dashboard/bookings/bookings-page.tsx`
- Create: `features/dashboard/bookings/new-booking-dialog.tsx`
- Create: `features/dashboard/bookings/use-bookings-table.ts`
- Create: `features/dashboard/bookings/content.ts`
- Modify: `app/dashboard/bookings/page.tsx`

**Move:**
- `NewBookingDialog`
- filter/search state
- doctor/service/select labels
- any local status mapping not already in shared badge utilities.

**Tests:**
- Pure helper tests for filtering and booking draft construction if extracted.

**Commit:**
```bash
git add app/dashboard/bookings/page.tsx features/dashboard/bookings/bookings-page.tsx features/dashboard/bookings/new-booking-dialog.tsx features/dashboard/bookings/use-bookings-table.ts features/dashboard/bookings/content.ts <exact new/modified test files>
git commit -m "refactor: extract bookings feature page and dialog"
```

### Task 4.3: Extract inbox page

**Files:**
- Create: `features/dashboard/inbox/inbox-page.tsx`
- Create: `features/dashboard/inbox/conversation-list.tsx`
- Create: `features/dashboard/inbox/chat-thread.tsx`
- Create: `features/dashboard/inbox/ai-suggestion.tsx`
- Create: `features/dashboard/inbox/use-inbox-state.ts`
- Modify: `app/dashboard/inbox/page.tsx`

**Move:**
- 11 `useState` cluster into hook or reducer.
- AI suggestion UI.
- conversation filtering/search.
- message sending demo actions.

**Tests:**
- Reducer/hook pure state tests if reducer used.

**Commit:**
```bash
git add app/dashboard/inbox/page.tsx features/dashboard/inbox/inbox-page.tsx features/dashboard/inbox/conversation-list.tsx features/dashboard/inbox/chat-thread.tsx features/dashboard/inbox/ai-suggestion.tsx features/dashboard/inbox/use-inbox-state.ts <exact new/modified test files>
git commit -m "refactor: extract inbox feature state and panels"
```

### Task 4.4: Extract CRM page

**Files:**
- Create: `features/dashboard/crm/crm-page.tsx`
- Create supporting `components/`, `content.ts`, or `view-models/` only if needed
- Modify: `app/dashboard/crm/page.tsx`

**Verification:**
```bash
npm test
npm run lint
npm run build
```

**Commit:** `refactor: extract crm feature page`

### Task 4.5: Extract reminders page

**Files:**
- Create: `features/dashboard/reminders/reminders-page.tsx`
- Create supporting `components/`, `content.ts`, or `view-models/` only if needed
- Modify: `app/dashboard/reminders/page.tsx`

**Verification:**
```bash
npm test
npm run lint
npm run build
```

**Commit:** `refactor: extract reminders feature page`

### Task 4.6: Extract reports page

**Files:**
- Create: `features/dashboard/reports/reports-page.tsx`
- Keep chart/export code inside client boundary as needed
- Create supporting `components/`, `content.ts`, or `view-models/` only if needed
- Modify: `app/dashboard/reports/page.tsx`

**Verification:**
```bash
npm test
npm run lint
npm run build
```

**Commit:** `refactor: extract reports feature page`

### Task 4.7: Extract dashboard overview page

**Files:**
- Create: `features/dashboard/overview/overview-page.tsx`
- Create: `features/dashboard/overview/live-demo-runner.tsx`
- Create: `features/dashboard/overview/riyadh-clock.tsx`
- Modify: `app/dashboard/page.tsx`

**Verification:**
```bash
npm test
npm run lint
npm run build
```

**Commit:** `refactor: extract dashboard overview feature page`

### Task 4.8: Turn route-size guardrail from warning to fail

**Objective:** Enforce architecture once extraction is complete.

**Rule:**
- `app/**/page.tsx` max 80 LOC.
- Exception: `app/page.tsx` max 40 LOC after marketing extraction.
- API routes excluded.

**Commit:**
```bash
git add scripts/check-architecture.sh package.json
git commit -m "test: enforce thin route page guardrail"
```

---

## Phase 5 — Split business logic by responsibility

### Task 5.1: Split `lib/clinic-workflow.ts`

**Current problem:** 356 LOC module owns intent detection, slot generation, conflict detection, confirmation building, and reminders. That is not one reason to change.

**Files:**
- Create: `lib/clinic-intent.ts`
- Create: `lib/clinic-scheduling.ts`
- Create: `lib/clinic-reminders.ts`
- Keep: `lib/clinic-workflow.ts` as barrel/compat module temporarily.
- Modify tests:
  - `tests/clinic-workflow.test.ts`
  - optional new `tests/clinic-scheduling.test.ts`
  - optional new `tests/clinic-intent.test.ts`

**Move:**
- Intent detection + reply decision helpers → `clinic-intent.ts`.
- Slot generation + conflict detection → `clinic-scheduling.ts`.
- Reminder draft construction → `clinic-reminders.ts`.
- Existing public exports preserved from `clinic-workflow.ts` to avoid breaking imports.

**Verification:**
```bash
npm test -- tests/clinic-workflow.test.ts
npm run lint
npm run build
```

**Commit:**
```bash
git diff --name-only
git add <exact intended lib/test files only>
git commit -m "refactor: split clinic workflow into intent scheduling and reminders"
```

### Task 5.2: Clarify `lib/clinic-api.ts` orchestration boundary

**Objective:** Keep API handlers as orchestration only.

**Files:**
- Modify: `lib/clinic-api.ts`
- Tests: `tests/clinic-api.test.ts`, `tests/clinic-persistence.test.ts`

**Rules:**
- Request validation stays in `api-guards.ts`.
- Handler orchestration stays in `clinic-api.ts`.
- Domain decisions come from split modules.
- Persistence only through `ClinicStore`.

**Verification:**
```bash
npm test -- tests/clinic-api.test.ts tests/clinic-persistence.test.ts
npm run lint
npm run build
```

**Commit:**
```bash
git add lib/clinic-api.ts tests/clinic-api.test.ts tests/clinic-persistence.test.ts
git commit -m "refactor: clarify clinic api orchestration boundary"
```

---

## Phase 6 — Shared presentation patterns, not design churn

### Task 6.1: Extract repeated dashboard stat/list patterns

**Objective:** Reduce repeated card/filter/table control glue without changing UI.

**Files:**
- Create: `components/ui/filter-toolbar.tsx` or `components/ui/data-toolbar.tsx`
- Create: `components/ui/metric-grid.tsx` if useful
- Modify feature pages after extraction.

**Guard:** Do not over-abstract. Only extract if the same structure appears in 3+ feature pages.

Before extracting any shared component, document:
- the 3+ exact duplicated call sites,
- the props needed,
- confirmation that visual output remains unchanged.

If fewer than 3 call sites share the same structure, skip this task.

**Commit:**
```bash
git add <exact shared component files> <exact feature files updated to use them>
git commit -m "refactor: extract shared dashboard toolbar patterns"
```

### Task 6.2: Split `docs/COMPONENTS.md` if it keeps growing

**Objective:** Keep docs cheap and accurate.

**Files:**
- Keep: `docs/COMPONENTS.md` for public component contracts.
- Optional create: `docs/UI_PATTERNS.md` for page-level patterns.
- Update: `docs/DOCS.md`, `scripts/check-docs.sh` budgets.

**Commit:**
```bash
git add docs scripts/check-docs.sh
git commit -m "docs: split component contracts from ui patterns"
```

---

## Phase 7 — Final guardrails

### Task 7.1: Architecture hygiene script

**Objective:** Encode the rules humans keep forgetting.

**File:** `scripts/check-architecture.sh`

**Fail on:**
- Root `.jules/` directory exists.
- Duplicate file names between `.hermes/plans/*.md` and `.hermes/plans/archive/*.md`.
- `app/**/page.tsx` over LOC limit after extraction.
- New `@/lib/demo-clinic` imports outside compatibility shim/test.
- `features/` missing expected domain directories.

**Wire:**
- `package.json`:
  ```json
  "check-architecture": "bash scripts/check-architecture.sh",
  "verify": "npm test && npm run lint && npm run build && npm run check-tokens && npm run check-docs && npm run check-architecture"
  ```

**Commit:**
```bash
git add scripts/check-architecture.sh package.json
git commit -m "test: add architecture hygiene guardrail"
```

### Task 7.2: Final docs alignment

**Files:**
- `docs/ARCHITECTURE.md`
- `AGENTS.md`
- `SPEC.md`
- `README.md`

**Update after extraction:**
- `features/` is no longer target-only; it is real.
- Route thinness is enforced by `check-architecture`.
- Remove stale references to `demo-clinic` if shim retired.
- Update test count if it changed.

**Commit:**
```bash
git add AGENTS.md README.md SPEC.md docs/ARCHITECTURE.md
git commit -m "docs: align architecture docs after feature extraction"
```

---

## Phase 8 — Verification and PR

### Final commands

```bash
npm test
npm run lint
npm run build
npm run check-tokens
npm run check-docs
npm run check-architecture
npm run verify
git status --short
git log --oneline --decorate -n 10
```

### Manual review checklist

- [ ] No route page is a kitchen sink.
- [ ] No root `.jules/` directory.
- [ ] No duplicate top-level/archive plan files.
- [ ] Demo data has one canonical source.
- [ ] `features/` owns page UI/state/view-models.
- [ ] `lib/` owns pure business logic/integrations.
- [ ] Arabic copy is not scattered across route shells.
- [ ] No behavior drift in tests.
- [ ] No new feature slipped in under “cleanup.”

### PR title

```txt
Refactor: clarify structure, content, and business-logic boundaries
```

### PR body summary

- Cleaned stale/duplicated agent artifacts.
- Created real `features/` architecture.
- Extracted route pages into feature modules.
- Consolidated demo data source.
- Split business logic by responsibility.
- Added architecture guardrails to prevent regression.

---

## Suggested execution strategy

Do not do this as one monster PR unless forced. Best order:

1. PR A — Phase 0 + Phase 1 guardrail baseline.
2. PR B — Marketing/settings/content extraction.
3. PR C — Demo data consolidation.
4. PR D — Dashboard route extraction, one page at a time.
5. PR E — Business logic split + final strict guardrails.

That keeps review sane. Sanity is underrated because most repos are written by raccoons with keyboards.
