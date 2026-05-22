# MEMORY.md - Core Knowledge Base

## Planned Products
- **MatchMind** — AI Tinder autopilot extension (planned).
- **PostPilot** — self-hosted social automation command center (planned).
- **Clinic AI OS** — project state lives in `/home/beso/.openclaw/workspace/clinic-ai-os/`; load only for Clinic tasks.

## Infrastructure
- **n8n:** `http://127.0.0.1:5678` (Docker) | 5 workflows, 4 active
- **n8n-MCP:** `http://127.0.0.1:3000` (Docker, healthy)
- **Cron jobs:** none active
- **Vercel:** authenticated locally as `xb3sox`; verify live state before deploys.
- **Secrets:** Bitwarden is the active password/secrets manager (`bw` + `bws`); 1Password is abandoned and can be cancelled after any remaining migration checks.

## Key Decisions
- Git: workspace on `main`
- GitHub username: `xb3sox`
- Development workflow: `sdd` skill is master policy; `TOOLS.md` owns local install/auth state.
- Collaboration lane: Beso plans/reviews/communicates; Sabi/Hermes builds durable work; external review lanes are optional per task.
- Cost rule: internal AI prompts start with caveman mode; polished user-facing specs/docs/PR bodies/commit messages stay normal.
- Business OS source: `COMMAND_CENTER.md` owns active priorities, product list, simple CRM, and weekly review. `FINANCE.md` stays separate for money details.
- UI quality workflow: audit first, design-system first, then page polish. Use `impeccable`, `ui-ux-pro-max`, `web-design-guidelines`, `polish`, and browser screenshots. Verify 390/430/768/1024/1440 px, RTL, WCAG AA, no horizontal scroll, no clipped/overlapped text, and 44-48px touch targets.
