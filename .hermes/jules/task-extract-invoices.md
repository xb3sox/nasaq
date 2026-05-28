Title: Extract invoices feature page and table logic
Repo: xb3sox/nasaq
Starting branch: sabi/cleanup-content-extract
Branch naming: jules/extract-invoices

Risk score: 3
Mode: CLI pull mode

Goal:
Extract app/dashboard/invoices/page.tsx (441 LOC, 6 useState, 18 inline handlers) into features/dashboard/invoices/ and thin the route to <30 LOC.

Scope:
Touch only:
- app/dashboard/invoices/page.tsx (thin to shell)
- Create: features/dashboard/invoices/invoices-page.tsx
- Create: features/dashboard/invoices/invoice-detail-modal.tsx
- Create: features/dashboard/invoices/use-invoices-table.ts
- Create: features/dashboard/invoices/content.ts

Do not touch:
- package.json, lockfiles
- any other app/ files
- any lib/ files
- any components/ui/ files
- any other features/ files
- tests/ (unless adding targeted tests)

Rules:
- app/dashboard/invoices/page.tsx must become a thin shell:
  import { InvoicesPage } from "@/features/dashboard/invoices/invoices-page";
  export default function InvoicesRoute() { return <InvoicesPage />; }
- features/dashboard/invoices/invoices-page.tsx should be a Client Component (uses state, PDF export, event handlers). Wrap with <PageShell size="wide"> as in current code.
- features/dashboard/invoices/invoice-detail-modal.tsx extracts the InvoiceDetailModal component with PDF export. Keep "use client" at top.
- features/dashboard/invoices/use-invoices-table.ts exports a hook with: search state, status filter, sort, bulk select, filtering logic. All useState/useMemo must live in this hook.
- features/dashboard/invoices/content.ts exports Arabic labels, status config, column headers as serializable config.
- Do not change data source. Keep importing DEMO_INVOICES from @/lib/demo-data.
- Keep all visual output identical.

Acceptance criteria:
- npm run build passes
- npm run lint passes
- npm test passes
- Route shell <30 LOC
- Invoices page renders identical UI at /dashboard/invoices

Verification commands:
- npm test
- npm run lint
- npm run build
- wc -l app/dashboard/invoices/page.tsx

Output required when done:
- Summary
- Changed files with line counts
- Tests run results
- Route shell final LOC
- Risks / follow-up
