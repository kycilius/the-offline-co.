-- Ensure required columns/constraints for users table.
alter table if exists public.users
    add column if not exists name text,
    add column if not exists answers jsonb,
    add column if not exists age_group text,
    add column if not exists gender text,
    add column if not exists created_at timestamp with time zone not null default now();

create table if not exists public.groups (
    id uuid primary key default gen_random_uuid(),
    group_name text,
    members jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone not null default now()
);
