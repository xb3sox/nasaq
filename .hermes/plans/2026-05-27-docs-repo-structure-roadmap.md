# Nasaq Docs + Repo Structure Cleanup Plan

> **For Hermes:** Implement task-by-task. Keep docs lean. No lore dumps.

**Goal:** Make Nasaq clear to humans and cheap for agents: current README, aligned docs, clean repo map, roadmap in README, no stale setup sludge.

**Current verified state:** `main` at `9ad64d6`; `npm test` passes `93/93`; Next.js `15.5.18`; React `19`; Node `24+`; design consistency v3 merged; production deploy blocked by invalid `VERCEL_TOKEN` though live URL still returns `200`.

## Findings

### P0 docs drift
- `SPEC.md`: says Next.js 16; package uses Next.js 15.5.18.
- `SPEC.md`: says 88 tests; actual is 93.
- `SPEC.md`: says `localhost:3001`; default dev URL is `localhost:3000`.
- `CHANGELOG.md`: still references updating SPEC to 88 tests.
- `docs/COMPONENTS.md`: documents old `PageShell maxWidth`; current layout work uses typed layout primitives and dashboard `wide` convention.

### P1 ownership mess
- README is mostly setup guide, not product/repo entrypoint.
- Roadmap is buried in stale `SPEC.md`.
- `docs/ARCHITECTURE.md` is too thin for the agent rule that says to read it before structural work.
- `DESIGN.md` mixes tokens, philosophy, and implementation rules.
- `.hermes/plans/` has large historical plans with no index/archive policy.

### P2 repo structure pressure
- Docs mention `features/`, but repo has no `features/` directory.
- Fat route files need later extraction:
  - `app/page.tsx`: 641 LOC
  - `app/dashboard/invoices/page.tsx`: 441 LOC
  - `app/dashboard/bookings/page.tsx`: 410 LOC
  - `app/dashboard/crm/page.tsx`: 353 LOC
  - `app/dashboard/inbox/page.tsx`: 345 LOC

## Target docs map

```txt
README.md                 # product pitch, quickstart, current status, roadmap
docs/DOCS.md              # doc ownership + token budget
docs/ARCHITECTURE.md      # folder boundaries + data flow + route thinness
docs/COMPONENTS.md        # current UI primitives only
docs/OPERATIONS.md        # env/deploy/Supabase/WhatsApp/n8n runbook
DESIGN.md                 # compact design token/source-of-truth notes
SPEC.md                   # short MVP state + active queue, or deprecated pointer
CHANGELOG.md              # release history only
AGENTS.md                 # agent rules only
```

Rule: one doc, one job. Cross-link, don’t duplicate.

## Token budget

- README: max 220 lines.
- `docs/*.md`: max 180 lines, except justified references.
- No full env tables outside `.env.example`.
- No historical implementation journals in hot docs.
- Every doc starts with: purpose, edit trigger, related docs.
- `.hermes/plans/` gets an index; archived plans are not default reading.

## README target outline

```md
# Nasaq / نسق
Arabic-first AI clinic flow for Riyadh clinics.
WhatsApp → AI → Booking → Reminders → CRM → Reports.

## Status
- Demo MVP working
- Tests: 93 passing
- Production: Vercel; latest deploy blocked until VERCEL_TOKEN refresh
- Demo runs without credentials

## Why it exists
Clinics lose paid leads in WhatsApp. Nasaq turns conversations into booked appointments and owner visibility.

## Quick start
npm install
npm run dev
open /dashboard

## Demo path
Inbox → AI reply → Confirm booking → Reminders → CRM → Reports

## Roadmap
### Now: pilot readiness
- Refresh Vercel deploy token
- Verify live Supabase + RLS
- Register Meta WhatsApp webhook E2E
- Wire real Arabic AI provider
- Run first clinic pilot

### Next: revenue hardening
- n8n reminder sender with production auth
- Setup/onboarding polish
- Tenant/org isolation
- Consent + audit trail
- ZATCA invoice hardening

### Later: scale
- Multi-branch support
- Role-based access
- Weekly owner reports
- Data retention automation

## Architecture
Short stack + links.

## Commands
npm install / npm run dev / npm test / npm run verify

## Docs
Links to docs map.
```

## Tasks

### 1. Add docs ownership map
- Create `docs/DOCS.md`.
- Include doc purpose, edit trigger, token budget, stale-doc checklist.
- Keep under 120 lines.
- Commit: `docs: add documentation ownership map`.

### 2. Rewrite README
- Replace setup-wall with target outline.
- Add roadmap in README.
- Link `.env.example`; do not duplicate env table.
- Fix current facts: Next.js 15.5, React 19, 93 tests, Vercel token blocker.
- Keep under 220 lines.
- Commit: `docs: clarify readme and roadmap`.

### 3. Fix or retire SPEC
- Keep only MVP goal, shipped modules, active queue, compliance checklist.
- Fix Next/test/dev URL drift.
- Move history to CHANGELOG or delete duplication.
- If redundant, mark deprecated and point to README + roadmap.
- Commit: `docs: align mvp spec with current repo`.

### 4. Strengthen architecture doc
- Expand `docs/ARCHITECTURE.md` with folder ownership, data flow, route thinness, adapter boundaries, test placement.
- Decide truth for `features/`: target architecture now, actual extraction later.
- Keep under 180 lines.
- Commit: `docs: document architecture boundaries`.

### 5. Align component/design docs
- Update `docs/COMPONENTS.md` for current layout primitives: `PageShell`, `LandingSection`, `CenteredPage`, `Badge`, `StatusBadge`.
- Move component rules out of `DESIGN.md`; keep DESIGN focused on tokens and visual principles.
- Run `npm run check-tokens`.
- Commit: `docs: align component and design docs`.

### 6. Add operations runbook
- Create `docs/OPERATIONS.md`.
- Cover local demo, env reference, Supabase migration order, WhatsApp webhook, AI provider, Vercel secrets, n8n reminders.
- Include current blocker: refresh `VERCEL_TOKEN`.
- Keep under 180 lines.
- Commit: `docs: add operations runbook`.

### 7. Index historical plans
- Create `.hermes/plans/README.md`.
- Mark active vs archived plans.
- Optional: move completed plans to `.hermes/plans/archive/`.
- Commit: `docs: index hermes plans`.

### 8. Add docs drift guardrail
- Create `scripts/check-docs.sh`.
- Fail on: `Next.js 16`, `88 tests`, `localhost:3001`, README >220 lines, docs >220 lines unless allowlisted.
- Add `check-docs` to `package.json`.
- Add it to `npm run verify` after `check-tokens`.
- Commit: `test: add docs drift guardrail`.

### 9. Separate code-structure follow-up
- Create later plan: `.hermes/plans/YYYY-MM-DD-feature-extraction.md`.
- Extract fat route files into `features/*` in separate PRs.
- Do not mix route extraction with docs cleanup.

## Acceptance

- README has pitch, quickstart, status, docs map, roadmap.
- README <=220 lines.
- Docs agree on stack, commands, test count, routes, deploy status.
- Architecture doc is useful enough for agents.
- Component docs match current APIs.
- Operations details live outside README.
- Historical plans indexed/archived.
- `npm run verify` includes docs drift check.
- No secrets committed.

## Verification

```bash
npm test
npm run lint
npm run build
npm run check-tokens
npm run check-docs
npm run verify
```

## Do not do

- Do not edit `beso/`; ignored local agent material.
- Do not duplicate `.env.example` into README.
- Do not move app code during docs cleanup.
- Do not touch Vercel secrets in this PR unless deployment repair becomes the task.
