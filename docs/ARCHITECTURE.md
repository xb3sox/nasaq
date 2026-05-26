# Nasaq Architecture

This document defines the foundation architecture rules for Nasaq.

## Folder Ownership & Anti-Spaghetti Rules

- `app/`: Routing shell only.
  - Route `page.tsx` under ~80 LOC unless static marketing.
  - No direct demo-data imports in route files after migration.
- `features/`: Domain UI, hooks, and view-models.
- `lib/`: Pure domain logic, adapters, config, and external integrations.
- `components/ui/`: Generic UI primitives only.
- No direct env access from components.
- Arabic-first and logical RTL utilities in app code.
