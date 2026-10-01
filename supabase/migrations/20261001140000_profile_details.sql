-- Name, graduation term, and major are collected at signup and live only on
-- public.profiles, where the owner can edit them. Applications keep only what
-- is specific to applying.

alter table public.profiles
  add column first_name text,
  add column last_name text,
  add column graduation_semester text,
  add column graduation_year smallint;

update public.profiles
set
  first_name = nullif(split_part(btrim(full_name), ' ', 1), ''),
  last_name = nullif(btrim(substr(btrim(full_name), length(split_part(btrim(full_name), ' ', 1)) + 1)), '')
where full_name is not null;

update public.profiles
set
  graduation_semester = case
    when extract(month from expected_graduation) <= 5 then 'spring'
    when extract(month from expected_graduation) <= 7 then 'summer'
    else 'fall'
  end,
  graduation_year = extract(year from expected_graduation)::smallint
where expected_graduation is not null;

alter table public.profiles
  drop column full_name,
  drop column expected_graduation;

alter table public.applications
  drop column full_name,
  drop column expected_graduation,
  drop column major;

alter table public.profiles
  add constraint profiles_first_name_check
    check (first_name is null or char_length(btrim(first_name)) between 1 and 80),
  add constraint profiles_last_name_check
    check (last_name is null or char_length(btrim(last_name)) between 1 and 80),
  add constraint profiles_major_check
    check (major is null or char_length(btrim(major)) between 1 and 120),
  add constraint profiles_graduation_semester_check
    check (graduation_semester is null or graduation_semester in ('spring', 'summer', 'fall')),
  add constraint profiles_graduation_year_check
    check (graduation_year is null or graduation_year between 2000 and 2100);

-- NOT VALID: enforced for every new or updated row, so signups without these
-- details are rejected, while accounts created before this migration stay
-- readable until their owner fills the details in.
alter table public.profiles
  add constraint profiles_details_required
    check (
      first_name is not null
      and last_name is not null
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
    first_name, last_name, major, graduation_semester, graduation_year
  )
  values (
    new.id,
    new.email,
    assigned_role,
    assigned_role = 'admin',
    nullif(btrim(meta->>'first_name'), ''),
    nullif(btrim(meta->>'last_name'), ''),
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
    if new.academic_year is null
       or new.technical_interests is null or btrim(new.technical_interests) = '' then
      raise exception 'Application is incomplete.';
    end if;

    if not exists (
      select 1
      from public.profiles
      where id = new.user_id
        and first_name is not null
        and last_name is not null
        and major is not null
        and graduation_semester is not null
        and graduation_year is not null
    ) then
      raise exception 'Add your name, major, and graduation term on your account page first.';
    end if;

    new.submitted_at := now();

    update public.profiles
    set
      is_member = true,
      academic_year = new.academic_year
    where id = new.user_id;
  end if;

  return new;
end;
$$;

revoke all on function private.complete_application() from public, anon, authenticated;

grant update (first_name, last_name, major, graduation_semester, graduation_year)
  on table public.profiles to authenticated;

create policy profiles_update_own
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);
