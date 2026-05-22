# Nasaq — Setup Guide

Arabic-first AI clinic flow system for Riyadh clinics.
WhatsApp → AI → Booking → Reminders → CRM → Reports.

---

## Prerequisites

- **Node.js 24+** — `node --version`
- **pnpm** — `npm install -g pnpm`
- **Supabase account** (free tier) — [supabase.com](https://supabase.com)
- **WhatsApp Meta Business Account** (for production) — [business.facebook.com](https://business.facebook.com)
- **OpenAI or Gemini API key** (for production AI)

---

## Quick Start (Demo Mode — No Credentials Needed)

```bash
cd clinic-ai-os
npm install
npm run dev
```

Open [http://localhost:3001/dashboard](http://localhost:3001/dashboard)

Demo mode is enabled by default. All features work with mock data.

---

## Production Setup

### 1. Clone and Install

```bash
cd clinic-ai-os
npm install
```

### 2. Supabase

1. Create a new project at [supabase.com](https://app.supabase.com)
2. Go to **SQL Editor** → run the migration:
   ```
   supabase/migrations/002_full_schema.sql
   ```
3. Copy your project URL and keys from **Settings → API**
4. Create `.env.local` (see `.env.example`)

### 3. WhatsApp Cloud API

1. Create a Meta Business App at [business.facebook.com](https://business.facebook.com)
2. Add **WhatsApp Business** product to your app
3. Note your **Phone Number ID** and **WhatsApp Business Account ID**
4. Generate a **permanent access token**
5. Set webhook URL to: `https://your-domain.com/api/webhooks/whatsapp`
6. Verify token must match `WHATSAPP_VERIFY_TOKEN` in `.env.local`

### 4. AI Provider

```env
# Option A: OpenAI (recommended for Arabic)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Option B: Gemini (free tier available)
AI_PROVIDER=gemini
GEMINI_API_KEY=...
```

### 5. Deploy to Vercel

```bash
npm i -g vercel
vercel login
vercel --prod
```

Add all env variables in Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_BUSINESS_ACCOUNT_ID`
- `OPENAI_API_KEY` (or `GEMINI_API_KEY`)
- `AI_PROVIDER`
- `APP_URL` (your Vercel domain)
- `ENABLE_UNAUTHENTICATED_DEMO_API=false`

GitHub Actions deployment also needs these repository secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## Environment Variables

```env
# Supabase (required for production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# WhatsApp (required for production)
WHATSAPP_ACCESS_TOKEN=EAA...
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_VERIFY_TOKEN=your-secret-token
WHATSAPP_APP_SECRET=your-meta-app-secret
WHATSAPP_BUSINESS_ACCOUNT_ID=123456789

# AI (optional — falls back to deterministic demo)
AI_PROVIDER=deterministic      # deterministic | openai | gemini
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...

# App
APP_URL=https://your-domain.com
MOCK_MODE=false               # set to false for production
ENABLE_UNAUTHENTICATED_DEMO_API=false
```

---

## Project Structure

```
clinic-ai-os/
├── app/
│   ├── api/
│   │   ├── config/status/        # Safe readiness flags; never returns secrets
│   │   ├── webhooks/whatsapp/   # Meta webhook receiver
│   │   ├── messages/send/       # Outbound WhatsApp sender
│   │   ├── bookings/             # Booking creation
│   │   └── ai/suggest-reply/     # AI suggestion endpoint
│   └── dashboard/
│       ├── inbox/                # Interactive WhatsApp inbox
│       ├── bookings/             # Booking management
│       ├── crm/                  # Customer CRM
│       ├── reminders/            # Reminder queue
│       ├── invoices/             # Invoice management
│       └── reports/             # Analytics & reports
├── lib/
│   ├── brand.ts                 # Nasaq product identity
│   ├── clinic-workflow.ts        # Intent detection + booking logic
│   ├── clinic-persistence.ts     # Store interface (10 ops)
│   ├── supabase-store.ts         # Supabase adapter
│   ├── runtime-config.ts         # Env readiness status without secret values
│   ├── clinic-api.ts             # Webhook + booking + send handlers
│   ├── whatsapp-send.ts          # Mock + Meta Cloud API sender
│   ├── ai-provider.ts            # Deterministic + OpenAI + Gemini
│   └── demo-data.ts              # Typed demo seed data
└── supabase/
    └── migrations/
        └── 002_full_schema.sql   # Full DB schema + RLS + seed
```

---

## Demo Flow (5 minutes)

Product name: **Nasaq** / **نسق** — AI clinic flow.

Open **الإعدادات** first to check Supabase, WhatsApp, AI, and demo API readiness. The readiness panel exposes only status flags and missing variable names; it never returns secret values.

1. **صندوق الواتساب** — show نورة's conversation, click "استخدام الرد", send
2. **تأكيد الحجز** — click green button, shows confirmed
3. **تحويل لموظف** — switch to خالد's conversation, human handoff
4. **التذكيرات** — queue shows 24h and 2h reminders
5. **العملاء** — lead list from WhatsApp/Instagram/Google
6. **التقارير** — charts, KPIs, bookings vs leads

---

## Architecture

- **Frontend**: Next.js 16, App Router, Tailwind, shadcn/ui, Arabic RTL
- **Database**: Supabase Postgres + RLS
- **WhatsApp**: Meta Cloud API (no WhatsApp Web automation)
- **AI**: Deterministic (demo) → OpenAI or Gemini (production)
- **Reminders**: Queue in DB → n8n scheduler → WhatsApp send API
- **Auth**: Supabase Auth (configure as needed)

---

## Compliance Notes (Saudi Arabia)

- AI never gives medical diagnosis or treatment advice
- Patient data stays private — no third-party sharing without consent
- WhatsApp messages require customer opt-in
- ZATCA e-invoicing: future phase

---

## Pricing (Pilot offer)

| Package | Price | Notes |
|---------|-------|-------|
| **Pilot** (2 months) | 1,500 SAR/mo | 1 branch, up to 200 bookings/mo |
| **Growth** | 3,000 SAR/mo | all modules, up to 500 bookings/mo |
| **Pro** | 6,000 SAR/mo | unlimited branches, priority support |

---

## Support

For technical setup or pilot inquiries:
- Demo runs on `http://localhost:3001`
- Tests: `npm test`
- Build: `npm run build`
