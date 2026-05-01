-- Ensure required columns/constraints for users table.
alter table if exists public.users
    add column if not exists session_id text,
    add column if not exists user_id text,
    add column if not exists name text,
    add column if not exists answers jsonb,
    add column if not exists age_group text,
    add column if not exists gender text,
    add column if not exists result jsonb;

create unique index if not exists users_session_id_unique_idx on public.users (session_id);
