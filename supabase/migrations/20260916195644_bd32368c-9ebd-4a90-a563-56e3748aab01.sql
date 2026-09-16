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

grant insert on public.analytics_events to anon, authenticated;
grant all on public.analytics_events to service_role;

create index if not exists analytics_events_created_at_idx on public.analytics_events (created_at desc);
create index if not exists analytics_events_session_id_idx on public.analytics_events (session_id);
create index if not exists analytics_events_path_idx on public.analytics_events (path);

alter table public.analytics_events enable row level security;

create policy "anon_can_insert_analytics_events"
  on public.analytics_events
  for insert
  to anon, authenticated
  with check (true);

create schema if not exists private;

create table if not exists private.app_secrets (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create or replace function public.get_analytics_events(passphrase text, range_days integer default 30)
returns table (
  created_at timestamptz,
  session_id uuid,
  path text,
  referrer text,
  device_type text,
  browser text,
  os text,
  country text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  expected text;
  clamped_days integer;
begin
  select value into expected from private.app_secrets where key = 'stats_passphrase';

  if expected is null then
    raise exception 'Stats page is not configured: set the stats_passphrase secret in the database';
  end if;

  if passphrase is distinct from expected then
    raise exception 'Unauthorized';
  end if;

  clamped_days := greatest(1, least(coalesce(range_days, 30), 90));

  return query
    select e.created_at, e.session_id, e.path, e.referrer, e.device_type, e.browser, e.os, e.country
    from public.analytics_events e
    where e.created_at >= now() - (clamped_days || ' days')::interval
    order by e.created_at desc
    limit 20000;
end;
$$;

revoke all on function public.get_analytics_events(text, integer) from public;
grant execute on function public.get_analytics_events(text, integer) to anon, authenticated;