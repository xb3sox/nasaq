# UI Audit Report — Clinic AI OS

**Tested:** 8 pages × 5 viewports (390, 430, 768, 1024, 1440px)
**Tooling:** Playwright + DOM inspection
**Date:** 22 May 2026

---

## CRITICAL (3)

### C1. No mobile responsive strategy for sidebar
**Pages:** All dashboard pages
**Viewports:** 390, 430, 768
**Detail:** `<aside class="w-64 ... fixed right-0 top-0">` stays 256px wide on all screens. No hamburger, no overlay/modal, no collapse. On 390px mobile that leaves 134px for main content — stat cards, tables, and forms will be unusably narrow. The sidebar also has no responsive breakpoint classes (`lg:block hidden` etc.).
**Fix:** Add hamburger toggle + slide-over drawer on <768px.

### C2. Root `<html>` missing `dir="rtl"`
**Pages:** All pages
**Viewports:** All
**Detail:** `app/layout.tsx` sets `lang="ar"` but omits `dir="rtl"`. Dashboard pages compensate with `dir="rtl"` on a wrapper div, but the root `<html>` has no `dir`. This causes:
- Scrollbar appears on right instead of left (RTL convention)
- Browser default text direction is LTR
- Screen readers and logical CSS properties may misbehave
**Fix:** Add `dir="rtl"` to the `<html>` element in `app/layout.tsx`.

### C3. Landing page inaccessible
**Page:** `/` (root)
**Viewports:** All
**Detail:** `app/page.tsx` exports a fully built `LandingContent` component (hero, features, pricing grid, FAQ, CTA) but the default export immediately calls `redirect("/dashboard")`. The landing page is never rendered. Either this is intentional (dashboard-only app) or the redirect should be a login gate, not a hard redirect.
**Fix:** Either remove the dead `LandingContent` code, or replace redirect with an actual route decision.

---

## HIGH (4)

### H1. No loading/error boundaries
**Pages:** All pages
**Viewports:** All
**Detail:** Zero `loading.tsx` or `error.tsx` files in the entire `/app` directory. Users see blank/white flash during page transitions and a raw Next.js error page on crashes. No skeleton loaders, no Suspense fallbacks.
**Fix:** Add `loading.tsx` (skeleton loader) and `error.tsx` (retry button) for each route segment.

### H2. No empty states for demo data
**Pages:** Inbox, bookings, CRM, invoices, reports, reminders
**Viewports:** All
**Detail:** All data pages map over hardcoded `DEMO_*` arrays with no empty-state handling. If the arrays are empty (or swapped for real DB), each page renders an empty space — no "لا توجد بيانات" message, no CTA action. The bookings page counts: `{DEMO_BOOKINGS.length} حجز`.
**Fix:** Add empty-state components for each list/repeating data section.

### H3. Responsive grid collapse — booking steps on dashboard
**Page:** Dashboard
**Viewport:** 768px
**Detail:** The booking pipeline card (`md:grid-cols-5`) collapses to single column at tablet, making the 5-step "رسالة → قرار AI → رد → حجز → تذكير" flow unnecessarily tall. Could use a horizontal scroll or smaller chips at mid-range.
**Fix:** Consider `sm:grid-cols-5` with narrower cells, or a horizontal-scroll container.

### H4. `text-[10px]` for sidebar secondary labels
**Pages:** All dashboard pages
**Viewports:** 1024, 1440
**Detail:** Sidebar uses `text-[10px]` for clinic location and user email. At 10px this is below the 12px WCAG minimum for readability, especially when viewed on high-DPI screens. While these are secondary fields, they're still user-facing information.
**Fix:** Bump to `text-xs` (12px/0.75rem) minimum.

---

## MEDIUM (4)

### M1. Inconsistent select component
**Page:** Bookings (filter dropdown)
**Viewports:** All
**Detail:** Bookings page uses a native `<select>` element instead of the shadcn `Select` component used elsewhere. Styling mismatch — the native select has different border-radius, font, and focus behavior than the design system components.
**Fix:** Replace `select` with `Select` from shadcn/ui.

### M2. Reminders page not linked in sidebar
**Page:** Navigation sidebar
**Viewports:** All
**Detail:** `/dashboard/reminders` page exists with full content but has no nav link. Reminders functionality is referenced in the dashboard pipeline description ("تذكير"), but the operational page is unreachable from the UI.
**Fix:** Add reminders to `routes` array in `Sidebar.tsx`.

### M3. Tab trigger height on mobile
**Page:** Settings
**Viewport:** 390, 430
**Detail:** Settings tab triggers have height ~23-28px, well below the 40px touch target minimum. On mobile these are hard to tap precisely.
**Fix:** Increase padding on tab triggers or use a vertical tab layout at <640px.

### M4. Button heights under 40px on mobile
**Pages:** Inbox, bookings, invoices, reports
**Viewport:** 390, 430 (Playwright audit)
**Detail:** Multiple action buttons measure 28-36px height at mobile widths: "تأكيد الحجز" (28px), "تعديل" (28px), "تصدير" (36px), period filter chips. All below the recommended 40px minimum for mobile touch targets.
**Fix:** Ensure `min-h-[40px]` or `py-2.5` (from `py-1.5`/`py-2`) on all interactive elements.

---

## LOW (2)

### L1. Unused animation classes with JS-ordering issues
**Pages:** Landing/LandingContent (dead code)
**Detail:** The dead LandingContent uses `animate-delay-${i + 1}` via template literals. Tailwind v4 doesn't support dynamic class generation — these delays only work because the corresponding CSS classes are defined in globals.css. If the delay var is ever >6, it silently breaks.
**Fix:** No action needed if landing page stays dead. If revived, use inline style `animationDelay` instead.

### L2. No dark mode toggle in UI
**Pages:** All
**Viewports:** All
**Detail:** The CSS has a full `.dark` theme with custom properties, and `next-themes` is in dependencies. But there's no theme toggle anywhere in the UI. Users can't switch between light/dark mode.
**Fix:** Add theme toggle (e.g. in settings or sidebar footer).

---

## SUMMARY

| Severity | Count | Key areas |
|----------|-------|-----------|
| Critical | 3 | Mobile sidebar, `<html dir>`, dead landing page |
| High | 4 | Missing boundaries, empty states, responsive grid, tiny text |
| Medium | 4 | Inconsistent select, orphaned route, small touch targets |
| Low | 2 | Animation classes, dark mode toggle |

**Fix order:** C1 → C2 → H1 → H2 → M4 → C3 → M3 → M1 → H3 → M2 → H4 → L2 → L1
