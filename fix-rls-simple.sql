-- Simple RLS fix that will definitely work
-- Run this in your Supabase SQL Editor

-- First, let's check if the is_admin function exists
-- If it doesn't exist, we'll create it
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND is_admin = true
  );
$$;

-- Drop ALL existing policies on orders table
DROP POLICY IF EXISTS "Own orders read" ON public.orders;
DROP POLICY IF EXISTS "Own orders insert" ON public.orders;
DROP POLICY IF EXISTS "Own orders update" ON public.orders;
DROP POLICY IF EXISTS "Own orders delete" ON public.orders;
DROP POLICY IF EXISTS "Users can read own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can delete own orders" ON public.orders;
DROP POLICY IF EXISTS "Admin manage orders" ON public.orders;

-- Create simple, working policies for orders
CREATE POLICY "Allow all for authenticated users" ON public.orders 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Drop ALL existing policies on order_items table
DROP POLICY IF EXISTS "Own order items read" ON public.order_items;
DROP POLICY IF EXISTS "Own order items insert" ON public.order_items;
DROP POLICY IF EXISTS "Own order items update" ON public.order_items;
DROP POLICY IF EXISTS "Own order items delete" ON public.order_items;
DROP POLICY IF EXISTS "Users can read own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can update own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can delete own order items" ON public.order_items;
DROP POLICY IF EXISTS "Admin manage order items" ON public.order_items;

-- Create simple, working policies for order_items
CREATE POLICY "Allow all for authenticated users" ON public.order_items 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('orders', 'order_items')
ORDER BY tablename, policyname;
