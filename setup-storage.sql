-- Supabase Storage Setup Script
-- Run this in your Supabase SQL Editor

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('product-images', 'product-images', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('covers', 'covers', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for product-images bucket
CREATE POLICY "Public read access for product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload product images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own product images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can delete their own product images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Set up RLS policies for covers bucket
CREATE POLICY "Public read access for covers" ON storage.objects
FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Admins can upload covers" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'covers' 
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update covers" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'covers' 
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can delete covers" ON storage.objects
FOR DELETE USING (
  bucket_id = 'covers' 
  AND public.is_admin(auth.uid())
);

-- Verify buckets were created
SELECT * FROM storage.buckets;

