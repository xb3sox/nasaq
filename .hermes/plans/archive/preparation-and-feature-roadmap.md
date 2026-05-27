# Nasaq Preparation Plan

> **For Hermes:** Use subagent-driven-development skill for large feature phases. Use Jules only for bounded, non-overlapping implementation slices.

**Goal:** Keep the repo, GitHub, deployment, and implementation queue solid before feature expansion.

**Architecture:** Main stays deployable. Features move through scoped branches, CI gates, and small PRs. Product work is sequenced around the clinic revenue loop: WhatsApp capture → AI handling → booking → reminders → CRM → reports → invoicing.

**Tech Stack:** Next.js 15.5, React 19, TypeScript, Tailwind 4, shadcn/ui, Supabase, NextAuth v5, Vercel, GitHub Actions, Jules.

---

## Phase 0 — Repo/GitHub foundation

### Task 0.1: Keep main green

**Files:** `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `package.json`

**Steps:**
1. CI runs `npm test`, `npm run lint`, `npm run build` on every code PR.
2. Deploy runs only after CI-quality commands and valid Vercel secrets.
3. Fix failed deploy secrets before treating GitHub as production-ready.

**Verification:**
```bash
gh run list --repo xb3sox/nasaq --limit 10
npm test && npm run lint && npm run build
```

### Task 0.2: Add collaboration guardrails

**Files:** `.github/pull_request_template.md`, `.github/ISSUE_TEMPLATE/*`, `CONTRIBUTING.md`, `SECURITY.md`

**Steps:**
1. Require product outcome and verification evidence in PRs.
2. Require business outcome and acceptance criteria in feature issues.
3. Keep security reports private and manual-review only.

**Verification:**
```bash
gh repo view xb3sox/nasaq --json pullRequestTemplates,issueTemplates,isSecurityPolicyEnabled
```

### Task 0.3: Align repo settings

**GitHub settings:**
- Description: Arabic-first AI clinic dashboard: WhatsApp → AI → Booking → CRM → Reports.
- Topics: `nextjs`, `supabase`, `whatsapp`, `arabic`, `rtl`, `clinic-management`, `ai-agents`, `vercel`.
- Disable wiki.
- Delete branches after merge.
- Main branch protection after deploy workflow is green.

**Verification:**
```bash
gh repo view xb3sox/nasaq --json description,repositoryTopics,hasWikiEnabled,deleteBranchOnMerge
```

---

## Phase 1 — Product readiness backlog

### Task 1.1: Real clinic setup wizard

**Goal:** Turn `/setup` from demo wizard into a persistent clinic configuration flow.

**Files:** `app/setup/**`, `lib/clinic-persistence.ts`, `lib/supabase-store.ts`, `tests/*setup*.test.ts`

**Acceptance criteria:**
- Auth-protected setup.
- Saves clinic profile, services, doctors, working hours, WhatsApp settings.
- Demo mode still works.

### Task 1.2: WhatsApp production bridge

**Goal:** Complete inbound/outbound Meta Cloud API path.

**Files:** `app/api/webhooks/whatsapp/route.ts`, `app/api/messages/send/route.ts`, `lib/whatsapp-send.ts`, `tests/*whatsapp*.test.ts`

**Acceptance criteria:**
- Signature validation in production.
- Dead-letter on send failure.
- No token logging.

### Task 1.3: Booking lifecycle

**Goal:** Move from demo state to real booking status transitions.

**Files:** `app/dashboard/bookings/**`, `lib/clinic-api.ts`, `lib/clinic-workflow.ts`, `supabase/migrations/*`

**Acceptance criteria:**
- Confirm, reschedule, cancel.
- Conflict detection through store adapter.
- Tests cover overlap and status transitions.

### Task 1.4: CRM pipeline

**Goal:** Make lead stages and follow-ups useful for clinics.

**Files:** `app/dashboard/crm/page.tsx`, `lib/demo-data.ts`, `lib/clinic-persistence.ts`

**Acceptance criteria:**
- Stage changes persist.
- Source attribution preserved.
- Activity history visible.

### Task 1.5: Reports and revenue dashboard

**Goal:** Reports answer whether the clinic makes more money with Nasaq.

**Files:** `app/dashboard/reports/page.tsx`, `lib/clinic-persistence.ts`, `tests/*reports*.test.ts`

**Acceptance criteria:**
- Bookings, conversion, no-show, revenue, response-time metrics.
- Arabic labels and RTL-safe charts.
- No static-build chart warnings.

### Task 1.6: Invoicing polish

**Goal:** Make invoices demo-worthy and ZATCA-ready.

**Files:** `app/dashboard/invoices/page.tsx`, `tests/*invoice*.test.ts`

**Acceptance criteria:**
- Lazy PDF export.
- VAT math tests.
- ZATCA fields staged without pretending compliance is complete.

---

## Phase 2 — Execution rules

1. One feature branch per slice.
2. Write or update tests first for business logic.
3. Use Jules only with explicit allowed/forbidden files.
4. Run local gate before push.
5. Deploy only from green `main`.
6. Verify production with curl/browser smoke after deployment.
