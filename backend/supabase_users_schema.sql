-- Minimal MVP schema. The app assumes only these two tables and columns exist.
create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    name text,
    answers jsonb not null,
    age_group text,
    gender text,
    preferred_destination text default 'open',
    created_at timestamp with time zone not null default now()
);

create table if not exists public.groups (
    id uuid primary key default gen_random_uuid(),
    group_name text,
    members jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone not null default now()
);


-- Safe migration for existing Supabase projects.
alter table if exists public.users
    add column if not exists preferred_destination text default 'open';
