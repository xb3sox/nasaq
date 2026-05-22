# COMMAND_CENTER.md - Active Control

One active business cockpit. Keep short. Update during weekly review or when priorities change.

## This Week

- **Main outcome:** collect 208,500 SAR receivables.
- **Second priority:** choose first revenue product path: MatchMind or PostPilot.
- **Third priority:** finish Gmail/Calendar OAuth for n8n.

## Priorities

1. Chase receivables: Rabie 200k, Wesam 7.5k, Ahmed Ali 1k.
2. Add Google OAuth client JSON to n8n, then activate useful workflows.
3. Define first sellable MVP and hand build work to Sabi.

## Products

| Product | Stage | Next Action | Owner |
|---|---|---|---|
| Clinic AI OS | Paused | Load only when Basem asks | Sabi/Beso |
| MatchMind | Idea | Validate risk, platform limits, ethics | Beso |
| PostPilot | Idea | Define MVP channel and automation scope | Beso |

## Pipeline

| Name | Value | Stage | Next Action | Last Contact |
|---|---:|---|---|---|
| Rabie | 200,000 SAR | Follow-up | Chase payment | 2026-05-22 |
| Wesam | 7,500 SAR | Follow-up | Chase payment | 2026-05-22 |
| Ahmed Ali | 1,000 SAR | Follow-up | Chase payment | 2026-05-22 |

Rules:
- Do not send outreach without Basem approval.
- Move stale rows to follow-up later or remove them.
- Keep finance details in `FINANCE.md`.

## Build Queue

- None active.

## Beso Queue

- Follow up on receivables.
- Decide MatchMind vs PostPilot.
- Get Google Cloud OAuth client JSON for Gmail/Calendar.

## Money Watchlist

| Item | Amount | Due |
|---|---:|---|
| Car Insurance | 385 SAR/month | Monthly |
| Stripe Atlas Agent | ~$100/year | Annual |
| brngt LLC Tax | ~$300/year | Annual |
| Hostinger | ~$30/month | Monthly |

## Ops State

- n8n: `http://127.0.0.1:5678`, 5 workflows, 4 active.
- n8n-MCP: `http://127.0.0.1:3000`, healthy.
- Bitwarden: `bw` logged in, `bws` configured through OpenClaw env.
- Sabi/Hermes: ACP spawn verified.
- Telegram: active.

## Blockers

- Gmail/Calendar OAuth needs Google Cloud OAuth client JSON.
- Weekly Business Review Draft workflow is inactive until delivery target is chosen.

## Weekly Review

Run weekly. Keep answers short.

Questions:
1. What made money?
2. What shipped?
3. What blocked progress?
4. What should be killed or paused?
5. What is this week's one main business outcome?
6. What should Sabi build?
7. What should Beso research, review, or decide?

Output:
- top 3 priorities
- Sabi build queue
- Beso queue
- money watchlist
- follow-ups

Next review: 2026-05-29.

## Rule

If it does not move product, money, health, or family forward, it waits.
