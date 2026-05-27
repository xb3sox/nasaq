Title: Dashboard controls and tables responsiveness cleanup
Repo: xb3sox/nasaq
Starting branch: sabi/design-consistency-v3
Branch naming: jules/dashboard-controls-responsive

Risk score: 2
Mode: CLI pull mode

Goal:
Normalize controls, filter rows, touch targets, and responsive widths in bookings, invoices, and CRM dashboard pages without changing product behavior.

Scope:
Touch only:
- app/dashboard/bookings/page.tsx
- app/dashboard/invoices/page.tsx
- app/dashboard/crm/page.tsx

Do not touch:
- package.json unless dependencies are intentionally changed
- lockfiles unless package.json changes
- auth, billing, migrations, secrets, or deployment config unless explicitly listed
- shared UI primitives unless absolutely required; prefer using existing Button/SelectTrigger props
- unrelated formatting or generated files

Acceptance criteria:
- Replace real Button touch-target hacks such as `min-h-[40px] sm:min-h-0 sm:h-9` with existing `Button size="touch"` where applicable.
- Normalize `SelectTrigger` usage to `size="touch"` for mobile-friendly filters where currently using raw `h-9` or ad-hoc height classes.
- Audit hardcoded widths such as `w-[140px]`, `w-[150px]`, `min-w-[180px]`, and convert to responsive/token-consistent classes where safe.
- Preserve data-dense table/kanban usability; do not force cramped layouts.
- No unrelated changes.

Verification commands:
- npm run lint
- npm run build
- npm run check-tokens

Output required when done:
- Summary
- Changed files
- Tests run with results
- Risks / follow-up needed
