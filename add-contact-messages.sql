-- Contact messages table for storing form submissions
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  last_name text,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

alter table public.contact_messages enable row level security;

-- Only admins can read contact messages
create policy "Admin read contact messages" on public.contact_messages for select
  using ( public.is_admin(auth.uid()) );

-- Anyone can insert contact messages (public form)
create policy "Public insert contact messages" on public.contact_messages for insert
  with check ( true );

-- Only admins can update contact messages (mark as read)
create policy "Admin update contact messages" on public.contact_messages for update
  using ( public.is_admin(auth.uid()) ) with check ( public.is_admin(auth.uid()) );
