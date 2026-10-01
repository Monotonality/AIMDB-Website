-- Admin account management. Payment approval and membership are separate
-- decisions, and both are admin-only, as are role changes and deactivation.
-- These columns are never granted to `authenticated`; admins change them only
-- through the security definer functions below, each of which checks the
-- caller is an active admin.

alter table public.profiles add column deactivated_at timestamptz;

drop policy if exists applications_update_admin on public.applications;

alter table public.applications
  drop column verified_at,
  drop column verified_by;

alter table public.applications
  add column payment_verified boolean not null default false,
  add column payment_verified_at timestamptz,
  add column payment_verified_by uuid references public.profiles (id) on delete set null;

alter table public.applications drop constraint applications_status_check;
alter table public.applications
  add constraint applications_status_check check (status in ('draft', 'submitted'));

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
      and deactivated_at is null
  );
$$;

create or replace function private.is_active()
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
      and deactivated_at is null
  );
$$;

revoke all on function private.is_active() from public, anon;
grant execute on function private.is_active() to authenticated;

-- Deactivated accounts keep a valid access token until it expires, so writes
-- are refused at the policy level as well as by the login ban.
drop policy profiles_update_own on public.profiles;
create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id and deactivated_at is null)
  with check ((select auth.uid()) = id and deactivated_at is null);

drop policy applications_insert_own_draft on public.applications;
create policy applications_insert_own_draft
  on public.applications
  for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and status = 'draft'
    and (select private.is_active())
  );

drop policy applications_update_own_draft on public.applications;
create policy applications_update_own_draft
  on public.applications
  for update
  to authenticated
  using (
    (select auth.uid()) = user_id
    and status = 'draft'
    and (select private.is_active())
  )
  with check (
    (select auth.uid()) = user_id
    and status in ('draft', 'submitted')
  );

create or replace function private.complete_application()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status is not distinct from old.status then
    return new;
  end if;

  if old.status = 'submitted' then
    raise exception 'A submitted application cannot be reopened.';
  end if;

  if new.personal_email is null
     or new.phone is null
     or new.degree_level is null
     or new.transaction_id is null
     or not new.accepted_rules
     or not new.paid_fee
     or not new.accepted_communication then
    raise exception 'Application is incomplete.';
  end if;

  if not exists (
    select 1
    from public.profiles
    where id = new.user_id
      and first_name is not null
      and last_name is not null
      and academic_year is not null
      and major is not null
      and graduation_semester is not null
      and graduation_year is not null
  ) then
    raise exception 'Add your name, year, major, and graduation term on your account page first.';
  end if;

  new.submitted_at := now();
  return new;
end;
$$;

revoke all on function private.complete_application() from public, anon, authenticated;

create or replace function private.require_admin()
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'Only admins can manage accounts.';
  end if;
end;
$$;

revoke all on function private.require_admin() from public, anon, authenticated;

create or replace function public.admin_set_member(target uuid, member boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();

  update public.profiles set is_member = member where id = target;
  if not found then
    raise exception 'Account not found.';
  end if;
end;
$$;

create or replace function public.admin_set_payment_verified(target uuid, verified boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();

  update public.applications
  set
    payment_verified = verified,
    payment_verified_at = case when verified then now() end,
    payment_verified_by = case when verified then auth.uid() end
  where user_id = target and status = 'submitted';

  if not found then
    raise exception 'This account has no submitted application.';
  end if;
end;
$$;

create or replace function public.admin_set_role(target uuid, new_role text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();

  if new_role not in ('admin', 'user') then
    raise exception 'Unknown role.';
  end if;
  if target = auth.uid() then
    raise exception 'You cannot change your own role.';
  end if;

  update public.profiles set role = new_role where id = target;
  if not found then
    raise exception 'Account not found.';
  end if;

  update auth.users
  set raw_app_meta_data =
    coalesce(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', new_role)
  where id = target;
end;
$$;

create or replace function public.admin_set_active(target uuid, active boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform private.require_admin();

  if target = auth.uid() then
    raise exception 'You cannot deactivate your own account.';
  end if;

  update public.profiles
  set deactivated_at = case when active then null else now() end
  where id = target;
  if not found then
    raise exception 'Account not found.';
  end if;

  update auth.users
  set banned_until = case when active then null else now() + interval '100 years' end
  where id = target;

  if not active then
    delete from auth.sessions where user_id = target;
  end if;
end;
$$;

revoke all on function public.admin_set_member(uuid, boolean) from public, anon;
revoke all on function public.admin_set_payment_verified(uuid, boolean) from public, anon;
revoke all on function public.admin_set_role(uuid, text) from public, anon;
revoke all on function public.admin_set_active(uuid, boolean) from public, anon;

grant execute on function public.admin_set_member(uuid, boolean) to authenticated;
grant execute on function public.admin_set_payment_verified(uuid, boolean) to authenticated;
grant execute on function public.admin_set_role(uuid, text) to authenticated;
grant execute on function public.admin_set_active(uuid, boolean) to authenticated;
