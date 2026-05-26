-- Nasaq production hardening
-- Fixes adapter/schema mismatches before real clinic pilots.

begin;

-- Supabase upsert needs a real conflict target. One WhatsApp conversation per
-- clinic + external id keeps inbound webhook retries idempotent.
delete from public.conversations a
using public.conversations b
where a.id > b.id
  and a.clinic_id = b.clinic_id
  and a.external_id is not null
  and a.external_id = b.external_id;

create unique index if not exists conversations_clinic_external_id_unique
  on public.conversations (clinic_id, external_id);

-- Older migrations created dead_letters with source/reason only. Store adapter
-- writes clinic_id/kind/payload/error.
alter table public.dead_letters
  add column if not exists clinic_id uuid references public.clinics(id) on delete cascade,
  add column if not exists kind text,
  add column if not exists payload jsonb,
  add column if not exists error text;

update public.dead_letters
set kind = coalesce(kind, source, 'unknown'),
    error = coalesce(error, reason)
where kind is null or error is null;

alter table public.dead_letters enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'dead_letters'
      and policyname = 'dead_letters_clinic_access'
  ) then
    create policy dead_letters_clinic_access on public.dead_letters
      for all
      using (user_belongs_to_clinic(clinic_id))
      with check (user_belongs_to_clinic(clinic_id));
  end if;
end $$;

commit;
