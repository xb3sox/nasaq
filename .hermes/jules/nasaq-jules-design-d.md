Title: Shared primitives and state pages consistency cleanup
Repo: xb3sox/nasaq
Starting branch: sabi/design-consistency-v3
Branch naming: jules/shared-state-design-consistency

Risk score: 2
Mode: CLI pull mode

Goal:
Make shared primitives and small error/loading/auth state pages consistent in typography, spacing, and semantic Badge usage.

Scope:
Touch only:
- app/error.tsx
- app/dashboard/error.tsx
- app/dashboard/loading.tsx
- app/login/page.tsx
- components/ui/stat-card.tsx
- components/ui/empty-state.tsx
- components/ui/badge.tsx
- components/ui/status-badge.tsx

Do not touch:
- package.json unless dependencies are intentionally changed
- lockfiles unless package.json changes
- auth, billing, migrations, secrets, or deployment config unless explicitly listed
- button.tsx
- select.tsx
- dashboard feature pages outside the listed error/loading files
- unrelated formatting or generated files

Acceptance criteria:
- Error/loading pages use consistent centered layout, spacing, RTL-safe structure, and heading typography.
- Add `tracking-tight` where actual headings need it, including login title if visually appropriate.
- Keep numeric StatCard values readable; if adding `tracking-tight`, ensure it does not degrade metric readability.
- If Badge needs a neutral/count variant to remove page-level `className="bg-muted"` hacks, add a typed variant rather than page-level color hacks.
- StatusBadge variants remain semantic and token-based.
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
