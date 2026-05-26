# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
- SECURITY: Fix hardcoded demo credentials in `auth.ts`, replaced with `DEMO_EMAIL` and `DEMO_PASSWORD` env vars.
- ROUTING: Fix unreachable landing page by removing redirect from `/` to `/dashboard`.
- ERROR BOUNDARIES: Create `app/error.tsx` and `app/global-error.tsx` with Arabic RTL error UI.
- SUPABASE: Fix demo mode crash in `lib/supabase.ts` by gracefully returning `null` when env vars are missing.
- DOCS: Update `SPEC.md` test count to 88, added new pages (setup, reports, reminders, invoices, settings), added n8n section.
- CLEANUP: Delete empty dirs `n8n/workflows/` and `n8n/import-ready/`. Keep `n8n/reminders-sender.json` and `n8n/README.md`.

## [1.5.0]
- UX overhaul

## [1.3.0]
- auth+tests

## [1.2.0]
- RTL polish

## [1.1.0]
- Repo cleanup

## [1.0.0]
- Initial release
