-- Step 1: Create the contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  last_name text,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  is_read boolean NOT NULL DEFAULT false
);

-- Step 2: Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies
-- Allow anyone to insert contact messages (public form)
CREATE POLICY "Public insert contact messages" ON public.contact_messages 
  FOR INSERT WITH CHECK (true);

-- Only admins can read contact messages
CREATE POLICY "Admin read contact messages" ON public.contact_messages 
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Only admins can update contact messages (mark as read)
CREATE POLICY "Admin update contact messages" ON public.contact_messages 
  FOR UPDATE USING (public.is_admin(auth.uid())) 
  WITH CHECK (public.is_admin(auth.uid()));

-- Step 4: Test the setup (optional)
-- INSERT INTO public.contact_messages (name, email, subject, message) 
-- VALUES ('Test User', 'test@example.com', 'general', 'This is a test message');
