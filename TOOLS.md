# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for local setup/state only. Verify live state before acting on auth, installs, servers, or deploy targets.

## Hardware & Compute Nodes
- **Heavy Compute 1:** i5-12600K | 128GB RAM | RTX 3080Ti
- **Heavy Compute 2:** i7-8700K @ 3.70GHz | 32GB RAM (2133 MHz) | GTX 1060 6GB | 932GB Storage
- **Mobile Compute:** Dell XPS 15 (32GB) + Legion Pro 5
- **Mobile Devices:** S25 Ultra (Android) + iPhone 17 PRO MAX (iOS)

## Network & Connectivity
- **Network:** 500+ Mbps 5G + Triple Router Mesh

## Subscriptions, APIs & Infrastructure
- **Hosting:** Hostinger (Exp: 2026-08-13)
- **Domain:** brngt.com (Exp: 2027-08-13)
- **APIs Available:** Groq, OpenRouter, DeepSeek, GLM
- **Tech Subs:** Copilot Pro, Cursor Pro, Google AI Pro, Replit Core

## AI & Development Ecosystem
- **Frameworks & Agents:** AI SDK, Langchain, LangGraph, OpenAI Agents SDK, AutoGen, Mastra, Agno, Smolagents
- **IDEs & CLIs:** Cursor, VS Code, Antigravity, Claude Code, Gemini, GitHub Copilot, OpenAI Codex
- **Cloud Async Agents:** GitHub Copilot Coding Agent, OpenAI Codex, Cursor Background Agents, Google Jules
- **AI Builders & Design:** Figma Make, Replit, Lovable, Stitch, Relume, Aura Build

## Agent Workflow Local State
- **Workflow source of truth:** `AGENTS.md` owns multi-agent routing policy and escalation rules; `sdd` skill owns per-task TDD/implementation workflow; `TOOLS.md` records local install/auth state only. No conflict — AGENTS.md = which agent, sdd = how that agent works.
- **Local GitHub:** `gh` authenticated as `xb3sox`; `gh copilot` is available through GitHub CLI and can download/run Copilot CLI.
- **Local Vercel:** `vercel` installed at `~/.npm-global/bin/vercel`; authenticated as `xb3sox`.
- **Local 1Password:** `op` CLI installed (`2.33.1`). Abandoned. Migrate any remaining secrets to Bitwarden.
- **Secrets Manager:** Bitwarden Password Manager (`bw` 2026.4.2) + Bitwarden Secrets Manager (`bws` 2.1.0), both free tier. `bw` logged in/synced (passwords imported). `bws` access token injected via `env.BWS_ACCESS_TOKEN` in `openclaw.json` → works from all exec sessions. Never store `BW_SESSION` in plaintext. `BWS_ACCESS_TOKEN` lives in openclaw.json config env block (acceptable for local-only gateway).
- **Local Jules:** `@google/jules` installed globally (`~/.npm-global/bin/jules`). Authenticated. Connected repos: `xb3sox/clinic-ai-os`, `xb3sox/makeit`. Use `jules remote new --repo <owner/repo> --session "..."`. Active sessions tracked via `jules remote list --session`.
- **Local Cursor CLI:** `cursor-agent` not installed yet. Install only when starting Cursor review/fix lane; prefer read-only review before any write mode.
- **Local prompt cost rule:** Internal prompts to Sabi, Jules, Cursor, Copilot, or Codex start with `Caveman mode: terse, no fluff, direct output, no long explanation.` Use normal prose for user-facing specs, docs, PR bodies, commits, and customer copy.

## Boilerplates & Starters
- **Turbostarter Boilerplate:** Batteries-included pnpm/monorepo starter for product apps (Next.js, React, Tailwind).

	**TurboStarter:** Fullstack starter — web (Next.js), mobile (Expo), extensions. CLI: `pnpm dlx @turbostarter/cli@latest new my-app`.
	- Prereqs: `node >= 24`, `pnpm`, `git`. Premium `Core` (lifetime license) available: https://www.turbostarter.dev

## Design & Productivity Tooling
- **Visuals:** Figma Pro, Adobe CC, Framer, Webflow
- **Automation:** n8n, Zapier, Make.com
- **Management:** GitHub Projects, Microsoft Loop, Microsoft To Do, Google Keep
- **Learning:** LinkedIn Learning, YouTube

## Browser
- **OpenClaw browser:** enabled, default isolated `openclaw` profile per current docs.
- **Profile rule:** use OpenClaw native browser/tooling by default. Use `agent-browser` only when explicitly needed.
- **Real Chrome profile:** `~/.config/google-chrome/Default` stays untouched. Use profile `user` only when Basem explicitly wants existing signed-in browser sessions.
- **Config:** `~/.openclaw/openclaw.json` has `browser.enabled=true` and `browser.defaultProfile="openclaw"`; no custom headless/CDP/profile override.

## OpenClaw
- **CLI path:** `~/.nvm/versions/node/v24.15.0/bin/openclaw` (shell PATH may not expose `openclaw` in non-interactive commands)
- **Gateway:** loopback `127.0.0.1:18789`, token auth, Tailscale Serve enabled for tailnet access
- **ACP runtime:** enabled through `acpx`; default ACP agent is `hermes`.
- **Hermes ACP:** reachable via OpenClaw `sessions_spawn` with `runtime: "acp"` and `agentId: "hermes"`.
- **Beso + Hermes workflow:** Beso/OpenClaw owns user interaction, approvals, workspace-level decisions, git merges, destructive ops, and shared context files. Hermes/Sabi owns delegated execution, skills, subagents, Kanban tasks, and its own memory/state.
- **Hermes Kanban:** installed and backed by `~/.hermes/kanban.db`; gateway is running. Use Kanban for durable multi-step work, dependencies, review-required blocks, crash recovery, and audit trail. Current discovered Hermes profile: `default`.
- **Hermes context rule:** do not pass Basem's private context, `USER.md`, `FINANCE.md`, or full workspace memory into Hermes unless Basem explicitly asks. Ask Hermes for summaries/results, not raw logs or full internal state. For facts both sides must remember, write them to shared workspace files such as `TOOLS.md`.
