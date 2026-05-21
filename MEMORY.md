# MEMORY.md - Core Knowledge Base

## Tech Stack
- **Boilerplate:** TurboStarter (pnpm/monorepo)
- **Web:** Next.js 15, React, Tailwind, shadcn/ui
- **Mobile:** React Native, Expo
- **Backend:** Supabase (PostgreSQL, RLS), Drizzle ORM
- **Payments:** Stripe / LemonSqueezy
- **Deploy:** Vercel (web), EAS (mobile)

## 🚀 Planned Products
- **MatchMind** — AI Tinder autopilot/ext (planned)
- **PostPilot** — self-hosted social automation (planned)
- **Clinic AI OS** — Arabic SaaS dashboard for clinics (MVP in `/workspace/clinic-ai-os/`) ⚠️ needs real API keys

## 🔧 Infrastructure
- **n8n:** `http://127.0.0.1:5678` (Docker) | 4 workflows
- **n8n-MCP:** `http://127.0.0.1:3000` (Docker, healthy)
- **Browser:** OpenClaw native (`openclaw` profile)
- **agent-browser:** v0.27.0 | reinstalled 2026-05-21
- **Cron jobs:** none active

## 🧠 Key Decisions
- OpenClaw native browser = default | agent-browser = on-demand
- Git: workspace on `master` @ e180687
- Business: brngt LLC (Delaware) | expenses: Stripe Atlas $100/yr + LLC tax $300/yr

## 📅 Basem's Pillar Goals
- **Business:** SaaS, Entrepreneur License, Saudi Premium Residency
- **Financial:** Apartment, Invest & trade
- **Health:** Workout 5x/week, perfect body
- **Personal:** Get married, 50 podcast eps, great dad
