# IDEAS.md — Planned Products

---

## 🤖 MatchMind
**Concept:** AI Chrome extension that sits on top of Tinder and runs your dating life on autopilot — from swiping to messaging to match triage.

### Features

**AutoPilot (Swipe Engine)**
- Scores every profile 0–100 using AI analysis
- Sniper: auto-likes profiles scoring ≥80
- Bouncer: auto-unmatches detected bots and spam
- Runs silently in the background while you browse

**Profile Analysis**
- Extracts bio, interests, essentials, "looking for" sections
- Section-based deep extraction on expanded profile route
- Bot/spam signal detection
- Compatibility scoring per user-defined preferences

**Coach (Messaging)**
- Real-time AI message suggestions injected as in-page banner
- Reads full conversation history for context
- Auto-types suggested message into Tinder's composer
- Activates on any open chat

**Active Chat Estimation**
- Counts open conversations using tabpanel-scoped DOM detection
- Informs AutoPilot pacing (don't overload active chats)

**Likes Sent Intelligence** *(future slice)*
- Expiry Radar — surfaces likes expiring soon ("7d left")
- Super Like Optimizer — scores profiles for upgrade ROI
- Sent-Like Triage Board — groups likes into High/Wait/Dead
- Opportunity Cost Meter — signals: ignore / upgrade / move on
- Second-Chance Triggering — near-expiry + strong profile → push upgrade
- Outgoing Like Analytics — patterns by age, distance, conversion rate
- Profile Enrichment for Match Prediction — parse expanded profile sections

**Privacy & AI**
- Fully in-browser — no data leaves unless you configure cloud
- Pluggable AI: local (WebLLM) or cloud (OpenAI API key)

**Stack:** Chrome extension · WXT + React + TypeScript · pnpm monorepo · Vitest
**Status:** Planned
**Path:** `products/matchmind`

---

## 📱 PostPilot
**Concept:** Self-hosted command center for fully autonomous social media management — content creation, scheduling, publishing, broadcasting, and analytics across all major platforms.

### Features

**Multi-Platform Scheduling (Postiz)**
- Visual post calendar and scheduler
- Platforms: Instagram, X (Twitter), LinkedIn, TikTok, Facebook, Pinterest
- Queue management, draft workflow, team collaboration

**Automation Engine (n8n)**
- Content Pipeline — pulls content from Notion/Google Sheets → auto-schedules in Postiz
- Instagram AI Poster — daily: GPT-4o generates caption + hashtags → DALL-E 3 generates image → publishes to IG → logs to Google Sheets
- TikTok/Snapchat Manual Helper — assists with platforms that require manual publish steps
- Extensible: add any flow for any platform via n8n

**WhatsApp Broadcasting**
- Bulk message send via Meta Business API
- Batch-split delivery to avoid rate limits
- Manual trigger for campaign control

**Contacts & Events CRM (Custom API)**
- Internal Node.js API for audience contacts management
- Events system for scheduling reminders and follow-ups
- Bull + Redis queue for async job processing

**Infrastructure**
- Postiz + n8n on separate Postgres DBs (isolated data)
- Redis for all queues and workers
- Daily automated DB backups (7-day retention, optional S3 upload)
- Cloudflare Tunnel → `social.brngt.com` (no port forwarding, works behind CGNAT)
- Google Contacts OAuth importer 
- Reminders worker 

**n8n-MCP Integration**
- n8n-MCP server (`:3001`) connected to n8n for AI-assisted workflow building
- AI can create, validate, and manage n8n workflows via MCP tools

**Stack:** Postiz · n8n · Node.js API · Postgres × 2 · Redis · Docker · Cloudflare Tunnel
**Status:** Planned
**Path:** `products/postpilot`
