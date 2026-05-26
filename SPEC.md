# Nasaq — MVP Spec

## Goal

Build a sales-ready MVP for Riyadh clinics that proves one high-value flow:

**WhatsApp lead → AI reply → appointment booking → reminders → CRM timeline → owner report.**

Product identity: **Nasaq** / **نسق** — AI clinic flow. The brand means order, coordination, and structured operations. Technical domain names still use `clinic` where they represent the healthcare tenant model.

Target: demoable, pilot-able with 1-2 clinics, sellable within 2 days.

---

## What Was Built

### Architecture
- **Frontend**: Next.js 16 (App Router), Tailwind, Arabic RTL
- **AI**: Deterministic (demo) + OpenAI + Gemini providers — switchable via env
- **WhatsApp**: Mock sender (demo) + official Meta Cloud API sender — no WhatsApp Web automation
- **Database**: Supabase Postgres (store adapter wired, requires live Supabase)
- **State**: In-memory demo data for frontend; production persistence via Supabase when configured

### Files
```
lib/
  brand.ts              # Nasaq product identity and metadata copy
  clinic-workflow.ts     # Intent detection, booking logic, reminders
  clinic-persistence.ts  # Store interface (10 operations)
  supabase-store.ts      # Supabase adapter implementing ClinicStore
  supabase-admin.ts      # Service role client + isConfigured guard
  runtime-config.ts      # Safe runtime readiness status without secret values
  clinic-api.ts          # Webhook, booking, send — 3 handlers
  whatsapp-send.ts        # Mock + Cloud API sender + factory
  ai-provider.ts          # Deterministic + OpenAI + Gemini + factory
  demo-data.ts           # Typed seed data (bookings, reminders, leads, invoices)
  demo-clinic.ts         # Legacy demo (still used by overview page)
  utils.ts

app/api/
  config/status/         # Safe config readiness endpoint for settings UI
  webhooks/whatsapp/     # Meta webhook verification + inbound handler
  messages/send/         # Outbound WhatsApp sender endpoint
  bookings/              # Booking creation endpoint
  ai/suggest-reply/      # AI suggestion endpoint
  demo/flow/             # Full pipeline demo endpoint

app/dashboard/
  page.tsx               # Overview + golden flow visualization
  inbox/page.tsx         # Interactive inbox — 3 conversations, send/confirm/handoff
  bookings/page.tsx      # Booking list with status + filters
  crm/page.tsx           # Lead list with source + status
  reminders/page.tsx     # Reminder queue with status + retry
  invoices/page.tsx      # Invoice list (stub)
  reports/page.tsx       # Reports (stub)
  settings/page.tsx      # Readiness panel + WhatsApp, AI, clinic settings

tests/                   # 41 passing Node.js test runner tests
  brand.test.ts
  runtime-config.test.ts
  clinic-workflow.test.ts
  clinic-api.test.ts
  clinic-persistence.test.ts
  supabase-admin.test.ts
  supabase-store.test.ts
  whatsapp-send.test.ts
  send-message.test.ts
  ai-provider.test.ts
```

### Review Gate Results
- ✅ 43/43 tests passing
- ✅ Lint clean
- ✅ Build clean (no type errors)
- ✅ Smoke test: `POST /api/messages/send` returns `{ success: true, messageId: "mock-..." }`
- ✅ No hardcoded secrets in lib/app
- ✅ Service role not in client bundle

---

## Demo Flow (5 minutes)

**Clinic**: عيادات النخبة — حي الملقا، الرياض

**Open dashboard at**: `http://localhost:3001/dashboard`

### Step 1 — WhatsApp Lead (Inbox)
- Show "نورة المحمد" conversation in inbox
- Click "بكم تنظيف الأسنان؟ متاح موعد اليوم؟"
- See AI decision panel: `intent: booking, confidence: 91%, reply: "أهلاً بك. سعر تنظيف الأسنان 250 ريال..."`
- Click "استخدام الرد" → auto-fills reply input
- Click Send → `POST /api/messages/send` → mock success

### Step 2 — Confirm Booking
- Click "تأكيد الحجز" → green badge "الحجز مؤكد"
- `POST /api/bookings` creates confirmed booking + 2 reminder drafts

### Step 3 — Human Handoff
- Switch to "خالد العتيبي" conversation — shows orange "يحتاج موظف"
- Click "تحويل لموظف" → orange badge "تم التحويل"
- No AI reply sent — safe handoff

### Step 4 — Reminders Queue
- Go to `/dashboard/reminders` → show queued, sent, pending, failed

### Step 5 — CRM Leads
- Go to `/dashboard/crm` → show 4 leads from WhatsApp/Instagram/Google

### Step 6 — Reports
- Go to `/dashboard/reports` → show today's stats

---

## Pricing (MVP Pilot)

| Package | Price | Notes |
|---------|-------|-------|
| **Pilot** (2 months) | 1,500 SAR/month | 1 branch, WhatsApp only, up to 200 bookings/mo |
| **Growth** | 3,000 SAR/month | 1 branch, all modules, up to 500 bookings/mo |
| **Pro** | 6,000 SAR/month | unlimited branches, priority support |

---

## WhatsApp Strategy

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Meta Cloud API** (direct) | Official, reliable, scalable | Requires Meta Business Account + $35/mo | ✅ Use for production |
| **BSP** (Twilio, MessageBird, Infobip) | One SDK, multiple channels | Extra layer, adds cost | Good for multi-channel |
| **wacli / unofficial** | Quick setup | High ban risk, violates ToS, no support | ❌ Never for production |
| **WhatsApp Web automation** | Free | Unreliable, ban risk | ❌ Never for production |

**For MVP demo**: Mock mode is fine. For pilot clinics: use Meta Cloud API directly.

**wacli verdict**: ❌ Reject. Too risky for any real clinic. Meta Cloud API is the only production path.

---

## Compliance Checklist (Saudi Arabia)

- [ ] Data stored in Saudi Arabia or compliant jurisdiction (SDA requirements)
- [ ] Patient data not shared with third parties without consent
- [ ] AI does not give medical advice or triage — always routes to human for symptoms
- [ ] ZATCA e-invoicing compliance for billing (future phase)
- [ ] WhatsApp Business policy compliance — no marketing without opt-in
- [ ] CRM consent — customers must opt in to WhatsApp messages
- [ ] Data retention policy — how long conversation logs are kept

---

## Task Queue (Auto-Dispatch)

> Format: `[ ]` pending · `[~]` in-progress · `[x]` done
> Beso reads this on heartbeat and dispatches agents automatically.
> Do NOT reorder items — priority is top-down.

### P1 — Core (MVP blockers)
- [x] **Auth** — NextAuth email+password, protect dashboard routes, login page already built
- [ ] **Real WhatsApp** — Meta Cloud API creds + webhook registration + test end-to-end
- [~] **Real AI** — OpenAI/Gemini key wired to `/api/ai/suggest-reply`
- [~] **Supabase live** — apply all migrations to live project, verify RLS with real auth users

### P2 — Revenue
- [~] **ZATCA PDF** — generate VAT-compliant PDF invoice from modal, download button live
- [ ] **Reminders sender** — n8n workflow fires queued reminders via `/api/messages/send`
- [~] **Doctor calendar** — real slot availability, block double-booking

### P3 — Growth
- [ ] **Multi-clinic** — org/tenant model, each clinic isolated
- [ ] **Onboarding flow** — guided setup wizard for new clinics
- [ ] **Analytics** — week-over-week trend charts on reports page
- [ ] **Mobile PWA** — add manifest + service worker for installable app

### P4 — Compliance
- [ ] Data stored in Saudi Arabia or compliant jurisdiction (SDA requirements)
- [ ] Patient data not shared with third parties without consent
- [ ] AI does not give medical advice — routes to human for symptoms
- [ ] WhatsApp Business policy compliance — no marketing without opt-in
- [ ] CRM consent — customers opt in to WhatsApp messages
- [ ] Data retention policy — conversation log TTL

---

## Spec Change Log

- v0.1: Initial build — 6 modules, mock data, deterministic AI
- v0.2: Added WhatsApp send adapter (mock + Cloud API), dead letter handling
- v0.3: Added AI provider abstraction (Deterministic + OpenAI + Gemini)
- v0.4: Interactive inbox with send/confirm/handoff actions wired to API
- v0.5: Typed demo data, all pages wired to demo-data, build clean
- v0.6: Added production DB hardening — idempotent conversation upsert + dead letter schema alignment
- v0.7: Rebranded product identity to Nasaq and centralized brand metadata
- v0.9: Repo setup hardening — Node engine contract (.nvmrc/.node-version/package.json engines), lazy Supabase client (no crash in demo mode), vercel.json installCommand+CORS fixes, migration cleanup (renamed legacy files, sequential numbering), RLS-aligned seed
- v1.0: Demo data enrichment — 12 bookings, 10 leads, 8 invoices, 7 reminders; reminders page rebuilt with live retry/send API wired; CRM rebuilt with search+filter+empty state; custom 404 page; README fix
- v1.1: Repo cleanup — workflows moved into clinic-ai-os repo, legacy .bak migration removed, stale local branches deleted, Next.js 15.3.9 confirmed stable, auto-merge workflow added, autonomous build cron active, SPEC task queue formalized
- v1.2: RTL polish pass merged — import order fix, demoClinic name in header, eslint unused-vars rule, RTL/LTR sidebar/button/dialog/select/sheet/table/tabs components using logical CSS properties (pe/ps/me/ms/inset-x), mobile touch targets (min-h-[40px] sm breakpoint), horizontal scroll fix on dashboard flow card; deployed to production 2026-05-23
- v1.3: Jules sentinel session applied — invoices ZATCA label fixed, PDF button label corrected, invoice modal open on row click; all previous patches reviewed and consolidated; build + 43 tests verified clean
