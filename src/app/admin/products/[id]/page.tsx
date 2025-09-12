import { getSupabaseServerClient } from "@/lib/supabase/server";
import { uploadProductImage } from "@/lib/upload";
import { redirect } from "next/navigation";
import { LoadingImage } from "@/components/loading-image";

export default async function AdminProductDetail({ params }: { params: { id: string } }) {
  const supabase = await getSupabaseServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, title, product_images(path, is_primary)")
    .eq("id", params.id)
    .single();

  async function upload(formData: FormData) {
    "use server";
    const productId = String(formData.get("productId") || "");
    const file = formData.get("file") as File | null;
    
    if (!file) {
      console.error("No file provided");
      return;
    }
    
    try {
      const uploadResult = await uploadProductImage(file, productId, false);
      
      if (!uploadResult.success) {
        console.error("Image upload failed:", uploadResult.error);
      }
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
    }
    
    redirect(`/admin/products/${productId}`);
  }

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Images for {product?.title}</h1>
      <form action={upload} className="flex items-center gap-3">
        <input type="hidden" name="productId" value={params.id} />
        <input type="file" name="file" accept="image/*" className="border rounded px-3 py-2" required />
        <button className="btn-primary">Upload</button>
      </form>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {(product?.product_images ?? []).map((img: any, idx: number) => (
          <div key={idx} className="aspect-square rounded overflow-hidden border">
            <LoadingImage
              src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${img.path}`}
              alt="product"
              className="w-full h-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

