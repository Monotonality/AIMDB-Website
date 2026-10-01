-- The application becomes the membership form: contact details, degree level,
-- the Zelle transaction ID for the lifetime fee, and declarations.
-- Submitting no longer grants membership; an admin verifying the payment does.

alter table public.applications drop column technical_interests;

alter table public.applications
  add column personal_email text,
  add column phone text,
  add column degree_level text,
  add column transaction_id text,
  add column accepted_rules boolean not null default false,
  add column paid_fee boolean not null default false,
  add column accepted_communication boolean not null default false,
  add column verified_at timestamptz,
  add column verified_by uuid references public.profiles (id) on delete set null;

alter table public.applications drop constraint applications_status_check;

alter table public.applications
  add constraint applications_status_check
    check (status in ('draft', 'submitted', 'verified')),
  add constraint applications_personal_email_check
    check (
      personal_email is null
      or (
        char_length(personal_email) <= 254
        and personal_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
      )
    ),
  add constraint applications_phone_check
    check (phone is null or phone ~ '^\+?[0-9]{10,15}$'),
  add constraint applications_degree_level_check
    check (degree_level is null or degree_level in ('bs', 'ms', 'phd')),
  add constraint applications_transaction_id_check
    check (transaction_id is null or char_length(btrim(transaction_id)) between 1 and 100);

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

  if old.status = 'verified' then
    raise exception 'A verified application cannot be changed.';
  end if;

  if new.status = 'submitted' then
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
  elsif new.status = 'verified' then
    if old.status <> 'submitted' then
      raise exception 'Only submitted applications can be verified.';
    end if;
    if not private.is_admin() then
      raise exception 'Only admins can verify payments.';
    end if;

    new.verified_at := now();
    new.verified_by := auth.uid();

    update public.profiles
    set is_member = true
    where id = new.user_id;
  end if;

  return new;
end;
$$;

revoke all on function private.complete_application() from public, anon, authenticated;

create policy applications_update_admin
  on public.applications
  for update
  to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

grant insert (
  user_id, status, personal_email, phone, degree_level, transaction_id,
  accepted_rules, paid_fee, accepted_communication
) on table public.applications to authenticated;

grant update (
  user_id, status, personal_email, phone, degree_level, transaction_id,
  accepted_rules, paid_fee, accepted_communication
) on table public.applications to authenticated;
