-- Supabase grants anon/authenticated full table privileges by default, and a
-- column-level revoke does not narrow a table-level grant. Role and
-- membership are written only by the security definer triggers.

drop policy if exists profiles_update_own on public.profiles;

revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;

revoke all on table public.applications from anon, authenticated;
grant select on table public.applications to authenticated;
grant insert (
  user_id, status, full_name, academic_year, expected_graduation, major, technical_interests
) on table public.applications to authenticated;
grant update (
  user_id, status, full_name, academic_year, expected_graduation, major, technical_interests
) on table public.applications to authenticated;

-- Admins need to see who each account belongs to without reading auth.users.
alter table public.profiles add column if not exists email text;

update public.profiles p
set email = u.email
from auth.users u
where u.id = p.id and p.email is distinct from u.email;

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

  insert into public.profiles (id, email, role, is_member)
  values (
    new.id,
    new.email,
    assigned_role,
    assigned_role = 'admin'
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
    if new.full_name is null or btrim(new.full_name) = ''
       or new.academic_year is null
       or new.expected_graduation is null
       or new.major is null or btrim(new.major) = ''
       or new.technical_interests is null or btrim(new.technical_interests) = '' then
      raise exception 'Application is incomplete.';
    end if;

    new.submitted_at := now();

    update public.profiles
    set
      is_member = true,
      full_name = btrim(new.full_name),
      academic_year = new.academic_year,
      expected_graduation = new.expected_graduation,
      major = btrim(new.major)
    where id = new.user_id;
  end if;

  return new;
end;
$$;

revoke all on function private.complete_application() from public, anon, authenticated;
