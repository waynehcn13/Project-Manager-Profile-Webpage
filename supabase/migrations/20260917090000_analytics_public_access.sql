-- Lovable Cloud manages the Supabase service-role key internally and never
-- exposes it to the app's own deployment (Vercel), so analytics reads/writes
-- can't go through a service-role admin client like a self-managed Supabase
-- project would. Instead: pageviews are inserted with the public anon key
-- under a narrow insert-only RLS policy, and stats reads go through a
-- SECURITY DEFINER function that checks a passphrase stored in the database
-- (not an env var) before returning any rows — the anon key alone still
-- can't read analytics_events directly.

-- Anyone can record a pageview; nobody can read/update/delete rows directly
-- (no select/update/delete policy exists on this table).
create policy "anon_can_insert_analytics_events"
  on public.analytics_events
  for insert
  to anon, authenticated
  with check (true);

-- Not exposed via the PostgREST API (only the `public` schema is), so this
-- table is unreachable except from inside the SECURITY DEFINER function below.
create schema if not exists private;

create table if not exists private.app_secrets (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Set the passphrase once, from the Lovable/Supabase SQL editor:
--   insert into private.app_secrets (key, value) values ('stats_passphrase', '<your passphrase>')
--   on conflict (key) do update set value = excluded.value, updated_at = now();
-- Never commit the actual passphrase value to this repo.

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
