-- Enable real-time subscriptions for orders table
-- Run this in your Supabase SQL Editor

-- Enable real-time for orders table
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Enable real-time for order_items table
ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;

-- Verify real-time is enabled
SELECT schemaname, tablename, hasreplication 
FROM pg_tables 
WHERE tablename IN ('orders', 'order_items') 
AND schemaname = 'public';
