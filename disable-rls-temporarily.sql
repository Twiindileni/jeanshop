-- Temporarily disable RLS to test orders
-- Run this in your Supabase SQL Editor

-- Disable RLS on orders table temporarily
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;

-- Disable RLS on order_items table temporarily  
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;

-- Check the status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('orders', 'order_items');
