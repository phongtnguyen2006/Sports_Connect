-- Run in Supabase SQL Editor before using the friends feature.
create table if not exists friends (
  user_id uuid not null references users (id) on delete cascade,
  friend_id uuid not null references users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

create index if not exists friends_user_id_idx on friends (user_id);
