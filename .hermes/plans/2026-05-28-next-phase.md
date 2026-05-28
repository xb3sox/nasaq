# Nasaq — Next Phase Plan

> **For Hermes:** Dispatch Jules sessions, pull sequentially, verify after each.

**Status:** 96 tests passing. Routes thin. Features/ real. Design system consolidated. Business logic split. Demo data canonical.

**Goal:** Close remaining cleanup + ship two product features: reminders sender and AI provider selector.

**Architecture:** No new patterns. Jules work is bounded file-touch work in existing modules.

---

## What's Done (recap)

- ✅ All routes ≤5 lines — features/ owns page UI
- ✅ Design system: PageShell, PageHeader, StatCard (unified), StatusBadge, WhatsAppButton, EmptyState, touch variants
- ✅ Business logic split: clinic-intent, clinic-scheduling, clinic-reminders
- ✅ Demo data canonical: demo-data.ts, 0 consumers of demo-clinic
- ✅ No root .jules/

## What Remains (this plan)

| # | Task | Type | Jules |
|---|------|------|-------|
| 1 | Delete demo-clinic.ts + fix docs drift | Cleanup | T1 |
| 2 | Clean 11 duplicate plan files | Cleanup | T1 |
| 3 | n8n reminders-sender workflow | Product | T2 |
| 4 | AI provider selector (settings UI) | Product | T3 |
| 5 | Final verify + PR | Gate | Local |

---

## Task 1: Cleanup Punch List (1 Jules)

**Repo:** xb3sox/nasaq · **Branch:** main · **Risk:** 1

### 1a. Delete `lib/demo-clinic.ts`
- 0 consumers. Safe delete.
- `git rm lib/demo-clinic.ts`
- Remove from SPEC.md and AGENTS.md references

### 1b. Remove duplicate plan files
- Delete these top-level duplicates (archive copies exist):
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
- Verify each is byte-identical to archive copy before `git rm`
- Update `.hermes/plans/README.md` active section

### 1c. Fix docs drift
- `SPEC.md`: test count 88 → 96, remove duplicate version history (CHANGELOG owns it)
- `AGENTS.md`: remove demo-clinic reference

### Verification
```bash
npm test && npm run lint && npm run build
npm run check-docs
git diff --stat
```

**Commit:** `chore: delete legacy demo-clinic, clean duplicate plans, fix docs drift`

---

## Task 2: n8n Reminders-Sender Workflow (1 Jules)

**Repo:** xb3sox/nasaq · **Branch:** main · **Risk:** 2

### Goal
Create `n8n/reminders-sender.json` — an n8n workflow that:
1. Runs on schedule (e.g., every 30 min, or triggered via webhook)
2. Queries pending reminders from the store
3. Sends each via `POST /api/messages/send` with the reminder body
4. Updates reminder status to `sent`

### Files
- Create: `n8n/reminders-sender.json`
- Reference: `lib/clinic-reminders.ts` (reminder data model)
- Reference: `app/api/messages/send/route.ts` (send endpoint shape)

### Workflow Nodes
1. **Schedule Trigger** — every 30 min
2. **HTTP Request** — `GET /api/reminders/pending` (or read from demo-data directly for MVP)
3. **SplitInBatches** — iterate over reminders
4. **HTTP Request** — `POST /api/messages/send` with `{ to, body }`
5. **HTTP Request** — `PATCH /api/reminders/{id}` mark as sent

### Demo Mode
In demo mode, reminders are in-memory. For MVP, the workflow can use the demo flow endpoint or read from `demo-data.ts` reminders array.

### Acceptance Criteria
- Valid n8n JSON (importable into n8n)
- Workflow handles empty queue (no reminders → no action)
- Each reminder includes: patient name, appointment time, clinic name
- Arabic reminder text

### Verification
```bash
# Validate JSON
python3 -c "import json; json.load(open('n8n/reminders-sender.json')); print('Valid JSON')"
npm run build
```

**Branch:** `jules/n8n-reminders`

---

## Task 3: AI Provider Selector in Settings (1 Jules)

**Repo:** xb3sox/nasaq · **Branch:** main · **Risk:** 2

### Goal
Add an AI provider selector to the Settings page that shows which AI provider is active and allows demo users to switch between mock/OpenAI/Gemini.

### Files
- Modify: `features/dashboard/settings/settings-page.tsx`
- Modify: `features/dashboard/settings/content.ts` (labels)
- Modify: `lib/ai-provider.ts` (add `getActiveProvider()` function)
- Create: `features/dashboard/settings/ai-provider-selector.tsx`
- Reference: `lib/runtime-config.ts` (config readiness pattern)

### Changes
1. Add `getActiveProvider(): string` to `lib/ai-provider.ts` — returns `"mock"`, `"openai"`, or `"gemini"` based on env vars
2. Create `AiProviderSelector` component:
   - Shows current provider with status badge (mock=neutral, openai=success, gemini=info)
   - In demo mode: interactive selector (dropdown/radio)
   - In production: read-only display
   - Uses `runtime-config.ts` pattern — never exposes API keys, only status flags
3. Add Arabic labels to `content.ts`: "مزود الذكاء الاصطناعي", provider names, descriptions
4. Wire into Settings page below ConfigReadinessPanel

### API Endpoint (optional, if needed)
- `app/api/config/ai-provider/route.ts` — GET returns current provider, POST switches
- Only active in demo mode (`ENABLE_UNAUTHENTICATED_DEMO_API`)

### Acceptance Criteria
- Settings page shows current AI provider
- Demo mode: can switch between mock/OpenAI/Gemini
- Never exposes API key values
- Build passes
- Tests pass

### Verification
```bash
npm test && npm run lint && npm run build
```

**Branch:** `jules/ai-provider-selector`

---

## Task 4: Final Verify + PR (Local)

After all Jules sessions pulled and merged:
```bash
npm run verify
git status --short  # must be empty
```

Open PR: `feat: reminders workflow + AI provider selector + cleanup`

---

## Execution Order

1. **Local:** Push test fix commit to main
2. **Dispatch:** T1, T2, T3 in parallel (3 Jules sessions, non-overlapping files)
3. **Pull:** T1 first (dependency-free), then T2+T3 (independent of each other)
4. **Verify:** Full quality gate
5. **PR:** Open for review

**Parallel safe:** T1 touches lib/docs/plans. T2 touches n8n/. T3 touches features/settings/ + lib/ai-provider.ts. No file overlap.
