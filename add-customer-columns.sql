-- Add customer detail columns to orders table
-- Run this in your Supabase SQL Editor

-- Add the new columns
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS customer_name text,
ADD COLUMN IF NOT EXISTS customer_email text,
ADD COLUMN IF NOT EXISTS customer_phone text,
ADD COLUMN IF NOT EXISTS shipping_address text,
ADD COLUMN IF NOT EXISTS shipping_city text,
ADD COLUMN IF NOT EXISTS shipping_postal_code text,
ADD COLUMN IF NOT EXISTS shipping_country text DEFAULT 'Namibia',
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Update existing orders with default values for required fields
UPDATE public.orders 
SET 
  customer_name = 'Customer',
  customer_email = 'customer@example.com',
  shipping_address = 'Address not provided',
  shipping_city = 'City not provided',
  shipping_country = 'Namibia'
WHERE customer_name IS NULL;

-- Make required fields NOT NULL after setting defaults
ALTER TABLE public.orders 
ALTER COLUMN customer_name SET NOT NULL,
ALTER COLUMN customer_email SET NOT NULL,
ALTER COLUMN shipping_address SET NOT NULL,
ALTER COLUMN shipping_city SET NOT NULL;

-- Add admin policies for orders management
CREATE POLICY IF NOT EXISTS "Admin manage orders" ON public.orders FOR ALL
USING ( public.is_admin(auth.uid()) ) WITH CHECK ( public.is_admin(auth.uid()) );

-- Add admin policies for order_items management  
CREATE POLICY IF NOT EXISTS "Admin manage order items" ON public.order_items FOR ALL
USING ( public.is_admin(auth.uid()) ) WITH CHECK ( public.is_admin(auth.uid()) );
