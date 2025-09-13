import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function DebugPage() {
  const supabase = await getSupabaseServerClient();
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  // Get cover image
  const { data: coverData } = await supabase
    .from("covers")
    .select("path")
    .not('id', 'is', null)
    .single();
  
  // Get products with images
  const { data: products } = await supabase
    .from("products")
    .select("id, title, product_images(path, is_primary)")
    .eq("is_active", true)
    .limit(3);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Information</h1>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Environment Variables:</h2>
        <p>SUPABASE_URL: {supabaseUrl || "NOT SET"}</p>
        <p>SUPABASE_KEY: {supabaseKey ? "SET" : "NOT SET"}</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Cover Image:</h2>
        <p>Cover path: {coverData?.path || "No cover found"}</p>
        {coverData?.path && (
          <div>
            <p>Cover URL: {`${supabaseUrl}/storage/v1/object/public/covers/${coverData.path}`}</p>
            <img 
              src={`${supabaseUrl}/storage/v1/object/public/covers/${coverData.path}`}
              alt="Cover test"
              className="w-64 h-32 object-cover border"
              onError={(e) => {
                console.error("Cover image error:", e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Products:</h2>
        {products?.map((product: any) => {
          const primary = product.product_images?.find((i: any) => i.is_primary) || product.product_images?.[0];
          const imageUrl = primary?.path ? `${supabaseUrl}/storage/v1/object/public/product-images/${primary.path}` : null;
          
          return (
            <div key={product.id} className="mb-4 p-4 border rounded">
              <p>Product: {product.title}</p>
              <p>Image path: {primary?.path || "No image"}</p>
              <p>Image URL: {imageUrl || "No URL"}</p>
              {imageUrl && (
                <img 
                  src={imageUrl}
                  alt={product.title}
                  className="w-32 h-32 object-cover border"
                  onError={(e) => {
                    console.error("Product image error:", e);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
