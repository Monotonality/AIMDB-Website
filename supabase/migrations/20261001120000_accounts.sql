-- Accounts, first-user admin, and applications.
-- Membership is granted only after a complete application is submitted.
-- Role lives on public.profiles (and mirrored into auth app_metadata),
-- never in user_metadata.

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;
grant usage on schema private to postgres, supabase_auth_admin;

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'user')),
  is_member boolean not null default false,
  full_name text,
  academic_year text
    check (
      academic_year is null
      or academic_year in ('freshman', 'sophomore', 'junior', 'senior', 'graduate')
    ),
  expected_graduation date,
  major text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.applications (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  status text not null default 'draft' check (status in ('draft', 'submitted')),
  full_name text,
  academic_year text
    check (
      academic_year is null
      or academic_year in ('freshman', 'sophomore', 'junior', 'senior', 'graduate')
    ),
  expected_graduation date,
  major text,
  technical_interests text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index applications_user_id_idx on public.applications (user_id);

create or replace function private.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function private.set_updated_at();

create trigger applications_set_updated_at
  before update on public.applications
  for each row
  execute function private.set_updated_at();

-- .edu emails only. Runs as the inserting auth role.
create or replace function private.enforce_edu_email()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.email is null
     or new.email !~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.edu$' then
    raise exception 'An .edu email address is required.';
  end if;
  return new;
end;
$$;

revoke all on function private.enforce_edu_email() from public, anon, authenticated;
grant execute on function private.enforce_edu_email() to supabase_auth_admin;

create trigger enforce_edu_email
  before insert on auth.users
  for each row
  execute function private.enforce_edu_email();

-- First created account becomes admin and a member. Everyone else is
-- an account holder until they submit an application.
create or replace function private.before_user_created_set_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  is_first boolean;
begin
  perform pg_advisory_xact_lock(87261401);
  select not exists (select 1 from public.profiles) into is_first;

  if is_first then
    new.raw_app_meta_data :=
      coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb;
  else
    new.raw_app_meta_data :=
      coalesce(new.raw_app_meta_data, '{}'::jsonb) || '{"role":"user"}'::jsonb;
  end if;

  return new;
end;
$$;

revoke all on function private.before_user_created_set_role() from public, anon, authenticated;
grant execute on function private.before_user_created_set_role() to supabase_auth_admin;

create trigger before_user_created_set_role
  before insert on auth.users
  for each row
  execute function private.before_user_created_set_role();

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  assigned_role text;
begin
  assigned_role := coalesce(new.raw_app_meta_data->>'role', 'user');

  insert into public.profiles (id, role, is_member)
  values (
    new.id,
    assigned_role,
    assigned_role = 'admin'
  );

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
grant execute on function private.handle_new_user() to supabase_auth_admin;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function private.handle_new_user();

create or replace function private.complete_application()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'submitted' and (old.status is distinct from 'submitted') then
    if new.full_name is null or btrim(new.full_name) = ''
       or new.academic_year is null
       or new.expected_graduation is null
       or new.major is null or btrim(new.major) = ''
       or new.technical_interests is null or btrim(new.technical_interests) = '' then
      raise exception 'Application is incomplete.';
    end if;

    new.submitted_at := coalesce(new.submitted_at, now());

    update public.profiles
    set
      is_member = true,
      full_name = btrim(new.full_name),
      academic_year = new.academic_year,
      expected_graduation = new.expected_graduation,
      major = btrim(new.major),
      updated_at = now()
    where id = new.user_id;
  end if;

  return new;
end;
$$;

revoke all on function private.complete_application() from public, anon, authenticated;

create trigger complete_application
  before update on public.applications
  for each row
  execute function private.complete_application();

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated, supabase_auth_admin;

alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.profiles force row level security;
alter table public.applications force row level security;

create policy profiles_select_own_or_admin
  on public.profiles
  for select
  to authenticated
  using (
    (select auth.uid()) = id
    or (select private.is_admin())
  );

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy applications_select_own_or_admin
  on public.applications
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id
    or (select private.is_admin())
  );

create policy applications_insert_own_draft
  on public.applications
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and status = 'draft'
  );

create policy applications_update_own_draft
  on public.applications
  for update
  to authenticated
  using (
    (select auth.uid()) = user_id
    and status = 'draft'
  )
  with check (
    (select auth.uid()) = user_id
    and status in ('draft', 'submitted')
  );

grant usage on schema public to authenticated, anon;

grant select, update on table public.profiles to authenticated;
revoke update (role, is_member) on table public.profiles from authenticated;

grant select, insert, update on table public.applications to authenticated;

grant select, insert, update, delete on table public.profiles to service_role;
grant select, insert, update, delete on table public.applications to service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;
