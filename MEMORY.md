# MEMORY.md - Core Knowledge Base

Curated memory. Track long-term decisions, insights, events here.

### Tech Stack

- **Monorepo Boilerplate:** TurboStarter (`https://www.turbostarter.dev/docs/web`). Modular "LEGO block" architecture.
- **Web:** Next.js (App Router), React, Tailwind CSS, shadcn/ui.
- **Mobile:** React Native, Expo.
- **Extension:** React, WXT (Browser Extensions).
- **Backend/DB:** Serverless API, Supabase (PostgreSQL, RLS), Drizzle ORM.
- **Standards:** Strict TypeScript, shared types, end-to-end validation.
- **Deploy:** Vercel (Web), EAS (Mobile), Store Submissions.
- **Payments:** Stripe / LemonSqueezy.

## 🚀 Planned Products → `IDEAS.md`

- **MatchMind** — AI Chrome ext for Tinder (autopilot, coach, swipe intel). Planned.
- **PostPilot** — self-hosted social automation (Postiz + n8n + custom API). Planned.
- **Clinic AI OS** — Arabic-first SaaS dashboard for clinics (Riyadh). MVP scaffolded in `/workspace/clinic-ai-os/`. Next.js 15 + Supabase + n8n + WhatsApp. Needs real API keys to go live.

## 🔧 Infrastructure State

- **n8n:** Running locally at `http://127.0.0.1:5678` (Docker). 4 workflows imported.
- **n8n-MCP:** Running at `http://127.0.0.1:3000` (Docker, healthy).
- **Browser:** OpenClaw native profile `openclaw`, profile data at `~/.openclaw/browser/openclaw/user-data`. Reset to clean state 2026-05-21.
- **agent-browser:** Reinstalled 2026-05-21 (v0.27.0). CLI at `~/.local/bin/agent-browser`, browser at `~/.agent-browser/browsers/chrome-149.0.7827.22`. Skill enabled and operational.

## 🧠 Key Decisions (2026-05)

- Browser = OpenClaw native default (`openclaw` profile) for general use. `agent-browser` also reinstalled (v0.27.0) per Basem request 2026-05-21; available for tasks that need it.
- `optimization_guide_model_store` (49M Chrome bloat) — delete on each browser reset, it rebuilds automatically.
- Cron jobs: none active currently.
- Git: workspace committed to `master` at `e180687`.
