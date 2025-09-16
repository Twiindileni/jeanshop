-- Delete All Products Script (SQL Version)
-- 
-- Run this in your Supabase SQL Editor to delete all products and related data
-- WARNING: This cannot be undone! Make sure you want to delete ALL products.
--
-- Steps:
-- 1. Copy this entire script
-- 2. Go to your Supabase Dashboard → SQL Editor
-- 3. Paste and run this script
-- 4. Manually delete images from Storage → product-images bucket

BEGIN;

-- Step 1: Delete cart items that reference product variants
DELETE FROM cart_items 
WHERE variant_id IN (
  SELECT id FROM product_variants 
  WHERE product_id IN (SELECT id FROM products)
);

-- Step 2: Delete order items that reference product variants  
DELETE FROM order_items 
WHERE variant_id IN (
  SELECT id FROM product_variants 
  WHERE product_id IN (SELECT id FROM products)
);

-- Step 3: Delete product images
DELETE FROM product_images 
WHERE product_id IN (SELECT id FROM products);

-- Step 4: Delete product variants
DELETE FROM product_variants 
WHERE product_id IN (SELECT id FROM products);

-- Step 5: Delete all products
DELETE FROM products;

-- Step 6: Reset any auto-increment sequences (if applicable)
-- This ensures clean IDs for new products
-- Note: UUIDs don't need this, but included for completeness

COMMIT;

-- Verification queries (run these to confirm deletion)
-- Uncomment the lines below to check if everything was deleted:

-- SELECT COUNT(*) as remaining_products FROM products;
-- SELECT COUNT(*) as remaining_variants FROM product_variants;  
-- SELECT COUNT(*) as remaining_images FROM product_images;
-- SELECT COUNT(*) as remaining_cart_items FROM cart_items;
-- SELECT COUNT(*) as remaining_order_items FROM order_items;

-- Manual steps after running this script:
-- 1. Go to Supabase Dashboard → Storage → product-images
-- 2. Select all files and delete them manually
-- 3. Or use the JavaScript script for automated storage cleanup

