import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatNAD } from "@/lib/currency";
import Link from "next/link";
import { LoadingImage } from "@/components/loading-image";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await getSupabaseServerClient();
  const { data: settingsRows } = await supabase
    .from("site_settings")
    .select("cover_image_path, updated_at")
    .order("updated_at", { ascending: false })
    .limit(1);
  const settings = (settingsRows ?? [])[0];
  let coverUrl = settings?.cover_image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/covers/${settings.cover_image_path}`
    : undefined;

  // Fallback: if DB path missing, list latest from storage under 'cover/'
  if (!coverUrl) {
    const { data: listed } = await supabase.storage
      .from("covers")
      .list("cover", { limit: 1, sortBy: { column: "created_at", order: "desc" } });
    const latest = (listed ?? [])[0];
    if (latest?.name) {
      const path = `cover/${latest.name}`;
      coverUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/covers/${path}`;
    }
  }

  // Fetch products with images
  const { data: products } = await supabase
    .from("products")
    .select("id, title, description, price_cents, product_images(path, is_primary)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <main className="container-page py-8">
      {/* Hero / Cover */}
      <section className="tile mb-10">
        {coverUrl ? (
          <div className="w-full">
            <LoadingImage 
              src={coverUrl} 
              alt="Homepage cover" 
              className="w-full h-auto object-contain" 
            />
          </div>
        ) : (
          <div className="w-full aspect-[3/2] grid place-items-center text-sm text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">📸</div>
              <div>Upload a cover in Admin → Settings</div>
            </div>
          </div>
        )}
        <div className="p-6 md:p-10 grid md:grid-cols-2 gap-6 items-center">
          <div className="text-center md:text-left">
            <h1 className="font-display text-4xl md:text-6xl tracking-wide text-[#B88972]">NubiadenimbyAG</h1>
            <p className="mt-3 text-lg md:text-xl">Luxury craftsmanship for women who own their elegance.</p>
            <Link href="/products" className="btn-primary inline-block mt-6">SHOP NOW</Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Latest Products</h2>
          <Link href="/products" className="underline text-sm">View all</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {(products ?? []).map((p: any) => {
            const primary = (p.product_images ?? []).find((i: any) => i.is_primary) || (p.product_images ?? [])[0];
            const imagePath = primary?.path as string | undefined;
            const imageUrl = imagePath
              ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${imagePath}`
              : undefined;
            return (
              <Link key={p.id} href={`/products/${p.id}`} className="tile hover:shadow transition-all duration-300 hover:scale-105">
                <div className="aspect-square bg-white rounded-lg overflow-hidden">
                  {imageUrl ? (
                    <LoadingImage 
                      src={imageUrl} 
                      alt={p.title} 
                      className="w-full h-full" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <div className="text-2xl mb-1 jean-emoji-bounce">👖</div>
                        <div className="text-xs">No image</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="font-medium line-clamp-1">{p.title}</div>
                  <div className="text-sm text-gray-600">{formatNAD(p.price_cents)}</div>
                  {p.description ? (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{p.description}</p>
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
