# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

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

## Boilerplates & Starters
- **Turbostarter Boilerplate:** Batteries-included pnpm/monorepo starter for product apps (Next.js, React, Tailwind).

	**TurboStarter:** Fullstack starter — web (Next.js), mobile (Expo), extensions. CLI: `pnpm dlx @turbostarter/cli@latest new my-app`.
	- Prereqs: `node >= 24`, `pnpm`, `git`. Premium `Core` (lifetime license) available: https://www.turbostarter.dev

## Design & Productivity Tooling
- **Visuals:** Figma Pro, Adobe CC, Framer, Webflow
- **Automation:** n8n, Zapier, Make.com
- **Management:** GitHub Projects, Microsoft Loop, Microsoft To Do, Google Keep
- **Learning:** LinkedIn Learning, YouTube

## Browser Profiles
- **Real Chrome profile:** `~/.config/google-chrome/default` (lowercase) — has logged-in sessions
- **CDP port:** 18800 (OpenClaw managed)
- **Launch cmd:** `setsid /tmp/launch-chrome.sh` (uses real profile + CDP)
