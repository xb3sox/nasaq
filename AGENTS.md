# Nasaq — Agent Rules

**Product:** Nasaq / نسق — Arabic-first AI clinic flow for Riyadh clinics.
**Flow:** WhatsApp → AI → Booking → Reminders → CRM → Reports.

## Stack

- **Runtime:** Node 24+, Next.js 15.5, React 19, TypeScript 5
- **UI:** Tailwind 4, shadcn/ui, Arabic RTL (CSS logical properties: ps/pe/ms/me)
- **DB:** Supabase Postgres + RLS (adapter pattern — mock in demo, Supabase in prod)
- **API:** WhatsApp Meta Cloud API (official, no scraping)
- **AI:** Deterministic (demo) → OpenAI / Gemini (prod), provider-swappable via env
- **Auth:** NextAuth v5 beta, credentials provider, Supabase-backed (stubbed for demo)
- **CI/CD:** GitHub Actions → Vercel
- **Automation:** n8n workflows (reminders, CRM sync)

## Architecture

Read `docs/ARCHITECTURE.md` before structural work. Route files stay thin; feature UI belongs in `features/<domain>/`; generic primitives only in `components/ui/`.

```
app/          → Next.js App Router (thin route shells + API routes)
features/     → Domain UI, hooks, view-models, content
lib/          → Business logic (no UI, no framework coupling)
  brand.ts              → Product identity
  clinic-workflow.ts    → Barrel re-export from split modules
  clinic-intent.ts      → Intent detection, WhatsApp parsing
  clinic-scheduling.ts  → Slot generation, conflict detection
  clinic-reminders.ts   → Booking confirmation, reminder drafts
  clinic-persistence.ts → Store interface (10 ops)
  clinic-api.ts         → Webhook + booking + send handlers
  supabase-store.ts     → Supabase adapter
  supabase-admin.ts     → Service-role client
  ai-provider.ts        → Deterministic / OpenAI / Gemini
  whatsapp-send.ts      → Mock + Cloud API sender
  api-guards.ts         → Webhook validation, demo API gates
  runtime-config.ts     → Safe readiness flags (never exposes secrets)
  demo-data.ts          → Canonical typed seed data
  demo-clinic.ts        → Compatibility shim (re-exports from demo-data)
components/   → shadcn/ui (RTL-aware)
tests/        → Node.js test runner (96+ tests), no framework
supabase/     → Migrations + seed
n8n/          → Workflow JSONs
```

## Commands

```bash
npm install           # install deps
npm run dev           # start dev server (default port 3000)
npm test              # run all tests
npm run lint          # eslint
npm run build         # production build
npm run check-tokens  # design token guardrails
npm run check-docs    # doc hygiene checks
npm run check-architecture  # route size, duplicate plans, .jules/ checks
npm run verify        # full local quality gate
```

## Conventions

- **Arabic-first:** All user-facing text in Arabic. Code/comments in English.
- **Demo mode:** Runs without credentials. `MOCK_MODE` and `ENABLE_UNAUTHENTICATED_DEMO_API` control gates.
- **Secrets:** Never in code. Runtime config exposes status flags only — never values.
- **No medical advice:** AI routes symptoms to human. Compliant with Saudi regulations.
- **RTL:** Use CSS logical properties (`padding-inline-start`, not `padding-left`). Test in Arabic.
- **Store pattern:** `ClinicStore` interface → mock or Supabase adapter. Tests use mocks.
- **Route thinness:** `app/**/page.tsx` ≤ 80 LOC. Enforced by `check-architecture`.
- **Demo data:** Import from `@/lib/demo-data`. `demo-clinic` is a deprecated compatibility shim.
- **Branch naming:** `sabi/*` for features, `jules/*` for fixes, prefix with agent name.

## Red Lines

- Never call WhatsApp Web / unofficial APIs — Meta Cloud API only.
- Never log or expose WhatsApp tokens, Supabase keys, or patient data.
- Never deploy to main without Beso review.
- Never skip tests. Run `npm test` before every push.
- Auth changes must pass `npm run build` (NextAuth Edge Runtime compat).

## Agent Workflow

1. Read `SPEC.md` for task queue and current state.
2. Create a named branch.
3. Implement. Write tests.
4. Run `npm run verify`.
5. Open PR. Auto-merge only for `jules/*` branches on green CI.
6. Beso reviews all non-Jules PRs before merge.
