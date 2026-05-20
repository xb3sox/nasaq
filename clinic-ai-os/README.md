# Clinic AI OS - MVP

نظام AI للعيادات يرد على الواتساب، يحجز المواعيد، ويقلل ضغط الاستقبال.

## Tech Stack
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (PostgreSQL, Auth)

## Prerequisites
- Node.js >= 18
- npm or pnpm or yarn
- Supabase account

## Setup

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in your environment variables in `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project dashboard.
   - `OPENAI_API_KEY` for AI features (mock mode uses placeholder if empty).
   - Set `MOCK_MODE=true` for local testing without real Meta WhatsApp API keys.

5. Setup Database:
   Copy the contents of `supabase/migrations/20260520_initial_schema.sql` and run it in your Supabase SQL Editor to create the necessary tables.

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Built (MVP)
- [x] Landing Page
- [x] Dashboard Layout (RTL/Arabic)
- [x] CRM (Customer Management)
- [x] Bookings Interface
- [x] WhatsApp Inbox (Mock View)
- [x] WhatsApp Webhook Endpoint Structure
- [x] AI Reply Suggestion Endpoint Structure
- [x] Reminders View
- [x] Reports & Analytics View
- [x] Invoices View
- [x] Settings (Clinic, WhatsApp Meta Cloud API config, AI config, Staff)

## Notes for Production
- Add real authentication via Supabase Auth in Next.js middleware to protect `/dashboard/*` routes.
- Replace mock data arrays with real Supabase data fetching (`supabase.from('table').select()`).
- Implement the webhook connection using Meta Developer Portal for WhatsApp.
