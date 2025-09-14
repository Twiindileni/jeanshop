import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function TestImagesPage() {
  const supabase = await getSupabaseServerClient();
  
  // Get all products with images
  const { data: products } = await supabase
    .from("products")
    .select("id, title, product_images(path, is_primary)")
    .limit(5);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Test Page</h1>
      
      <div className="mb-4">
        <p><strong>Supabase URL:</strong> {supabaseUrl || "NOT SET"}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products?.map((product: any) => {
          const images = product.product_images || [];
          const mainImage = images.find((img: any) => img.is_primary) || images[0];
          const imageUrl = mainImage?.path 
            ? `${supabaseUrl}/storage/v1/object/public/product-images/${mainImage.path}`
            : null;

          return (
            <div key={product.id} className="border rounded p-4">
              <h3 className="font-semibold mb-2">{product.title}</h3>
              <p><strong>Images count:</strong> {images.length}</p>
              <p><strong>Main image path:</strong> {mainImage?.path || "None"}</p>
              <p><strong>Image URL:</strong> {imageUrl || "None"}</p>
              
              {imageUrl && (
                <div className="mt-4">
                  <p><strong>Direct image test:</strong></p>
                  <img 
                    src={imageUrl} 
                    alt={product.title}
                    className="w-32 h-32 object-cover border"
                    onLoad={() => console.log("Image loaded successfully:", imageUrl)}
                    onError={(e) => console.error("Image failed to load:", imageUrl, e)}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

