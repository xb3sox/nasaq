Title: Extract CRM feature page
Repo: xb3sox/nasaq
Starting branch: sabi/cleanup-content-extract
Branch naming: jules/extract-crm

Risk score: 2
Mode: CLI pull mode

Goal: Extract 353 LOC CRM page into features/dashboard/crm/. Thin route to <30 LOC.

Touch only: app/dashboard/crm/page.tsx → Create: features/dashboard/crm/{crm-page}.tsx (+ content.ts and hook if useful).

Rules: Route shell imports CrmPage. Keep importing from @/lib/demo-data. Same visual output. Build/test/lint green. Route <30 LOC.
