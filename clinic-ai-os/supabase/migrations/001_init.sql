-- 001_init.sql
-- Supabase/Postgres schema for Clinic AI OS MVP
-- Run as migration (psql or supabase migrations)

BEGIN;

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ENUM types
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'lead_status') THEN
        CREATE TYPE lead_status AS ENUM ('new','contacted','booked','no_show','completed','lost');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM ('pending','confirmed','cancelled','completed','no_show');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('unpaid','partially_paid','paid','refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reminder_status') THEN
        CREATE TYPE reminder_status AS ENUM ('pending','sent','failed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('owner','receptionist','doctor');
    END IF;
END$$;

-- clinics
CREATE TABLE IF NOT EXISTS clinics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE,
  address text,
  phone text,
  timezone text DEFAULT 'Asia/Riyadh',
  settings jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- profiles (maps to auth.users.id)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY, -- should match auth.users.id
  full_name text,
  email text,
  role user_role DEFAULT 'receptionist',
  clinic_id uuid REFERENCES clinics(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- branches
CREATE TABLE IF NOT EXISTS branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text,
  phone text,
  working_hours jsonb DEFAULT '[]', -- store weekly schedule per branch
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- services
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  duration_minutes int NOT NULL DEFAULT 30,
  price numeric(12,2) DEFAULT 0,
  currency text DEFAULT 'SAR',
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- staff (doctors and staff members)
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  email text,
  phone text,
  title text,
  bio text,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- customers
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  email text,
  gender text,
  date_of_birth date,
  tags text[],
  lead_status lead_status DEFAULT 'new',
  source text,
  last_interaction timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customers_unique_phone_per_clinic UNIQUE (clinic_id, phone)
);

-- conversations
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  channel text DEFAULT 'whatsapp',
  external_id text, -- e.g. whatsapp conversation id
  last_message text,
  human_needed boolean DEFAULT false,
  tags text[],
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- messages
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  direction text CHECK (direction IN ('inbound','outbound')) DEFAULT 'inbound',
  body text,
  media jsonb,
  external_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_created_at ON messages (conversation_id, created_at DESC);

-- bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  branch_id uuid REFERENCES branches(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  doctor_id uuid REFERENCES staff(id) ON DELETE SET NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz,
  status booking_status DEFAULT 'pending',
  payment_status payment_status DEFAULT 'unpaid',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_clinic_start ON bookings (clinic_id, start_at);

-- invoices
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  invoice_number bigint NOT NULL DEFAULT nextval('invoices_number_seq'),
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  subtotal numeric(12,2) DEFAULT 0,
  discount numeric(12,2) DEFAULT 0,
  tax numeric(12,2) DEFAULT 0,
  total numeric(12,2) DEFAULT 0,
  currency text DEFAULT 'SAR',
  payment_status payment_status DEFAULT 'unpaid',
  issued_at timestamptz DEFAULT now(),
  paid_at timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- invoice items
CREATE TABLE IF NOT EXISTS invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE,
  description text NOT NULL,
  quantity int DEFAULT 1,
  unit_price numeric(12,2) DEFAULT 0,
  total numeric(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- reminders
CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  template_key text,
  template_message text,
  send_at timestamptz NOT NULL,
  status reminder_status DEFAULT 'pending',
  retry_count int DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reminders_status_sendat ON reminders (status, send_at);

-- ai_logs
CREATE TABLE IF NOT EXISTS ai_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid REFERENCES clinics(id) ON DELETE SET NULL,
  conversation_id uuid REFERENCES conversations(id) ON DELETE SET NULL,
  user_input text,
  ai_response jsonb,
  action text,
  confidence numeric(5,4),
  tokens_used int,
  status text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- followups
CREATE TABLE IF NOT EXISTS followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES customers(id) ON DELETE SET NULL,
  booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  note text,
  due_at timestamptz,
  completed boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- settings (keyed settings per clinic)
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  key text NOT NULL,
  value jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (clinic_id, key)
);

-- webhook events & dead letters
CREATE TABLE IF NOT EXISTS webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id uuid,
  source text,
  event jsonb,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed boolean DEFAULT false,
  error text
);

CREATE TABLE IF NOT EXISTS dead_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text,
  payload jsonb,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- invoice number sequence
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'invoices_number_seq') THEN
        CREATE SEQUENCE invoices_number_seq START 1000 OWNED BY invoices.invoice_number;
    END IF;
END$$;

-- updated_at trigger helper
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to tables that have updated_at
DO $$
DECLARE tbl text;
BEGIN
  FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN (
    'clinics','profiles','branches','services','staff','customers','conversations','bookings','invoices','reminders','followups','settings'
  )
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_timestamp ON %I', tbl);
    EXECUTE format('CREATE TRIGGER set_timestamp BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp()', tbl);
  END LOOP;
END$$;

-- Indexes for quick lookups
CREATE INDEX IF NOT EXISTS idx_customers_clinic_phone ON customers (clinic_id, phone);
CREATE INDEX IF NOT EXISTS idx_bookings_doctor_start ON bookings (doctor_id, start_at);
CREATE INDEX IF NOT EXISTS idx_invoices_clinic_number ON invoices (clinic_id, invoice_number);

-- Row Level Security (RLS) examples
-- NOTE: These policies are minimal examples. Adjust roles and checks per your auth model.

-- Enable RLS where sensitive
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- profiles: user can manage their own profile
CREATE POLICY "profiles_is_owner" ON profiles
  FOR ALL
  USING ( auth.uid() = id )
  WITH CHECK ( auth.uid() = id );

-- helper policy function to check user belongs to clinic
CREATE OR REPLACE FUNCTION user_belongs_to_clinic(clinic_uuid uuid)
RETURNS boolean LANGUAGE sql STABLE AS $$
  SELECT EXISTS(SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.clinic_id = clinic_uuid);
$$;

-- customers: allow access if user's profile has same clinic_id
CREATE POLICY "customers_clinic_access" ON customers
  FOR ALL
  USING ( user_belongs_to_clinic(clinic_id) )
  WITH CHECK ( user_belongs_to_clinic(clinic_id) );

-- bookings
CREATE POLICY "bookings_clinic_access" ON bookings
  FOR ALL
  USING ( user_belongs_to_clinic(clinic_id) )
  WITH CHECK ( user_belongs_to_clinic(clinic_id) );

-- invoices
CREATE POLICY "invoices_clinic_access" ON invoices
  FOR ALL
  USING ( user_belongs_to_clinic(clinic_id) )
  WITH CHECK ( user_belongs_to_clinic(clinic_id) );

-- reminders
CREATE POLICY "reminders_clinic_access" ON reminders
  FOR ALL
  USING ( user_belongs_to_clinic(clinic_id) )
  WITH CHECK ( user_belongs_to_clinic(clinic_id) );

-- conversations & messages (allow if conversation belongs to clinic)
CREATE POLICY "conversations_clinic_access" ON conversations
  FOR ALL
  USING ( user_belongs_to_clinic(clinic_id) )
  WITH CHECK ( user_belongs_to_clinic(clinic_id) );

CREATE POLICY "messages_conversation_access" ON messages
  FOR SELECT
  USING ( EXISTS ( SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND user_belongs_to_clinic(c.clinic_id) ) );

-- Admin exception: owners can access clinic row (example)
-- You may create a roles system and additional policies for cross-clinic admins.

COMMIT;
