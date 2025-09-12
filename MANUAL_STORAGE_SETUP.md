# Manual Storage Bucket Setup

## Step 1: Create Storage Buckets in Supabase Dashboard

1. **Go to your Supabase project dashboard**
2. **Navigate to Storage** (left sidebar)
3. **Click "New Bucket"**

### Create `product-images` bucket:
- **Name**: `product-images`
- **Public**: ✅ **Yes** (check this box)
- **File size limit**: `52428800` (50MB)
- **Allowed MIME types**: `image/jpeg,image/png,image/webp,image/gif`
- Click **"Create bucket"**

### Create `covers` bucket:
- **Name**: `covers`
- **Public**: ✅ **Yes** (check this box)
- **File size limit**: `10485760` (10MB)
- **Allowed MIME types**: `image/jpeg,image/png,image/webp`
- Click **"Create bucket"**

## Step 2: Set up RLS Policies

After creating the buckets, go to **SQL Editor** and run this:

```sql
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
```

## Step 3: Verify Buckets

After creating both buckets, you should see them in the Storage section of your Supabase dashboard.

## Step 4: Test Upload

1. Go to your admin dashboard
2. Try uploading a product image
3. Check if the upload works without errors

## Troubleshooting

If uploads still don't work:
1. Check that buckets are public
2. Verify RLS policies are applied
3. Check browser console for errors
4. Ensure environment variables are set correctly

