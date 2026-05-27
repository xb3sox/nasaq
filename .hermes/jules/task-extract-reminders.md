Title: Extract reminders feature page
Repo: xb3sox/nasaq
Starting branch: sabi/cleanup-content-extract
Branch naming: jules/extract-reminders

Risk score: 2
Mode: CLI pull mode

Goal: Extract 314 LOC reminders page into features/dashboard/reminders/. Thin route to <30 LOC.

Touch only: app/dashboard/reminders/page.tsx → Create: features/dashboard/reminders/{reminders-page}.tsx (+ content.ts, hook if useful).

Rules: Route shell imports RemindersPage. Keep importing from @/lib/demo-data. Same visual output. Build/test/lint green. Route <30 LOC.
