# Features Directory

Feature modules own page-level UI, state, and content for Nasaq domains.

## Boundaries

- `app/**/page.tsx` imports one page component from `features/*` — never contains inline business logic or large JSX.
- Route shells default to Server Components. `"use client"` only on the smallest component/hook that needs state, effects, event handlers, or browser APIs.
- `features/*/components` may use UI primitives from `@/components/ui` and domain view models.
- `features/*/view-models` transform demo/domain data; prefer pure, testable functions.
- `features/*/content.ts` owns structured Arabic copy/config arrays; keep serializable when practical.
- Features must not import from `app/*` or `lib/*` (except shared types defined in `lib/`).
- `lib/*` stays framework-free — no React, Next.js, or UI imports.

## Directory conventions

Each feature domain gets a directory under `features/`:

```
features/
  marketing/         — Public landing page
  dashboard/
    overview/       — Dashboard home with golden-flow visualization
    inbox/          — WhatsApp conversation inbox
    bookings/       — Booking management
    invoices/       — Invoice list and PDF export
    crm/            — Lead management
    reminders/      — Reminder queue
    reports/        — Analytics and reports
    settings/       — Clinic settings and readiness panel
    content.ts      — Shared dashboard navigation/user copy
  setup/            — Setup wizard
```

Create directories only when they contain their first real file. No `.gitkeep` noise.
