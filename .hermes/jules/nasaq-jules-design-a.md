Title: Landing page design consistency polish
Repo: xb3sox/nasaq
Starting branch: sabi/design-consistency-v3
Branch naming: jules/landing-design-consistency

Risk score: 2
Mode: CLI pull mode

Goal:
Remove remaining landing page color/typography/spacing inconsistencies while preserving the current Arabic marketing design and LandingSection layout.

Scope:
Touch only:
- app/page.tsx
- components/landing/landing-section.tsx (only if a typed LandingSection prop is genuinely needed)

Do not touch:
- package.json unless dependencies are intentionally changed
- lockfiles unless package.json changes
- auth, billing, migrations, secrets, or deployment config unless explicitly listed
- dashboard pages
- unrelated formatting or generated files

Acceptance criteria:
- Replace raw non-semantic gradient color classes like `to-teal-400` with existing semantic token classes (`to-brand`, `to-primary`, or another existing token-safe equivalent).
- Landing pricing card headings use consistent typography (`tracking-tight`) where appropriate.
- Hero, pricing, FAQ, and CTA remain responsive on mobile and desktop.
- Keep all user-facing copy Arabic-first; do not rewrite copy except to fix accidental wrapping/formatting damage.
- No unrelated changes.

Verification commands:
- npm run lint
- npm run build
- npm run check-tokens

Output required when done:
- Summary
- Changed files
- Tests run with results
- Risks / follow-up needed
