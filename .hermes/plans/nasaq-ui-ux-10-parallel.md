# Nasaq UI/UX Overhaul: 10-Session Parallel Dispatch Plan

Objective: Achieve "world-class" polish for the clinic management app.

1. **WS1: Dashboard Micro-interactions** - Hover effects, subtle entrance animations for cards, and list item active states.
2. **WS2: Inbox RTL Perfection** - Fix message bubble alignment, avatar spacing, and timestamp scaling for Arabic.
3. **WS3: Bookings Calendar Polish** - Refine touch targets, date grouping logic, and status badge legibility.
4. **WS4: CRM & Lead Detail** - Improve lead card typography, activity history timeline, and Kanban column padding.
5. **WS5: Reports & Data Viz** - Update Recharts palette to brand teal, add tooltips with better contrast.
6. **WS6: Invoice & ZATCA Polish** - Refine PDF preview mode, add "Download" button visual feedback, and ZATCA QR scan area.
7. **WS7: Reminder Management** - Grouping logic, status icon set, and snooze interaction flows.
8. **WS8: Settings Accessibility** - Label/input association, keyboard focus indicators, and screen reader announcements.
9. **WS9: Global Form UX** - Unified input field validation states, error messages (RTL alignment), and auto-save indicators.
10. **WS10: Performance & Hydration Polish** - Optimize CSS logical property transitions, remove layout shifts on load, and unify loading state skeleton colors.

Isolation Strategy:
- Each session will be assigned a strict regex-based file scope via `jules` config to prevent collisions.
