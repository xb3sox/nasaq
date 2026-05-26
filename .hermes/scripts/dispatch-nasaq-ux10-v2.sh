#!/usr/bin/env bash
set -euo pipefail
repo="xb3sox/nasaq"
branch="sabi/foundation-ux-ui"
common="Repo: $repo
Starting branch: $branch
Product: Nasaq / نسق Arabic-first AI clinic dashboard.
Rules: Arabic-first UI. Preserve RTL. Use CSS logical properties. No secrets. No unrelated files. No main merge.
Quality gate: npm run verify.
Output: summary, changed files, tests run, risks."

declare -a names=(
"Dashboard command center polish"
"Inbox conversation polish"
"Bookings schedule polish"
"CRM pipeline polish"
"Reports data-viz polish"
"Invoices payment/ZATCA polish"
"Reminders workflow polish"
"Settings trust/setup polish"
"Setup/login conversion polish"
"Global shell/perf polish"
)

declare -a allowed=(
"app/dashboard/page.tsx, components/ui/stat-card.tsx"
"app/dashboard/inbox/page.tsx"
"app/dashboard/bookings/page.tsx"
"app/dashboard/crm/page.tsx"
"app/dashboard/reports/page.tsx, components/ChartWrapper.tsx"
"app/dashboard/invoices/page.tsx"
"app/dashboard/reminders/page.tsx"
"app/dashboard/settings/page.tsx"
"app/setup/page.tsx, app/setup/steps/*.tsx, app/login/page.tsx, app/login/login-form.tsx"
"app/globals.css, app/layout.tsx, app/dashboard/layout.tsx, components/layout/Sidebar.tsx, app/dashboard/loading.tsx, app/error.tsx, app/global-error.tsx, app/not-found.tsx"
)

declare -a goals=(
"Improve hierarchy, microcopy, empty/loading states, card rhythm, trend readability."
"Make inbox feel WhatsApp-grade: RTL bubbles, timestamps, active conversation state, unread clarity, composer affordance."
"Improve timeline grouping, touch targets, status badges, appointment actions, no layout shift."
"Improve lead cards, activity timeline, source/status affordances, Kanban density."
"Brand charts, accessible legends/tooltips, KPI explanations, mobile chart behavior."
"Improve PDF/download feedback, payment state clarity, ZATCA QR fallback, invoice action hierarchy."
"Improve reminder grouping, snooze/reschedule affordances, non-color status semantics, WhatsApp send clarity."
"Improve tabs/sections, form labels, keyboard focus, save feedback, API readiness clarity."
"Reduce setup/login friction, clarify demo/prod setup, improve validation/help text, Arabic UX copy."
"Reduce CLS, unify skeletons/errors, improve sidebar motion/focus/mobile, preserve RTL."
)

for i in "${!names[@]}"; do
  n=$((i+1))
  prompt="$common

Workstream $n: ${names[$i]}
Allowed files only: ${allowed[$i]}
Goal: ${goals[$i]}
Forbidden: package deps unless truly necessary; business logic rewrites; API/auth/security changes; unrelated formatting.
Acceptance: UX improves visibly, mobile works, Arabic copy reads naturally, accessible focus/labels intact, npm run verify passes."
  echo "=== Dispatch WS$n: ${names[$i]} ==="
  jules remote new --repo "$repo" --session "$prompt"
done
