-- Fix admin access to view all user profiles in the admin dashboard
-- This adds the missing RLS policies that allow admins to see all users

-- Add policy for admins to view all profiles
CREATE POLICY "Admin can view all profiles" ON public.profiles 
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Add policy for admins to manage all profiles (update wallet, admin status, etc.)
CREATE POLICY "Admin can manage all profiles" ON public.profiles 
  FOR ALL USING (public.is_admin(auth.uid())) 
  WITH CHECK (public.is_admin(auth.uid()));
