-- Create premium_users table
create table if not exists public.premium_users (
  id uuid references auth.users on delete cascade primary key,
  is_premium boolean default true,
  premium_since timestamp with time zone default timezone('utc'::text, now()) not null,
  premium_until timestamp with time zone default timezone('utc'::text, now() + interval '1 year') not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS policies
alter table public.premium_users enable row level security;

-- Allow users to read their own premium status
create policy "Users can view own premium status"
  on public.premium_users for select
  using (auth.uid() = id);

-- Only allow service role to insert/update premium status
create policy "Only service role can insert premium status"
  on public.premium_users for insert
  using (auth.role() = 'service_role');

create policy "Only service role can update premium status"
  on public.premium_users for update
  using (auth.role() = 'service_role');

-- Insert your user as premium
insert into public.premium_users (id)
select id from auth.users where email = 'tepper.dawn.m@gmail.com'
on conflict (id) do update set
  is_premium = true,
  premium_until = timezone('utc'::text, now() + interval '1 year');