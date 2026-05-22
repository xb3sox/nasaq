# MEMORY.md - Core Knowledge Base

## Planned Products
- **MatchMind** — AI Tinder autopilot extension (planned).
- **PostPilot** — self-hosted social automation command center (planned).
- **Nasaq** — AI clinic flow project state lives in `/home/beso/.openclaw/workspace/clinic-ai-os/`; load only for Clinic/Nasaq tasks.

## Infrastructure
- **n8n:** `http://127.0.0.1:5678` (Docker) | 5 workflows, 4 active
- **n8n-MCP:** `http://127.0.0.1:3000` (Docker, healthy)
- **Cron jobs:** `nasaq-autonomous-build-loop` active (every 30 min) — polls Jules sessions, pulls completed branches, dispatches new SPEC tasks
- **Vercel:** authenticated locally as `xb3sox`; verify live state before deploys.
- **Secrets:** Bitwarden is the active password/secrets manager (`bw` + `bws`); 1Password is abandoned and can be cancelled after any remaining migration checks.

## Key Decisions
- Git: workspace on `main`
- GitHub username: `xb3sox`
- Development workflow: `AGENTS.md` decision tree owns which agent gets which task; `sdd` skill owns per-task implementation discipline; both are non-conflicting layers.
- Collaboration lane: Beso orchestrates via decision tree (AGENTS.md) — Jules for async/bounded tasks, Sabi for durable multi-step features, Claude Code for deep refactors, OpenCode for quick local fixes. Beso is always the review gate before main.
- Cost rule: internal AI prompts start with caveman mode; polished user-facing specs/docs/PR bodies/commit messages stay normal.
- Business OS source: `COMMAND_CENTER.md` owns active priorities, product list, simple CRM, and weekly review. `FINANCE.md` stays separate for money details.
- UI quality workflow: audit first, design-system first, then page polish. Use `impeccable`, `ui-ux-pro-max`, `web-design-guidelines`, `polish`, and browser screenshots. Verify 390/430/768/1024/1440 px, RTL, WCAG AA, no horizontal scroll, no clipped/overlapped text, and 44-48px touch targets.
