-- The single combined select policy on `events` was written as
--
--   using (published or (select private.is_admin()))
--
-- but the table is also readable by `anon`, and `private.is_admin()` has execute
-- revoked from `public` and `anon` (see 20261001120000_accounts.sql). Postgres
-- evaluates every branch of the expression, so a logged-out visitor reading
-- `/events` failed with `permission denied for function is_admin` and the whole
-- query errored out rather than just returning published rows.
--
-- Splitting the policy keeps both behaviours: the published branch is
-- `anon`-safe and needs no helper function, while draft rows stay behind a
-- second policy that only `authenticated` can evaluate.

drop policy events_select on public.events;

create policy events_select_published
  on public.events
  for select
  to anon, authenticated
  using (published);

create policy events_select_admin
  on public.events
  for select
  to authenticated
  using ((select private.is_admin()));