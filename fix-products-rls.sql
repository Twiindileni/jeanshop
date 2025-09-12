-- Fix RLS policies for products and product_images tables
-- Run this in your Supabase SQL Editor

-- Add admin policies for products table
CREATE POLICY "Admin manage products" ON public.products FOR ALL
USING ( public.is_admin(auth.uid()) ) WITH CHECK ( public.is_admin(auth.uid()) );

-- Add admin policies for product_images table  
CREATE POLICY "Admin manage product images" ON public.product_images FOR ALL
USING ( public.is_admin(auth.uid()) ) WITH CHECK ( public.is_admin(auth.uid()) );
