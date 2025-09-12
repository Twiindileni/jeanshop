-- Fix order_items table structure
-- Run this in your Supabase SQL Editor

-- First, let's check the current structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add missing id column if it doesn't exist
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS id uuid PRIMARY KEY DEFAULT uuid_generate_v4();

-- Make size_id nullable since we don't have size selection yet
ALTER TABLE public.order_items 
ALTER COLUMN size_id DROP NOT NULL;

-- If the table doesn't exist at all, create it properly
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES public.products(id),
  size_id uuid REFERENCES public.sizes(id), -- Made nullable
  quantity int NOT NULL,
  price_cents bigint NOT NULL
);

-- Ensure RLS is enabled
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create simple RLS policy for order_items
DROP POLICY IF EXISTS "Allow all for authenticated users" ON public.order_items;
CREATE POLICY "Allow all for authenticated users" ON public.order_items 
FOR ALL 
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);
