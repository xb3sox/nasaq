Title: Extract settings page content and readiness panel
Repo: xb3sox/nasaq
Starting branch: sabi/cleanup-content-extract
Branch naming: jules/extract-settings-content

Risk score: 3
Mode: CLI pull mode

Goal:
Extract settings page (256 LOC) into features/dashboard/settings/ with content module, feature page component, and isolated ConfigReadinessPanel. Thin app/dashboard/settings/page.tsx to <30 LOC route shell.

Scope:
Touch only:
- app/dashboard/settings/page.tsx (thin to shell)
- Create: features/dashboard/settings/settings-page.tsx
- Create: features/dashboard/settings/content.ts
- Create: features/dashboard/settings/config-readiness-panel.tsx
- Create: features/dashboard/settings/ (directory with .gitkeep)

Do not touch:
- package.json, lockfiles
- any other app/ files
- any lib/ files (readiness config lives in lib/runtime-config.ts — do not move it)
- any other components/ files
- any lib/runtime-config.ts, lib/clinic-api.ts, or lib/supabase-admin.ts
- tests/ (unless adding a targeted test for ConfigReadinessPanel)

Rules:
- features/dashboard/settings/content.ts should export serializable section config objects. Each section: {id, titleAr, descriptionAr}. Export an array of sections in the order they appear on the page. Arabic field labels should live here as serializable strings.
- features/dashboard/settings/settings-page.tsx should be a Client Component (settings page needs React state for form inputs and save handler). Import from content.ts and config-readiness-panel.tsx.
- features/dashboard/settings/config-readiness-panel.tsx should be an isolated Client Component that reads runtime readiness from lib/runtime-config.ts. Show ready/not-ready status per category (WhatsApp, AI, Supabase). Never expose env values — only flags and missing variable names.
- app/dashboard/settings/page.tsx must become a thin shell (<30 LOC):
  import { SettingsPage } from "@/features/dashboard/settings/settings-page";
  export default function SettingsPageRoute() { return <SettingsPage />; }
- Keep the current PageShell size="wide" wrapper inside settings-page.tsx.

Acceptance criteria:
- npm run build passes
- npm run lint passes
- npm test passes (existing + any new)
- Settings page renders identical UI at /dashboard/settings
- ConfigReadinessPanel shows same readiness state as before
- app/dashboard/settings/page.tsx is <30 LOC

Verification commands:
- npm test
- npm run lint
- npm run build
- wc -l app/dashboard/settings/page.tsx

Output required when done:
- Summary
- Changed files with line counts
- Tests run with results
- app/dashboard/settings/page.tsx final LOC
- Risks / follow-up needed
