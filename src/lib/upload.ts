import { getSupabaseServerClient } from "@/lib/supabase/server";

export interface UploadResult {
  success: boolean;
  path?: string;
  error?: string;
  url?: string;
}

export async function uploadProductImage(
  file: File,
  productId: string,
  isPrimary: boolean = false
): Promise<UploadResult> {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.'
      };
    }
    
    // Validate file size (20MB limit)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File too large. Maximum size is 20MB.'
      };
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `${productId}/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filename, buffer, {
        upsert: false,
        contentType: file.type,
      });
    
    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }
    
    if (!data?.path) {
      return {
        success: false,
        error: 'No path returned from upload'
      };
    }
    
    // If this is the first image for the product, make it primary
    const { data: existingImages } = await supabase
      .from('product_images')
      .select('id')
      .eq('product_id', productId);
    
    const shouldBePrimary = isPrimary || (existingImages?.length === 0);
    
    // Insert image record into database
    const { error: dbError } = await supabase
      .from('product_images')
      .insert({
        product_id: productId,
        path: data.path,
        is_primary: shouldBePrimary
      });
    
    if (dbError) {
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('product-images').remove([data.path]);
      return {
        success: false,
        error: `Database error: ${dbError.message}`
      };
    }
    
    // Generate public URL
    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);
    
    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

export async function uploadCoverImage(file: File): Promise<UploadResult> {
  try {
    const supabase = await getSupabaseServerClient();
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed for covers.'
      };
    }
    
    // Validate file size (10MB limit for covers)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File too large. Maximum size for covers is 10MB.'
      };
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `cover/${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('covers')
      .upload(filename, buffer, {
        upsert: true,
        contentType: file.type,
      });
    
    if (error) {
      return {
        success: false,
        error: `Upload failed: ${error.message}`
      };
    }
    
    if (!data?.path) {
      return {
        success: false,
        error: 'No path returned from upload'
      };
    }
    
    // Update site settings
    await supabase.rpc('ensure_site_settings_row');
    const { error: dbError } = await supabase
      .from('site_settings')
      .update({ 
        cover_image_path: data.path, 
        updated_at: new Date().toISOString() 
      })
      .not('id', 'is', null);
    
    if (dbError) {
      return {
        success: false,
        error: `Database error: ${dbError.message}`
      };
    }
    
    // Generate public URL
    const { data: urlData } = supabase.storage
      .from('covers')
      .getPublicUrl(data.path);
    
    return {
      success: true,
      path: data.path,
      url: urlData.publicUrl
    };
    
  } catch (error) {
    return {
      success: false,
      error: `Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
