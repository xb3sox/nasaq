Title: Centralize dashboard navigation and user content
Repo: xb3sox/nasaq
Starting branch: sabi/cleanup-content-extract
Branch naming: jules/extract-dashboard-content

Risk score: 2
Mode: CLI pull mode

Goal:
Create features/dashboard/content.ts with nav links and demo user copy, then update components/layout/Sidebar.tsx to import from it.

Scope:
Touch only:
- Create: features/dashboard/content.ts
- components/layout/Sidebar.tsx

Do not touch:
- package.json, lockfiles
- any app/ files
- any lib/ files
- any other components/ files
- any other features/ files

Rules:
- features/dashboard/content.ts should export:
  - NAV_ITEMS: array of {label, href, iconKey} using string icon keys from lucide-react (e.g., "LayoutDashboard", "Inbox", "CalendarCheck", "FileText", "Users", "Bell", "BarChart3", "Settings") — no Lucide imports in content.ts.
  - DEMO_ADMIN_USER: {name, email} with demo values "المدير" and "owner@clinic.com" — make the demo nature explicit.
- components/layout/Sidebar.tsx should import NAV_ITEMS from "@/features/dashboard/content" and DEMO_ADMIN_USER. Build an icon-map for the Lucide imports inside Sidebar.tsx. Keep all visual output and behavior identical.
- utils.ts cn import is already in the file — do not change any styling.
- Sidebar.test.ts (tests/components.test.ts) must still pass.

Acceptance criteria:
- npm run build passes (no import resolution failures)
- npm run lint passes
- npm test passes
- Sidebar renders identical output
- features/dashboard/content.ts exports NAV_ITEMS and DEMO_ADMIN_USER

Verification commands:
- npm test
- npm run lint
- npm run build

Output required when done:
- Summary
- Changed files
- Tests run with results
- Risks / follow-up needed
