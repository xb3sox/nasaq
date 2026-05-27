Title: Extract bookings feature page and dialog
Repo: xb3sox/nasaq
Starting branch: sabi/cleanup-content-extract
Branch naming: jules/extract-bookings

Risk score: 3
Mode: CLI pull mode

Goal:
Extract 410 LOC bookings page into features/dashboard/bookings/. Thin route to <30 LOC.

Scope:
Touch only:
- app/dashboard/bookings/page.tsx (thin to shell)
- Create: features/dashboard/bookings/bookings-page.tsx
- Create: features/dashboard/bookings/new-booking-dialog.tsx
- Create: features/dashboard/bookings/use-bookings-table.ts
- Create: features/dashboard/bookings/content.ts

Standard rules (no other files, keep data source, same visual output, build/test/lint pass).
Route shell must import from features/dashboard/bookings/bookings-page.
Hook must own all filter/search/sort/select state.
Content must own Arabic labels.
Target route shell <30 LOC.
