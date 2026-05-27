Title: Extract marketing landing content and thin app/page.tsx
Repo: xb3sox/nasaq
Starting branch: sabi/cleanup-content-extract
Branch naming: jules/extract-marketing-content

Risk score: 2
Mode: CLI pull mode

Goal:
Extract the three content arrays (FEATURES, PRICING, FAQS) from app/page.tsx into features/marketing/content.ts, create features/marketing/landing-page.tsx as the page component, and thin app/page.tsx to a <30 LOC route shell.

Scope:
Touch only:
- app/page.tsx
- Create: features/marketing/content.ts
- Create: features/marketing/landing-page.tsx
- Create: tests/marketing-content.test.ts

Do not touch:
- package.json, lockfiles
- any other app/ files
- any lib/ files
- any other features/ files
- any components/ui/ files
- DESIGN.md, SPEC.md, README.md

Rules:
- features/marketing/content.ts should export plain serializable config arrays:
  - FEATURES: objects with {iconKey, title, desc}. Use string keys for icons: "MessageCircle", "Calendar", "Bell", "BarChart3", "Users", "Bot" (no Lucide imports).
  - PRICING: objects with {name, setup, monthly, features (string[]), highlight} — already serializable.
  - FAQS: objects with {q, a} — already serializable.
- features/marketing/landing-page.tsx should be a Server Component that imports content.ts arrays and renders the landing page JSX structure from the current app/page.tsx. Use LandingSection components with the same props currently used in app/page.tsx. Keep all visual output identical.
- Add "use client" only to the FaqAccordion component (it uses useState for expand/collapse). Keep it as a small standalone component inside landing-page.tsx or as a separate features/marketing/faq-accordion.tsx.
- app/page.tsx must become a thin route shell (<30 LOC):
  export default function RootPage() { return <LandingPage />; }
- tests/marketing-content.test.ts: import FEATURES, PRICING, FAQS and verify non-empty arrays, each item has required fields, and ids/slugs are unique.

Acceptance criteria:
- npm run build passes (no type errors, no import resolution failures)
- npm run lint passes
- npm test passes (existing 93 tests + new marketing-content tests)
- Visual output of app/page.tsx at / is identical to before
- app/page.tsx is <30 LOC
- features/marketing/landing-page.tsx contains all landing page JSX
- features/marketing/content.ts contains FEATURES, PRICING, FAQS as serializable config

Verification commands:
- npm test
- npm run lint
- npm run build
- wc -l app/page.tsx

Output required when done:
- Summary
- Changed files with line counts
- Tests run with results
- app/page.tsx final LOC
- Risks / follow-up needed
