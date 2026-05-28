# Nasaq — MVP Spec

## Goal

Build a sales-ready MVP for Riyadh clinics that proves one high-value flow:

**WhatsApp lead → AI reply → appointment booking → reminders → CRM timeline → owner report.**

Product identity: **Nasaq** / **نسق** — AI clinic flow. The brand means order, coordination, and structured operations. Technical domain names still use `clinic` where they represent the healthcare tenant model.

Target: demoable, pilot-able with 1-2 clinics, sellable within 2 days.

---

## What Was Built

### Architecture
- **Frontend**: Next.js 15.5 (App Router), Tailwind 4, Arabic RTL
- **AI**: Deterministic (demo) + OpenAI + Gemini providers — switchable via env
- **WhatsApp**: Mock sender (demo) + official Meta Cloud API sender — no WhatsApp Web automation
- **Database**: Supabase Postgres (store adapter wired, requires live Supabase)
- **State**: In-memory demo data for frontend; production persistence via Supabase when configured

### Files
```
lib/                        # Business logic — no UI, no framework coupling
  brand.ts                  # Nasaq product identity and metadata copy
  clinic-workflow.ts        # Barrel re-export from split modules
  clinic-intent.ts          # Intent detection, WhatsApp parsing
  clinic-scheduling.ts      # Slot generation, conflict detection
  clinic-reminders.ts       # Booking confirmation, reminder drafts
  clinic-persistence.ts     # Store interface (10 operations)
  supabase-store.ts         # Supabase adapter implementing ClinicStore
  supabase-admin.ts         # Service role client + isConfigured guard
  runtime-config.ts         # Safe runtime readiness status without secret values
  clinic-api.ts             # Webhook, booking, send — 3 handlers
  whatsapp-send.ts          # Mock + Cloud API sender + factory
  ai-provider.ts            # Deterministic + OpenAI + Gemini + factory
  demo-data.ts              # Canonical typed seed data (bookings, reminders, leads, invoices)
  demo-clinic.ts            # Compatibility shim → re-exports from demo-data (deprecated)
  utils.ts

features/                   # Domain UI, hooks, view-models, content
  dashboard/                # Dashboard page components
    content.ts              # NAV_ITEMS, DEMO_ADMIN_USER
    overview/               # Overview page (PageShell, StatCards, LiveDemoRunner, RiyadhClock)
    inbox/                  # Inbox page (ChatThread, ConversationList, AiSuggestion, useInboxState)
    bookings/               # Bookings page (useBookingsTable, NewBookingDialog)
    crm/                    # CRM page
    invoices/               # Invoices page (useInvoicesTable, InvoiceDetailModal)
    reminders/              # Reminders page
    reports/                # Reports page
    settings/               # Settings page (ConfigReadinessPanel)
  marketing/                # Landing page + content (FEATURES, PRICING, FAQS)
  setup/                    # Setup wizard page + content

app/                        # Next.js App Router — thin route shells (≤80 LOC) + API routes
  page.tsx                  # Landing → features/marketing/
  login/page.tsx            # Auth login
  setup/page.tsx            # Setup wizard → features/setup/
  dashboard/
    page.tsx                # Overview → features/dashboard/overview/
    inbox/page.tsx           # Inbox → features/dashboard/inbox/
    bookings/page.tsx        # Bookings → features/dashboard/bookings/
    crm/page.tsx             # CRM → features/dashboard/crm/
    invoices/page.tsx        # Invoices → features/dashboard/invoices/
    reminders/page.tsx       # Reminders → features/dashboard/reminders/
    reports/page.tsx         # Reports → features/dashboard/reports/
    settings/page.tsx        # Settings → features/dashboard/settings/

app/api/
  config/status/            # Safe config readiness endpoint for settings UI
  webhooks/whatsapp/        # Meta webhook verification + inbound handler
  messages/send/            # Outbound WhatsApp sender endpoint
  bookings/                 # Booking creation endpoint
  ai/suggest-reply/         # AI suggestion endpoint
  demo/flow/                # Full pipeline demo endpoint

components/                 # shadcn/ui primitives (RTL-aware)
  layout/Sidebar.tsx

n8n/                        # External automation workflows
  reminders-sender.json     # Workflow for triggering reminders

scripts/                    # Guardrails
  check-design-tokens.sh    # Tailwind color, touch-target, PageShell, Badge audits
  check-architecture.sh     # Route size, duplicate plans, .jules/, demo-clinic imports
  check-docs.sh             # Doc line budgets, stale reference checks

tests/                      # 96 passing Node.js test runner tests
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
  sidebar.test.ts
  setup-store.test.ts
  demo-data.test.ts
  marketing-content.test.ts
  utils.test.ts
```

### Review Gate Results
- ✅ 96/96 tests passing
- ✅ Lint clean
- ✅ Build clean (no type errors)
- ✅ `check-tokens` — all design token checks pass
- ✅ `check-architecture` — all route shells ≤80 LOC, no duplicate plans, no root .jules/
- ✅ `check-docs` — all doc line budgets within limits
- ✅ No hardcoded secrets in lib/app
- ✅ Service role not in client bundle

---

## Demo Flow (5 minutes)

**Clinic**: عيادات النخبة — حي الملقا، الرياض

**Open dashboard at**: `http://localhost:3000/dashboard`

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
- [x] **ZATCA PDF** — generate VAT-compliant PDF invoice from modal, download button live
- [ ] **Reminders sender** — n8n workflow fires queued reminders via `/api/messages/send`
- [x] **Doctor calendar** — real slot availability, block double-booking

### P3 — Growth
- [ ] **Multi-clinic** — org/tenant model, each clinic isolated
- [ ] **Onboarding flow** — guided setup wizard for new clinics
- [x] **Analytics** — week-over-week trend charts on reports page
- [x] **Mobile PWA** — add manifest + service worker for installable app

### P4 — Compliance
- [ ] Data stored in Saudi Arabia or compliant jurisdiction (SDA requirements)
- [ ] Patient data not shared with third parties without consent
- [ ] AI does not give medical advice — routes to human for symptoms
- [ ] WhatsApp Business policy compliance — no marketing without opt-in
- [ ] CRM consent — customers opt in to WhatsApp messages
- [ ] Data retention policy — conversation log TTL

---

> Version history owned by `CHANGELOG.md`.