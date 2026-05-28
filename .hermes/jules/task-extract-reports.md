Title: Extract reports feature page
Repo: xb3sox/nasaq
Starting branch: sabi/cleanup-content-extract
Branch naming: jules/extract-reports

Risk score: 3
Mode: CLI pull mode

Goal: Extract 304 LOC reports page into features/dashboard/reports/. Thin route to <30 LOC.

Touch only: app/dashboard/reports/page.tsx → Create: features/dashboard/reports/{reports-page}.tsx (+ content.ts, view-models/ if chart helpers extracted).

Rules: Route shell imports ReportsPage. Charts/export stay inside client boundary with "use client". Keep importing from @/lib/demo-data. Same visual output. Build/test/lint green. Route <30 LOC.
