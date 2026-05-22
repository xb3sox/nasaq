# MEMORY.md - Core Knowledge Base

## 🚀 Planned Products
- **MatchMind** — AI Tinder autopilot/ext (planned)
- **PostPilot** — self-hosted social automation (planned)
- **Clinic AI OS** — Arabic RTL SaaS dashboard for clinics (MVP in `/workspace/clinic-ai-os/`)
  - Live app: `https://clinic-ai-os.vercel.app`
  - Latest production deploy: `https://clinic-ai-os-theta.vercel.app`
  - GitHub: `https://github.com/xb3sox/clinic-ai-os`
  - Stack: Next.js 16, Supabase schema/RLS/seed, WhatsApp adapter, OpenAI/Gemini AI providers
  - Current state: mock mode works; production needs real Supabase, WhatsApp, and AI provider keys
  - Gmail signup attempt for `besoai.system@gmail.com` / suggested `besoa0669@gmail.com` blocked by Google phone verification
  - GitHub workflows: Jules AI code review triggers on PRs; Vercel deploy workflow exists and needs `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` secrets

## 🔧 Infrastructure
- **n8n:** `http://127.0.0.1:5678` (Docker) | 4 workflows
- **n8n-MCP:** `http://127.0.0.1:3000` (Docker, healthy)
- **Cron jobs:** none active
- **Vercel:** authenticated locally as `xb3sox`; Clinic AI OS deploys with `vercel --prod --yes`

## 🧠 Key Decisions
- Git: workspace on `main`
- GitHub username: `xb3sox`
- Preferred PR review flow: use Google Jules for GitHub PR creation/async implementation, then run GitHub Copilot CLI `/review` on Jules-created PRs before merge
- Correct Jules CLI package: `@google/jules`; authenticate with `jules login`
