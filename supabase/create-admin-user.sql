-- Create admin user script
-- Run this AFTER running the main schema.sql

-- First, create the user in auth.users
-- Note: You might need to run this through the Supabase Auth API instead of direct SQL
-- This is a fallback method that may not work in all Supabase setups

-- Method 1: Direct SQL insertion (may not work in newer Supabase versions)
-- Uncomment the following if direct insertion works:

/*
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@jeans.com',
  crypt('admin@4321', gen_salt('bf')),
  now(),
  null,
  null,
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);
*/

-- Method 2: Manual profile creation (run this after creating user through Supabase Auth)
-- This assumes you've already created the user through the Supabase dashboard or Auth API

-- First, get the user ID (you'll need to replace this with the actual user ID)
-- You can find this in the Supabase Auth dashboard after creating the user

-- Uncomment and replace 'USER_ID_HERE' with the actual user ID:
/*
UPDATE public.profiles 
SET is_admin = true, username = 'admin'
WHERE email = 'admin@jeans.com';
*/

-- Method 3: Create admin user through Supabase Dashboard
-- 1. Go to Authentication > Users in your Supabase dashboard
-- 2. Click "Add user"
-- 3. Enter email: admin@jeans.com
-- 4. Enter password: admin@4321
-- 5. Click "Create user"
-- 6. Then run the UPDATE statement above to make them an admin

-- Verify the admin user was created correctly
SELECT 
  p.id,
  p.email,
  p.username,
  p.is_admin,
  p.created_at
FROM public.profiles p
WHERE p.email = 'admin@jeans.com';

