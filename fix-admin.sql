-- Fix admin user script
-- Run this in your Supabase SQL Editor after creating the admin user

-- First, let's see what users exist
SELECT id, email, created_at FROM auth.users WHERE email = 'admin@jeans.com';

-- Update the admin profile to make them an admin
-- Replace 'USER_ID_HERE' with the actual user ID from the query above
UPDATE public.profiles 
SET is_admin = true, username = 'admin'
WHERE email = 'admin@jeans.com';

-- Verify the update worked
SELECT id, email, username, is_admin, created_at 
FROM public.profiles 
WHERE email = 'admin@jeans.com';

