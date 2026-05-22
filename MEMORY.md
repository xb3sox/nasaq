# MEMORY.md - Core Knowledge Base

## 🚀 Planned Products
- **MatchMind** — AI Tinder autopilot/ext (planned)
- **PostPilot** — self-hosted social automation (planned)
- **Clinic AI OS** — Arabic RTL SaaS dashboard for clinics (MVP in `/workspace/clinic-ai-os/`)
  - Live app: `https://clinic-ai-os.vercel.app`
  - GitHub: `https://github.com/xb3sox/clinic-ai-os`
  - Stack: Next.js 16, Supabase schema/RLS/seed, WhatsApp adapter, OpenAI/Gemini AI providers
  - Current state: mock mode works; production needs real Supabase, WhatsApp, and AI provider keys
  - Gmail signup attempt for `besoai.system@gmail.com` / suggested `besoa0669@gmail.com` blocked by Google phone verification

## 🔧 Infrastructure
- **n8n:** `http://127.0.0.1:5678` (Docker) | 4 workflows
- **n8n-MCP:** `http://127.0.0.1:3000` (Docker, healthy)
- **Cron jobs:** none active
- **Vercel:** authenticated locally; Clinic AI OS deployed to `clinic-ai-os.vercel.app`

## 🧠 Key Decisions
- Git: workspace on `master`
- GitHub username: `xb3sox`
