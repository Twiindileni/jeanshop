import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatNAD } from "@/lib/currency";
import Link from "next/link";
import { LoadingImage } from "@/components/loading-image";
import { ProductGridLoader } from "@/components/fashion-loader";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const supabase = await getSupabaseServerClient();
  let query = supabase
    .from("products")
    .select("id, title, price_cents, color, category_id, product_images(path, is_primary)")
    .eq("is_active", true);

  const resolvedSearchParams = await searchParams;
  const q = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined;
  const size = typeof resolvedSearchParams.size === "string" ? resolvedSearchParams.size : undefined;
  const color = typeof resolvedSearchParams.color === "string" ? resolvedSearchParams.color : undefined;
  const min = typeof resolvedSearchParams.min === "string" ? Number(resolvedSearchParams.min) : undefined;
  const max = typeof resolvedSearchParams.max === "string" ? Number(resolvedSearchParams.max) : undefined;

  if (q) query = query.ilike("title", `%${q}%`);
  if (color) query = query.eq("color", color);
  if (min !== undefined) query = query.gte("price_cents", Math.round(min * 100));
  if (max !== undefined) query = query.lte("price_cents", Math.round(max * 100));
  // Filter by size via variants
  if (size) {
    const { data: variantMatches } = await supabase
      .from("product_variants")
      .select("product_id, sizes(label)")
      .eq("sizes.label", size);
    const ids = (variantMatches ?? []).map((v: any) => v.product_id);
    if (ids.length > 0) query = query.in("id", ids);
    else return <div className="p-8">No products found</div>;
  }

  const { data: products } = await query.order("title");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <form className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        <input name="q" placeholder="Search" className="border rounded px-3 py-2 col-span-2" defaultValue={q} />
        <input name="min" placeholder="Min N$" className="border rounded px-3 py-2" defaultValue={min ?? ""} />
        <input name="max" placeholder="Max N$" className="border rounded px-3 py-2" defaultValue={max ?? ""} />
        <input name="color" placeholder="Color" className="border rounded px-3 py-2" defaultValue={color ?? ""} />
        <input name="size" placeholder="Size" className="border rounded px-3 py-2" defaultValue={size ?? ""} />
        <button className="bg-black text-white rounded px-4 py-2 md:col-span-1 col-span-2">Filter</button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {(products ?? []).map((p: any) => {
          const primary = (p.product_images ?? []).find((i: any) => i.is_primary) || (p.product_images ?? [])[0];
          const imagePath = primary?.path as string | undefined;
          const imageUrl = imagePath
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${imagePath}`
            : undefined;
          return (
            <Link key={p.id} href={`/products/${p.id}`} className="border rounded p-4 hover:shadow transition-shadow duration-300">
              <div className="aspect-square bg-white mb-3 rounded-lg overflow-hidden">
                {imageUrl ? (
                  <LoadingImage 
                    src={imageUrl} 
                    alt={p.title} 
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <div className="text-2xl mb-2 jean-emoji-bounce">👖</div>
                      <div className="text-sm">No image</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-600">{formatNAD(p.price_cents)}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

