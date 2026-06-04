-- One-way follows stored on each user row (no separate table).
-- Run in Supabase SQL Editor if the column is not added yet.

alter table users
add column if not exists following uuid[] not null default '{}';
