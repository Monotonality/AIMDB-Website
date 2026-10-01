-- Academic year joins the other signup details on public.profiles, where the
-- owner can edit it. Applications keep only technical interests.

alter table public.applications drop column academic_year;

alter table public.profiles drop constraint profiles_details_required;

-- NOT VALID: see 20261001140000_profile_details.sql.
alter table public.profiles
  add constraint profiles_details_required
    check (
      first_name is not null
      and last_name is not null
      and academic_year is not null
      and major is not null
      and graduation_semester is not null
      and graduation_year is not null
    ) not valid;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  assigned_role text;
  meta jsonb;
begin
  assigned_role := coalesce(new.raw_app_meta_data->>'role', 'user');
  meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);

  insert into public.profiles (
    id, email, role, is_member,
    first_name, last_name, academic_year, major,
    graduation_semester, graduation_year
  )
  values (
    new.id,
    new.email,
    assigned_role,
    assigned_role = 'admin',
    nullif(btrim(meta->>'first_name'), ''),
    nullif(btrim(meta->>'last_name'), ''),
    nullif(lower(btrim(meta->>'academic_year')), ''),
    nullif(btrim(meta->>'major'), ''),
    nullif(lower(btrim(meta->>'graduation_semester')), ''),
    case
      when coalesce(meta->>'graduation_year', '') ~ '^\d{4}$'
        then (meta->>'graduation_year')::smallint
    end
  );

  return new;
end;
$$;

revoke all on function private.handle_new_user() from public, anon, authenticated;
grant execute on function private.handle_new_user() to supabase_auth_admin;

create or replace function private.complete_application()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'submitted' and (old.status is distinct from 'submitted') then
    if new.technical_interests is null or btrim(new.technical_interests) = '' then
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

    update public.profiles
    set is_member = true
    where id = new.user_id;
  end if;

  return new;
end;
$$;

revoke all on function private.complete_application() from public, anon, authenticated;

grant update (academic_year) on table public.profiles to authenticated;
