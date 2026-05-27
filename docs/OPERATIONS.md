# Nasaq Operations

**Purpose:** Local demo setup, production environment, Supabase, WhatsApp, AI provider, and deployment runbook.
**Edit trigger:** Adding new infrastructure, changing env variables, updating deploy steps, adding known blockers.

---

## Local demo

```bash
npm install
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

Demo mode works without any credentials. Uses mock WhatsApp sender, deterministic AI, and in-memory demo data.

## Environment variables

Canonical reference: `.env.example` in the repo root.

**Minimal `.env.local` for demo:**

```env
MOCK_MODE=true
AI_PROVIDER=deterministic
ENABLE_UNAUTHENTICATED_DEMO_API=false
```

## Supabase

### Migrations (apply in order)

1. `supabase/migrations/001_init.sql` — base schema
2. `supabase/migrations/002_full_schema.sql` — full schema with RLS
3. `supabase/migrations/003_production_hardening.sql` — idempotent conversation upsert, dead letter alignment
4. `supabase/migrations/004_upsert_customer_rpc.sql` — customer upsert RPC

### Seed data

`supabase/seed/seed_demo.sql` — demo data for development/preview.

### Configuration

| Env variable | Source |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard → Settings → API → service_role key |

> **Warning:** `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS. Never expose it to the client bundle.

## WhatsApp (Meta Cloud API)

### Setup

1. Create/use a Meta Business account at [business.facebook.com](https://business.facebook.com)
2. Create a Business App and add WhatsApp product
3. Note: Phone Number ID, WhatsApp Business Account ID
4. Generate a permanent access token
5. Configure webhook URL: `https://your-domain.com/api/webhooks/whatsapp`
6. Verify token must match `WHATSAPP_VERIFY_TOKEN` in env

### Env variables

| Variable | Source |
|---|---|
| `WHATSAPP_PHONE_NUMBER_ID` | Meta App → WhatsApp → API Setup |
| `WHATSAPP_ACCESS_TOKEN` | Meta App → WhatsApp → Permanent token |
| `WHATSAPP_VERIFY_TOKEN` | Your own random string |
| `WHATSAPP_APP_SECRET` | Meta App → App Dashboard → App Secret |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Meta Business → WhatsApp Account ID |

### Known blocker

Production deploy may fail with an expired `VERCEL_TOKEN`. To fix locally:
1. Run `npx vercel login` to refresh your Vercel auth
2. Read the new token from `~/.local/share/com.vercel.cli/auth.json`
3. Set it as a GitHub secret: `gh secret set VERCEL_TOKEN` (pipe the token value, never paste it into chat)

## AI provider

| Provider | Env variable | Key | Status |
|---|---|---|---|
| Deterministic (demo) | `AI_PROVIDER=deterministic` | None | ✅ Default, works offline |
| OpenAI | `AI_PROVIDER=openai` | `OPENAI_API_KEY` | ✅ Wired, needs key |
| Gemini | `AI_PROVIDER=gemini` | `GEMINI_API_KEY` | ✅ Wired, needs key |

Production recommended: OpenAI for Arabic reply quality.

## Vercel deploy

### GitHub secrets

The deploy workflow (`deploy.yml`) needs these repository secrets:

| Secret | Value |
|---|---|
| `VERCEL_TOKEN` | Vercel access token (see WhatsApp blocker note) |
| `VERCEL_ORG_ID` | Vercel team ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |

### Required env variables on Vercel

All variables from `.env.example` marked as production must be set in the Vercel project dashboard:
- Supabase URL and keys
- WhatsApp credentials
- AI provider key
- `APP_URL` (your Vercel domain)
- `AUTH_SECRET` for NextAuth
- `ENABLE_UNAUTHENTICATED_DEMO_API=false` in production

## n8n reminders

Workflow file: `n8n/reminders-sender.json`

### Setup

1. Import the JSON into an n8n instance
2. Set variables in n8n:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `APP_URL` (your Nasaq domain)
3. Default schedule: every 15 minutes (adjust Cron node as needed)
4. Nasaq must have `ENABLE_UNAUTHENTICATED_DEMO_API=true` or proper auth in place

### How it works

The workflow periodically queries the `reminders` table for due reminders, calls the Nasaq send API for each, and updates reminder status based on send success/failure.
