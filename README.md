# Nasaq / نسق

Arabic-first AI clinic flow system for Riyadh clinics.
**WhatsApp → AI → Booking → Reminders → CRM → Reports.**

Turn WhatsApp conversations into booked appointments and actionable owner visibility — no leads lost in chat threads.

---

## Status

- **Demo MVP:** Working. Runs without credentials.
- **Tests:** 93 passing.
- **Production:** Deployed on Vercel. Production deploy blocked until `VERCEL_TOKEN` is refreshed. Live URL still responds at current deploy.
- **Mode:** Demo mode by default. Production needs Supabase + Meta WhatsApp Business Account + AI provider key.

---

## Quick start (demo mode)

```bash
npm install
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

No credentials needed. All features work with mock data.

---

## Demo flow

1. **صندوق الواتساب** — open نورة's conversation, click "استخدام الرد", send
2. **تأكيد الحجز** — click green button, shows confirmed
3. **تحويل لموظف** — switch to خالد's conversation, human handoff
4. **التذكيرات** — queue shows 24h and 2h reminders
5. **العملاء** — lead list from WhatsApp / Instagram / Google
6. **التقارير** — charts, KPIs, bookings vs leads

---

## Roadmap

### Now — pilot readiness
- Refresh Vercel deploy token
- Verify live Supabase project + RLS
- Register Meta WhatsApp webhook end-to-end
- Wire real Arabic AI provider
- Run first clinic pilot

### Next — revenue hardening
- n8n reminder sender with production auth
- Setup / onboarding polish
- Tenant / org isolation
- Consent capture + audit trail
- ZATCA invoice hardening

### Later — scale
- Multi-branch support
- Role-based access
- Weekly owner reports
- Data retention automation

---

## Architecture

| Layer | Tech |
|-------|------|
| Frontend | Next.js 15.5, React 19, App Router, Tailwind 4, shadcn/ui |
| Database | Supabase Postgres + RLS (adapter pattern) |
| WhatsApp | Meta Cloud API (official, no scraping) |
| AI | Deterministic (demo) → Openai / Gemini (prod) |
| Auth | NextAuth v5 beta, credentials provider |
| Automation | n8n workflows |
| CI/CD | GitHub Actions → Vercel |

Route files stay thin. Feature UI belongs in `features/<domain>/`. Generic primitives only in `components/ui/`.

---

## Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server (port 3000) |
| `npm test` | Run 93 tests (Node test runner) |
| `npm run lint` | ESLint |
| `npm run build` | Production build (Next.js) |
| `npm run verify` | Full quality gate: test + lint + build + check-tokens + check-docs |

---

## Compliance (Saudi Arabia)

- AI never gives medical diagnosis or treatment advice — routes to human.
- Patient data kept private. No third-party sharing without consent.
- WhatsApp messages require customer opt-in.
- ZATCA e-invoicing: future phase.

---

## Docs

| Doc | What it covers |
|-----|---------------|
| [Quick start (full)](docs/OPERATIONS.md) | Env vars, Supabase setup, WhatsApp config, AI provider, deploy |
| [Architecture](docs/ARCHITECTURE.md) | Folder ownership, data flow, route thinness |
| [Components](docs/COMPONENTS.md) | UI primitives contract, which component to use when |
| [Design tokens](app/globals.css) | CSS custom properties (source of truth) |
| [Contributing](CONTRIBUTING.md) | PR workflow, branch rules, quality gate |
| [Security](SECURITY.md) | Security policy, reporting |
| [Changelog](CHANGELOG.md) | Release history |
| [Agent rules](AGENTS.md) | Rules for AI agents working on the repo |

---

## Environment variables

See `.env.example` for the full list with explanations.
