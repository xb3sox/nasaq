Title: Inbox and reminders responsive semantic styling cleanup
Repo: xb3sox/nasaq
Starting branch: sabi/design-consistency-v3
Branch naming: jules/inbox-reminders-responsive

Risk score: 2
Mode: CLI pull mode

Goal:
Clean remaining responsive and semantic-styling inconsistencies in inbox and reminders while preserving the custom chat UI.

Scope:
Touch only:
- app/dashboard/inbox/page.tsx
- app/dashboard/reminders/page.tsx

Do not touch:
- package.json unless dependencies are intentionally changed
- lockfiles unless package.json changes
- auth, billing, migrations, secrets, or deployment config unless explicitly listed
- shared UI primitives
- unrelated formatting or generated files

Acceptance criteria:
- Replace real Button touch-target hacks with existing `Button size="touch"` or `size="touch-icon"` where applicable.
- Keep documented custom chat container exemptions; do not blindly replace chat bubble `max-w` or compose-container sizing.
- Normalize raw Badge class usage to neutral Badge or StatusBadge if semantically correct.
- For reminder border inline style, either replace with semantic classes if safe or add a short explicit exemption comment explaining why dynamic inline border color remains.
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
