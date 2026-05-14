-- Minimal schema for MVP.
create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    name text,
    answers jsonb,
    age_group text,
    gender text,
    created_at timestamp with time zone not null default now()
);

create table if not exists public.groups (
    id uuid primary key default gen_random_uuid(),
    group_name text,
    members jsonb not null default '[]'::jsonb,
    created_at timestamp with time zone not null default now()
);
