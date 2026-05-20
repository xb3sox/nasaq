-- 002_upsert_customer.sql
-- RPC function: upsert_customer_by_phone
-- Inserts or updates a customer by (clinic_id, phone). Returns the customer row.

BEGIN;

CREATE OR REPLACE FUNCTION upsert_customer_by_phone(p_clinic_id uuid, p_phone text, p_name text)
RETURNS TABLE(id uuid, clinic_id uuid, name text, phone text, whatsapp text, email text, lead_status lead_status, created_at timestamptz, updated_at timestamptz)
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid;
BEGIN
  IF p_phone IS NULL THEN
    RAISE EXCEPTION 'phone required';
  END IF;

  -- Try update first
  UPDATE customers
  SET name = COALESCE(p_name, name),
      whatsapp = COALESCE(whatsapp, p_phone),
      updated_at = now()
  WHERE clinic_id = p_clinic_id AND phone = p_phone
  RETURNING id INTO v_id;

  IF v_id IS NULL THEN
    INSERT INTO customers (clinic_id, name, phone, whatsapp, created_at, updated_at)
    VALUES (p_clinic_id, p_name, p_phone, p_phone, now(), now())
    RETURNING id INTO v_id;
  END IF;

  RETURN QUERY SELECT id, clinic_id, name, phone, whatsapp, email, lead_status, created_at, updated_at FROM customers WHERE id = v_id;
END;
$$;

COMMIT;
