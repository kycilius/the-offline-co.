-- Minimal MVP schema. The app assumes only these two tables and columns exist.
create table if not exists public.users (
    id uuid primary key default gen_random_uuid(),
    name text,
    answers jsonb not null,
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
