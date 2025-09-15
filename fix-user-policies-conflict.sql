-- Fix potential RLS policy conflicts for user profiles
-- Drop existing policies and recreate them properly

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Public profiles are viewable by owner" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Recreate policies with proper precedence
-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

-- Policy 2: Admins can view ALL profiles (this should take precedence)
CREATE POLICY "Admins can view all profiles" ON public.profiles 
  FOR SELECT USING (public.is_admin(auth.uid()));

-- Policy 3: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy 4: Users can update their own profile  
CREATE POLICY "Users can update own profile" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Policy 5: Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" ON public.profiles 
  FOR ALL USING (public.is_admin(auth.uid())) 
  WITH CHECK (public.is_admin(auth.uid()));
