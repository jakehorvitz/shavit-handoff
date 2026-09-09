create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  ip text,
  user_agent text
);

-- Supports the Edge Function's per-IP rate-limit window query (ip + recent created_at).
create index if not exists leads_ip_created_at_idx on public.leads (ip, created_at desc);

alter table public.leads enable row level security;

-- Default-deny: RLS on + no policies + revoke all => the browser anon key can neither
-- read nor write. Only the Edge Function's service_role key (which bypasses RLS) writes.
revoke all on public.leads from anon;
revoke all on public.leads from authenticated;
