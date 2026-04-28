-- MESSAGES TABLE
create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  sender_id uuid references auth.users(id) on delete cascade,
  channel_id uuid,
  receiver_id uuid,
  created_at timestamp with time zone default now()
);

-- CHANNELS TABLE
create table if not exists channels (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_by uuid references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

-- CHANNEL MEMBERS
create table if not exists channel_members (
  id uuid default gen_random_uuid() primary key,
  channel_id uuid references channels(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade
);

-- Enable RLS
alter table messages enable row level security;
alter table channels enable row level security;
alter table channel_members enable row level security;

-- Messages: user can send their own
create policy "Users can insert messages"
on messages for insert
with check (auth.uid() = sender_id);

-- Messages: user can read messages they are part of
create policy "Users can read messages"
on messages for select
using (
  auth.uid() = sender_id OR
  auth.uid() = receiver_id
);

