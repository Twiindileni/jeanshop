-- Check if order_items are being created
-- Run this in your Supabase SQL Editor

-- Check recent orders
SELECT 
  o.id as order_id,
  o.user_id,
  o.total_cents,
  o.created_at,
  oi.id as item_id,
  oi.product_id,
  oi.quantity,
  oi.price_cents,
  p.title as product_title
FROM public.orders o
LEFT JOIN public.order_items oi ON o.id = oi.order_id
LEFT JOIN public.products p ON oi.product_id = p.id
ORDER BY o.created_at DESC
LIMIT 10;

-- Check if order_items table exists and has data
SELECT COUNT(*) as total_order_items FROM public.order_items;

-- Check the structure of order_items table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'order_items' 
AND table_schema = 'public'
ORDER BY ordinal_position;
