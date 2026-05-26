# Nasaq UX/UI Polish Fleet v2

Branch target: `sabi/foundation-ux-ui`
Repo: `xb3sox/nasaq`
Gate: `npm run verify`
Rule: Arabic-first, RTL, CSS logical properties, no secrets, no main merge.

## Sessions

1. Dashboard command center polish
- Allowed: `app/dashboard/page.tsx`, `components/ui/stat-card.tsx`
- Goal: Improve hierarchy, microcopy, empty/loading states, card rhythm, trend readability.

2. Inbox conversation polish
- Allowed: `app/dashboard/inbox/page.tsx`
- Goal: WhatsApp-grade RTL bubbles, timestamps, active conversation state, unread clarity, composer affordance.

3. Bookings schedule polish
- Allowed: `app/dashboard/bookings/page.tsx`
- Goal: Better timeline grouping, touch targets, status badges, appointment actions, no layout shift.

4. CRM pipeline polish
- Allowed: `app/dashboard/crm/page.tsx`
- Goal: Better lead cards, activity timeline, source/status affordances, Kanban density.

5. Reports data-viz polish
- Allowed: `app/dashboard/reports/page.tsx`, `components/ChartWrapper.tsx`
- Goal: Brand charts, accessible legends/tooltips, KPI explanations, mobile chart behavior.

6. Invoices payment/ZATCA polish
- Allowed: `app/dashboard/invoices/page.tsx`
- Goal: PDF/download feedback, payment state clarity, ZATCA QR fallback, invoice action hierarchy.

7. Reminders workflow polish
- Allowed: `app/dashboard/reminders/page.tsx`
- Goal: Reminder grouping, snooze/reschedule affordances, non-color status semantics, WhatsApp send clarity.

8. Settings trust/setup polish
- Allowed: `app/dashboard/settings/page.tsx`
- Goal: Better tabs/sections, form labels, keyboard focus, save feedback, API readiness clarity.

9. Setup/login conversion polish
- Allowed: `app/setup/page.tsx`, `app/setup/steps/*.tsx`, `app/login/page.tsx`, `app/login/login-form.tsx`
- Goal: Reduce friction, clarify demo/prod setup, improve form validation/help text, Arabic UX copy.

10. Global shell/perf polish
- Allowed: `app/globals.css`, `app/layout.tsx`, `app/dashboard/layout.tsx`, `components/layout/Sidebar.tsx`, `app/dashboard/loading.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`
- Goal: Reduce CLS, unify skeletons/errors, improve sidebar motion/focus/mobile, preserve RTL.
