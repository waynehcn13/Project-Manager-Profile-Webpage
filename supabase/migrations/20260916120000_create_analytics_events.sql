create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  session_id uuid not null,
  path text not null,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  device_type text,
  browser text,
  os text,
  screen_width integer,
  screen_height integer,
  language text,
  timezone text,
  country text,
  region text,
  city text
);

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_session_id_idx on public.analytics_events (session_id);
create index if not exists analytics_events_path_idx on public.analytics_events (path);

-- RLS is enabled with no policies: only the service-role key (used server-side
-- in the trackPageView server function) can read or write this table. Neither
-- the anon nor authenticated key can touch it via the public Supabase API.
alter table public.analytics_events enable row level security;
