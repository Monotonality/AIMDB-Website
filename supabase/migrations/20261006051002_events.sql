-- Event calendar. Events are authored by admins and read by everyone, so the
-- only privilege granted to anon/authenticated is `select` on published rows.
-- Admins create, edit, publish, and delete only through the security definer
-- functions below, each of which checks the caller is an active admin.

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  location text,
  link text,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  all_day boolean not null default false,
  published boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- ends_at is exclusive: for timed events it is the moment the event stops, and
  -- for all-day events it is midnight after the event's final day. This is the
  -- convention FullCalendar uses, so the value maps straight onto the grid.
  constraint events_time_order check (ends_at > starts_at),
  constraint events_title_length check (char_length(title) between 1 and 120),
  constraint events_description_length check (
    description is null or char_length(description) <= 2000
  ),
  constraint events_location_length check (
    location is null or char_length(location) <= 200
  ),
  constraint events_link_length check (link is null or char_length(link) <= 500),
  constraint events_link_scheme check (link is null or link ~* '^https?://')
);

create index events_published_starts_at_idx
  on public.events (starts_at)
  where published;

create trigger events_set_updated_at
  before update on public.events
  for each row
  execute function private.set_updated_at();

alter table public.events enable row level security;
alter table public.events force row level security;

create policy events_select
  on public.events
  for select
  to anon, authenticated
  using (published or (select private.is_admin()));

revoke all on public.events from anon, authenticated;
grant select on public.events to anon, authenticated;

-- Times arrive as naive timestamps in the club's own timezone and are resolved
-- to an absolute instant here, so daylight saving is handled by the database
-- rather than by the browser that submitted the form. The `p_` prefix keeps the
-- parameter names from colliding with the columns of the same name.

create or replace function public.admin_create_event(
  p_title text,
  p_description text,
  p_location text,
  p_link text,
  p_starts_local timestamp,
  p_ends_local timestamp,
  p_all_day boolean,
  p_published boolean
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id uuid;
begin
  perform private.require_admin();

  if p_starts_local is null or p_ends_local is null then
    raise exception 'An event needs a start and an end.';
  end if;
  if p_ends_local <= p_starts_local then
    raise exception 'An event must end after it starts.';
  end if;

  insert into public.events (
    title,
    description,
    location,
    link,
    starts_at,
    ends_at,
    all_day,
    published,
    created_by
  )
  values (
    nullif(btrim(p_title), ''),
    nullif(btrim(p_description), ''),
    nullif(btrim(p_location), ''),
    nullif(btrim(p_link), ''),
    p_starts_local at time zone 'America/Chicago',
    p_ends_local at time zone 'America/Chicago',
    coalesce(p_all_day, false),
    coalesce(p_published, false),
    (select auth.uid())
  )
  returning id into new_id;

  return new_id;
end;
$$;

create or replace function public.admin_update_event(
  p_target uuid,
  p_title text,
  p_description text,
  p_location text,
  p_link text,
  p_starts_local timestamp,
  p_ends_local timestamp,
  p_all_day boolean,
  p_published boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();

  if p_starts_local is null or p_ends_local is null then
    raise exception 'An event needs a start and an end.';
  end if;
  if p_ends_local <= p_starts_local then
    raise exception 'An event must end after it starts.';
  end if;

  update public.events
  set
    title = nullif(btrim(p_title), ''),
    description = nullif(btrim(p_description), ''),
    location = nullif(btrim(p_location), ''),
    link = nullif(btrim(p_link), ''),
    starts_at = p_starts_local at time zone 'America/Chicago',
    ends_at = p_ends_local at time zone 'America/Chicago',
    all_day = coalesce(p_all_day, false),
    published = coalesce(p_published, false)
  where id = p_target;

  if not found then
    raise exception 'Event not found.';
  end if;
end;
$$;

create or replace function public.admin_delete_event(p_target uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();

  delete from public.events where id = p_target;

  if not found then
    raise exception 'Event not found.';
  end if;
end;
$$;

revoke all on function public.admin_create_event(
  text, text, text, text, timestamp, timestamp, boolean, boolean
) from public, anon;
revoke all on function public.admin_update_event(
  uuid, text, text, text, text, timestamp, timestamp, boolean, boolean
) from public, anon;
revoke all on function public.admin_delete_event(uuid) from public, anon;

grant execute on function public.admin_create_event(
  text, text, text, text, timestamp, timestamp, boolean, boolean
) to authenticated;
grant execute on function public.admin_update_event(
  uuid, text, text, text, text, timestamp, timestamp, boolean, boolean
) to authenticated;
grant execute on function public.admin_delete_event(uuid) to authenticated;
