import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatNAD } from "@/lib/currency";
import { PaymentButton } from "@/components/payment-button";
import { ProductImageGallery } from "@/components/product-image-gallery";

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("id, title, description, price_cents, color, product_images(path, is_primary), product_variants(id, stock, sizes(label))")
    .eq("id", id)
    .single();

  const images = (product?.product_images ?? []) as Array<{ path: string; is_primary: boolean }>;
  
  // Debug logging
  console.log('Product Debug:', {
    product: product?.title,
    images,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasImages: images.length > 0
  });

  // If no product found
  if (!product) {
    return (
      <div className="container-page py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  async function addToCart(formData: FormData) {
    "use server";
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Please login" };
    const variantId = String(formData.get("variantId") || "");
    const qty = Math.max(1, Number(formData.get("qty") || 1));

    // Ensure cart exists
    const { data: cart } = await supabase.from("carts").select("id").eq("user_id", user.id).maybeSingle();
    let cartId = cart?.id as string | undefined;
    if (!cartId) {
      const { data: created } = await supabase.from("carts").insert({ user_id: user.id }).select("id").single();
      cartId = created?.id;
    }
    if (!cartId) return { error: "Unable to create cart" };

    // Upsert item
    const existing = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_variant_id", variantId)
      .maybeSingle();
    if (existing.data?.id) {
      await supabase
        .from("cart_items")
        .update({ quantity: (existing.data.quantity ?? 0) + qty })
        .eq("id", existing.data.id);
    } else {
      await supabase.from("cart_items").insert({ cart_id: cartId, product_variant_id: variantId, quantity: qty });
    }
    return { ok: true };
  }

  const variants = (product?.product_variants ?? []) as Array<{ id: string; stock: number; sizes: { label: string } }>;

  return (
    <div className="container-page py-8 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8">
      {/* Image Gallery */}
      {images.length > 0 ? (
        <ProductImageGallery
          images={images}
          productTitle={product?.title || "Product"}
          supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL || ""}
        />
      ) : (
        <div className="w-full aspect-[3/4] lg:aspect-auto bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-500">
            <div className="text-6xl mb-4">👖</div>
            <div className="text-lg">No images available</div>
            <div className="text-sm">Upload images in Admin → Products</div>
          </div>
        </div>
      )}

      {/* Right panel */}
      <div className="grid gap-4 content-start">
        <div>
          <h1 className="text-2xl font-semibold">{product?.title}</h1>
          <div className="text-lg text-gray-700 mt-1">{formatNAD(product?.price_cents ?? 0)}</div>
          {product?.color ? <div className="text-sm text-gray-600 mt-1">Colour: {product.color}</div> : null}
        </div>

        {/* Sizes */}
        {/* Add to cart form includes size + quantity */}
        <form action={addToCart} className="grid gap-4">
          <div>
            <div className="text-sm font-medium mb-2">Size</div>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <label key={v.id} className={`border rounded px-3 py-1 text-sm cursor-pointer ${v.stock > 0 ? "" : "opacity-40"}`}>
                  <input type="radio" name="variantId" value={v.id} className="hidden" defaultChecked={v.stock > 0 && variants[0]?.id === v.id} />
                  {v.sizes?.label}
                </label>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">Only sizes with stock are selectable.</div>
          </div>
          <div className="grid grid-cols-[120px_auto] gap-3 items-end">
            <div>
              <div className="text-sm font-medium mb-1">Quantity</div>
              <select name="qty" className="border rounded px-3 py-2 w-24">
                {[1,2,3,4,5].map(n => (<option key={n} value={n}>{n}</option>))}
              </select>
            </div>
            <button className="border border-[#B88972] text-[#B88972] rounded px-5 py-2.5 text-sm hover:bg-[#B88972]/10 h-[42px] justify-self-start">Add to cart</button>
          </div>
        </form>

        {/* Order Section - Redesigned for better visibility */}
        <div className="mt-6 p-4 bg-gradient-to-r from-[#B88972]/5 to-[#B88972]/10 rounded-lg border border-[#B88972]/20">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-[#B88972] mb-2">Ready to Order?</h3>
            <p className="text-sm text-gray-600">Get your perfect fit delivered to your door</p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Order Button - Primary Action */}
            <a 
              href={`/order/${id}`} 
              className="bg-gradient-to-r from-[#B88972] to-[#A67B5B] text-white rounded-lg px-6 py-4 text-center font-semibold text-lg hover:from-[#A67B5B] hover:to-[#B88972] transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>🛍️</span>
              <span>Order Now</span>
            </a>
            
            {/* Buy Now Button - Secondary Action */}
            <PaymentButton />
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span>🚚</span>
                <span>Fast Delivery</span>
              </span>
              <span className="flex items-center gap-1">
                <span>🔒</span>
                <span>Secure Payment</span>
              </span>
              <span className="flex items-center gap-1">
                <span>↩️</span>
                <span>Easy Returns</span>
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        {product?.description ? (
          <div className="mt-4">
            <div className="text-sm font-medium mb-1">Description</div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{product.description}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

