-- ============================================================
-- Nasaq — Supabase Schema Migration
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ──────────────────────────────────────────
-- Tables
-- ──────────────────────────────────────────

-- Clinics
create table if not exists public.clinics (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  branch_name   text,
  phone         text,
  whatsapp_number text,
  address       text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Profiles (users)
create table if not exists public.profiles (
  id            uuid        primary key references auth.users(id) on delete cascade,
  email         text        unique not null,
  full_name     text,
  role          text        not null default 'receptionist'
                   check (role in ('owner', 'manager', 'receptionist')),
  clinic_id     uuid        references public.clinics(id),
  created_at    timestamptz default now()
);

-- Branches
create table if not exists public.branches (
  id            uuid        primary key default gen_random_uuid(),
  clinic_id     uuid        not null references public.clinics(id) on delete cascade,
  name          text        not null,
  address       text,
  created_at    timestamptz default now()
);

-- Services
create table if not exists public.services (
  id            uuid        primary key default gen_random_uuid(),
  clinic_id     uuid        not null references public.clinics(id) on delete cascade,
  code          text        not null,
  name_ar       text        not null,
  name_en       text,
  price         numeric(10,2) not null default 0,
  currency      text        not null default 'SAR',
  duration_min  integer     not null default 30,
  active        boolean     not null default true,
  created_at    timestamptz default now(),
  unique(clinic_id, code)
);

-- Staff / Doctors
create table if not exists public.staff (
  id            uuid        primary key default gen_random_uuid(),
  clinic_id     uuid        not null references public.clinics(id) on delete cascade,
  name          text        not null,
  title         text,
  specialty     text,
  available     boolean     not null default true,
  created_at    timestamptz default now()
);

-- Customers
create table if not exists public.customers (
  id            uuid        primary key default gen_random_uuid(),
  clinic_id     uuid        not null references public.clinics(id) on delete cascade,
  name          text        not null,
  phone         text        not null,
  email         text,
  lead_status   text        not null default 'new'
                   check (lead_status in ('new','contacted','booked','completed','no_show','cancelled')),
  source        text,
  tags          text[]      default '{}',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now(),
  unique(clinic_id, phone)
);

-- Conversations
create table if not exists public.conversations (
  id            uuid        primary key default gen_random_uuid(),
  clinic_id     uuid        not null references public.clinics(id) on delete cascade,
  customer_id   uuid        not null references public.customers(id),
  channel      text        not null default 'whatsapp',
  external_id  text,
  last_message text,
  human_needed boolean     not null default false,
  tags          text[]      default '{}',
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Messages
create table if not exists public.messages (
  id              uuid        primary key default gen_random_uuid(),
  conversation_id uuid        not null references public.conversations(id) on delete cascade,
  customer_id     uuid        not null references public.customers(id),
  direction       text        not null check (direction in ('inbound','outbound')),
  body            text        not null,
  external_id     text,
  created_at      timestamptz default now()
);

-- Bookings
create table if not exists public.bookings (
  id            uuid        primary key default gen_random_uuid(),
  clinic_id     uuid        not null references public.clinics(id) on delete cascade,
  customer_id   uuid        not null references public.customers(id),
  service_id    uuid        references public.services(id),
  doctor_id     uuid        references public.staff(id),
  start_at      timestamptz not null,
  end_at        timestamptz,
  status        text        not null default 'pending'
                   check (status in ('pending','confirmed','completed','cancelled','no_show')),
  notes         text,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Reminders
create table if not exists public.reminders (
  id              uuid        primary key default gen_random_uuid(),
  clinic_id       uuid        not null references public.clinics(id) on delete cascade,
  booking_id      uuid        not null references public.bookings(id) on delete cascade,
  customer_id     uuid        not null references public.customers(id),
  template_key    text        not null,
  template_message text       not null,
  send_at         timestamptz not null,
  sent_at         timestamptz,
  status          text        not null default 'pending'
                   check (status in ('pending','queued','sent','failed')),
  created_at      timestamptz default now()
);

-- AI Logs
create table if not exists public.ai_logs (
  id              uuid        primary key default gen_random_uuid(),
  clinic_id       uuid        not null references public.clinics(id) on delete cascade,
  conversation_id uuid        references public.conversations(id),
  user_input      text        not null,
  ai_response     jsonb,
  action          text,
  confidence      numeric(5,3),
  status          text,
  created_at      timestamptz default now()
);

-- Webhook Events (raw incoming payloads)
create table if not exists public.webhook_events (
  id          uuid        primary key default gen_random_uuid(),
  clinic_id   uuid        not null references public.clinics(id) on delete cascade,
  source      text        not null,
  event       jsonb       not null,
  processed   boolean     not null default false,
  created_at  timestamptz default now()
);

-- Dead Letters (failed operations for retry)
create table if not exists public.dead_letters (
  id          uuid        primary key default gen_random_uuid(),
  clinic_id   uuid        not null references public.clinics(id) on delete cascade,
  kind        text        not null,
  payload     jsonb,
  error       text,
  created_at  timestamptz default now()
);

-- Invoices
create table if not exists public.invoices (
  id            uuid        primary key default gen_random_uuid(),
  clinic_id     uuid        not null references public.clinics(id) on delete cascade,
  booking_id    uuid        references public.bookings(id),
  customer_id   uuid        not null references public.customers(id),
  invoice_no    text,
  amount        numeric(10,2) not null,
  currency      text        not null default 'SAR',
  status        text        not null default 'pending'
                   check (status in ('pending','paid','cancelled','refunded')),
  due_date      date,
  paid_at       timestamptz,
  created_at    timestamptz default now()
);

-- ──────────────────────────────────────────
-- Functions
-- ──────────────────────────────────────────

-- upsert_customer_by_phone(p_clinic_id, p_phone, p_name)
create or replace function public.upsert_customer_by_phone(
  p_clinic_id uuid,
  p_phone text,
  p_name text
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_id uuid;
begin
  insert into public.customers (clinic_id, phone, name)
  values (p_clinic_id, p_phone, p_name)
  on conflict (clinic_id, phone) do update
    set name = coalesce(nullif(p_name, ''), customers.name),
        updated_at = now()
  returning id into v_id;
  return v_id;
end;
$$;

-- get_or_create_conversation(p_clinic_id, p_customer_id, p_external_id)
create or replace function public.get_or_create_conversation(
  p_clinic_id uuid,
  p_customer_id uuid,
  p_external_id text,
  p_channel text default 'whatsapp'
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_id uuid;
begin
  insert into public.conversations (clinic_id, customer_id, channel, external_id)
  values (p_clinic_id, p_customer_id, p_channel, p_external_id)
  on conflict (clinic_id, customer_id) do update
    set last_message   = conversations.last_message,
        updated_at    = now()
  returning id into v_id;
  return v_id;
end;
$$;

-- ──────────────────────────────────────────
-- Row Level Security
-- ──────────────────────────────────────────

alter table public.clinics       enable row level security;
alter table public.profiles      enable row level security;
alter table public.branches      enable row level security;
alter table public.services      enable row level security;
alter table public.staff         enable row level security;
alter table public.customers    enable row level security;
alter table public.conversations enable row level security;
alter table public.messages     enable row level security;
alter table public.bookings     enable row level security;
alter table public.reminders    enable row level security;
alter table public.ai_logs      enable row level security;
alter table public.webhook_events enable row level security;
alter table public.dead_letters  enable row level security;
alter table public.invoices     enable row level security;

-- Default RLS: users can only see/edit rows belonging to their clinic
create policy "Users access own clinic rows"
  on public.clinics for all
  using (auth.uid() in (select clinic_id from public.profiles where id = auth.uid()));

create policy "Users access own clinic rows"
  on public.profiles for all
  using (profiles.id = auth.uid());

create policy "Users access own clinic"
  on public.branches for all
  using (
    clinic_id in (select clinic_id from public.profiles where id = auth.uid())
  );

create policy "Users access own clinic"
  on public.services for all
  using (
    clinic_id in (select clinic_id from public.profiles where id = auth.uid())
  );

create policy "Users access own clinic"
  on public.staff for all
  using (
    clinic_id in (select clinic_id from public.profiles where id = auth.uid())
  );

create policy "Users access own clinic"
  on public.customers for all
  using (
    clinic_id in (select clinic_id from public.profiles where id = auth.uid())
  );

create policy "Users access own clinic"
  on public.conversations for all
  using (
    clinic_id in (select clinic_id from public.profiles where id = auth.uid())
  );

create policy "Users access own clinic"
  on public.messages for all
  using (
    conversation_id in (
      select id from public.conversations
      where clinic_id in (select clinic_id from public.profiles where id = auth.uid())
    )
  );

create policy "Users access own clinic"
  on public.bookings for all
  using (
    clinic_id in (select clinic_id from public.profiles where id = auth.uid())
  );

create policy "Users access own clinic"
  on public.reminders for all
  using (
    clinic_id in (select clinic_id from public.profiles where id = auth.uid())
  );

create policy "Users access own clinic"
  on public.ai_logs for all
  using (
    clinic_id in (select clinic_id from public.profiles where id = auth.uid())
  );

create policy "Users access own clinic"
  on public.webhook_events for all
  using (
    clinic_id in (select clinic_id from public.profiles where id = auth.uid())
  );

create policy "Users access own clinic"
  on public.dead_letters for all
  using (
    clinic_id in (select clinic_id from public.profiles where id = auth.uid())
  );

create policy "Users access own clinic"
  on public.invoices for all
  using (
    clinic_id in (select clinic_id from public.profiles where id = auth.uid())
  );

-- ──────────────────────────────────────────
-- Seed Demo Data
-- ──────────────────────────────────────────

-- Insert demo clinic
insert into public.clinics (id, name, branch_name, phone, whatsapp_number, address)
values
  ('00000000-0000-0000-0000-000000000001', 'عيادات النخبة', 'الفرع الرئيسي - حي الملقا', '+966112345678', '+966501234567', 'حي الملقا، الرياض')
on conflict do nothing;

-- Insert demo services
insert into public.services (clinic_id, code, name_ar, price, currency, duration_min)
values
  ('00000000-0000-0000-0000-000000000001', 'DENT_CLEAN',    'تنظيف أسنان',     250, 'SAR', 45),
  ('00000000-0000-0000-0000-000000000001', 'DENT_CHECKUP',  'فحص أسنان',       150, 'SAR', 30),
  ('00000000-0000-0000-0000-000000000001', 'DENT_WHITENING','تبييض أسنان',     800, 'SAR', 60),
  ('00000000-0000-0000-0000-000000000001', 'DENT_FILLING',  'حشوة أسنان',     300, 'SAR', 30),
  ('00000000-0000-0000-0000-000000000001', 'DENT_BRACES',   'تقويم أسنان',    3500, 'SAR', 45)
on conflict do nothing;

-- Insert demo staff
insert into public.staff (clinic_id, name, title, specialty, available)
values
  ('00000000-0000-0000-0000-000000000001', 'د. ريم السيف',   'طبيبة أسنان',       'طب أسنان عام',           true),
  ('00000000-0000-0000-0000-000000000001', 'د. خالد المحسن', 'استشاري تقويم',    'تقويم الأسنان',          true),
  ('00000000-0000-0000-0000-000000000001', 'د. سارة العتيبي','طبيبة أسنان',       'طب أسنان الأطفال',        false)
on conflict do nothing;

-- Insert demo customers
insert into public.customers (id, clinic_id, name, phone, lead_status, source, tags)
values
  ('c0000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'نورة المحمد',   '+966501234567', 'active',        'whatsapp',  array['booking']),
  ('c0000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'خالد العتيبي', '+966552345678', 'human_needed', 'whatsapp',  array['cancel']),
  ('c0000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'سارة الناصر',   '+966533456789', 'booked',       'whatsapp',  array['booking']),
  ('c0000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'عبدالله القحطاني','+966544567890','booked',       'instagram', array['pricing']),
  ('c0000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'أحمد الدوسري', '+966555678901', 'new',          'google',    array['inquiry'])
on conflict do nothing;

-- Insert demo conversations
insert into public.conversations (id, clinic_id, customer_id, channel, last_message, human_needed, tags)
values
  ('conv-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'whatsapp', 'بكم تنظيف الأسنان؟ متاح موعد اليوم؟', false, array['booking']),
  ('conv-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002', 'whatsapp', 'أريد إلغاء موعدي غداً', true, array['cancel'])
on conflict do nothing;

-- Insert demo bookings
insert into public.bookings (id, clinic_id, customer_id, service_id, doctor_id, start_at, status, notes)
select
  'book-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  (select id from public.services where code = 'DENT_CLEAN'),
  (select id from public.staff where name = 'د. ريم السيف'),
  '2026-05-22T16:00:00+03:00',
  'confirmed',
  'تم الحجز عبر واتساب'
on conflict do nothing;

-- Insert demo reminders
insert into public.reminders (clinic_id, booking_id, customer_id, template_key, template_message, send_at, status)
values
  ('00000000-0000-0000-0000-000000000001', 'book-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '24h_before', 'تذكير: موعدك غداً الساعة 4:00 مساء في عيادات النخبة.', '2026-05-21T16:00:00+03:00', 'queued'),
  ('00000000-0000-0000-0000-000000000001', 'book-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', '2h_before',  'تذكير سريع: موعدك بعد ساعتين مع د. ريم السيف.', '2026-05-22T14:00:00+03:00', 'pending')
on conflict do nothing;

-- Insert demo invoices
insert into public.invoices (clinic_id, booking_id, customer_id, invoice_no, amount, currency, status, due_date)
values
  ('00000000-0000-0000-0000-000000000001', 'book-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'INV-001', 250, 'SAR', 'paid', '2026-05-22')
on conflict do nothing;
