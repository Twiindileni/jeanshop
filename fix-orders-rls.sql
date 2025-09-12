-- Fix RLS policies for orders table to allow INSERT operations
-- Run this in your Supabase SQL Editor

-- First, let's see what policies currently exist
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
-- FROM pg_policies 
-- WHERE tablename = 'orders';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Own orders read" ON public.orders;
DROP POLICY IF EXISTS "Own orders insert" ON public.orders;
DROP POLICY IF EXISTS "Own orders update" ON public.orders;
DROP POLICY IF EXISTS "Own orders delete" ON public.orders;

-- Create comprehensive policies for orders table
CREATE POLICY "Users can read own orders" ON public.orders 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own orders" ON public.orders 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own orders" ON public.orders 
FOR UPDATE 
USING (user_id = auth.uid()) 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own orders" ON public.orders 
FOR DELETE 
USING (user_id = auth.uid());

-- Admin policies for full access
CREATE POLICY "Admin manage orders" ON public.orders 
FOR ALL 
USING (public.is_admin(auth.uid())) 
WITH CHECK (public.is_admin(auth.uid()));

-- Fix order_items policies as well
DROP POLICY IF EXISTS "Own order items read" ON public.order_items;
DROP POLICY IF EXISTS "Own order items insert" ON public.order_items;
DROP POLICY IF EXISTS "Own order items update" ON public.order_items;
DROP POLICY IF EXISTS "Own order items delete" ON public.order_items;

CREATE POLICY "Users can read own order items" ON public.order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.orders o 
    WHERE o.id = order_id AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert own order items" ON public.order_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o 
    WHERE o.id = order_id AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update own order items" ON public.order_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders o 
    WHERE o.id = order_id AND o.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o 
    WHERE o.id = order_id AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own order items" ON public.order_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.orders o 
    WHERE o.id = order_id AND o.user_id = auth.uid()
  )
);

-- Admin policies for order_items
CREATE POLICY "Admin manage order items" ON public.order_items 
FOR ALL 
USING (public.is_admin(auth.uid())) 
WITH CHECK (public.is_admin(auth.uid()));
