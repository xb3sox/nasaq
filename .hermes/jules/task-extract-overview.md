Title: Extract dashboard overview feature page
Repo: xb3sox/nasaq
Starting branch: sabi/cleanup-content-extract
Branch naming: jules/extract-overview

Risk score: 3
Mode: CLI pull mode

Goal: Extract 297 LOC dashboard overview page into features/dashboard/overview/. Thin route to <30 LOC.

Touch only: app/dashboard/page.tsx → Create: features/dashboard/overview/{overview-page,live-demo-runner,riyadh-clock}.tsx (+ content.ts)

Rules: Route shell imports OverviewPage. Extract LiveDemoRunner and RiyadhClock as separate components. Keep importing from @/lib/demo-clinic (shim refactors later). Same visual output. Build/test/lint green. Route <30 LOC.
