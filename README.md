Clinic AI OS - MVP
===================

Quick start (local, mock mode)

Requirements
- Node 20+, pnpm or npm
- Supabase CLI or a Postgres database

1. Clone

2. Create .env from .env.example and set MOCK_MODE=true. Important vars:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY (optional in mock mode)
- MOCK_MODE=true
- APP_URL=http://localhost:3000
- N8N_WEBHOOK_URL=http://localhost:5678/webhook

3. Apply migrations
- Using supabase CLI: supabase db reset/ push -- migrate path to supabase/migrations
- Or psql < supabase/migrations/001_init.sql

4. Seed demo data
- psql -f supabase/seed/seed_demo.sql

5. Run Next.js app
- pnpm install
- pnpm dev

6. Run n8n (optional)
- docker run --rm -it -p 5678:5678 -e N8N_BASIC_AUTH_ACTIVE=true -e N8N_BASIC_AUTH_USER=admin -e N8N_BASIC_AUTH_PASSWORD=pass n8nio/n8n
- Import workflows from n8n/workflows

7. Test
- POST sample webhook to http://localhost:3000/api/webhooks/whatsapp (or use the Next.js stub)
- Call /api/ai/suggest-reply for mock suggestions

Notes
- This repo contains database migrations, seed data, n8n workflow skeletons, and Next.js API route stubs for local mock mode.
- Fill real credentials for Supabase, OpenAI, WhatsApp, and n8n when ready to go live.
