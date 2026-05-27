# Nasaq Architecture

**Purpose:** Folder ownership, data flow, route thinness rules, adapter boundaries, and test placement.
**Edit trigger:** Adding new directories, changing data flow patterns, or restructuring the folder layout.

---

## Folder ownership

```
app/              → Next.js App Router — thin route shells + API routes only
features/         → Target architecture: domain UI, hooks, view-models, selectors
components/ui/    → Generic UI primitives (shadcn/ui, RTL-aware)
lib/              → Pure business logic, adapters, config, integrations
tests/            → Node.js test runner, module-level tests
docs/             → Engineering and product documentation
scripts/          → CI guardrails and automation scripts
supabase/         → Migrations + seed
n8n/              → External n8n workflow JSONs
```

> **Note:** `features/` is the target architecture. Current route files in `app/` are still fat and will be extracted to `features/` in future PRs.

## Route thinness rule

- Route `page.tsx` files must stay under ~80 LOC unless the page is static marketing material.
- Route files import from `features/<domain>/` or `components/ui/` — they do not contain inline data fetching, inline business logic, or inline demo data.
- Route files that exceed this limit should have their logic extracted into:
  - `features/<domain>/components/` — page-specific UI blocks
  - `features/<domain>/hooks/` — custom hooks
  - `features/<domain>/view-models/` — data transformations

## Source-of-truth data flow

```
WhatsApp Meta Cloud API
        │
        ▼
  app/api/webhooks/whatsapp/route.ts    ← validates Meta signature
        │
        ▼
  lib/clinic-api.ts                     ← webhook handler (dispatch)
        │
        ├──► lib/clinic-workflow.ts      ← intent detection, booking logic
        ├──► lib/whatsapp-send.ts        ← response sender (mock or Cloud API)
        └──► lib/clinic-persistence.ts   ← store interface (10 operations)
                 │
                 ├──► lib/supabase-store.ts   ← production adapter
                 └──► lib/demo-data.ts        ← demo adapter (in-memory)
```

## Adapter boundaries

- **Store adapter:** `ClinicStore` interface in `lib/clinic-persistence.ts`. Implemented by:
  - `lib/supabase-store.ts` — Supabase Postgres with RLS (production)
  - Demo path uses `lib/demo-data.ts` directly (no adapter needed for reads)
- **AI provider:** `AIProvider` interface in `lib/ai-provider.ts`. Implemented by:
  - Deterministic variant (default demo)
  - OpenAI provider
  - Gemini provider
- **WhatsApp sender:** `WhatsAppSender` interface in `lib/whatsapp-send.ts`. Implemented by:
  - Mock sender (demo)
  - Meta Cloud API sender (production)
- **Auth:** `NextAuth v5` with credentials provider. Supabase-backed in production, demo-safe stub in demo mode.

## Test placement

- Tests go in `tests/` at the repo root.
- One test file per module: `tests/<module-name>.test.ts`.
- Tests use Node.js built-in test runner (`node --test`).
- Tests must not require external services (database, API keys, network).
- Demo mode tests use mock data from `lib/demo-data.ts`.
- Adapter tests mock the interface and verify contract compliance.

## Cross-cutting rules

- **No direct env access from components.** Runtime config status flags live in `lib/runtime-config.ts` — never in UI code.
- **Arabic-first UI:** All user-facing strings in Arabic. Code and comments in English.
- **RTL layout:** Use CSS logical properties (`padding-inline-start`, not `padding-left`; `margin-inline-end`, not `margin-right`; `inset-inline-start`, not `left`).
- **No secrets in code.** Runtime status endpoints expose readiness flags and missing variable names only — never values.
- **No medical advice.** AI routes symptoms and diagnosis requests to a human. Always.
