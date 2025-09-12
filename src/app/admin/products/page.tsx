import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatNAD } from "@/lib/currency";
import { redirect } from "next/navigation";
import { uploadProductImage } from "@/lib/upload";
import { LoadingImage } from "@/components/loading-image";
import { ButtonLoader } from "@/components/fashion-loader";

export default async function AdminProductsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
	const supabase = await getSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) redirect("/login");
	const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
	if (!profile?.is_admin) redirect("/");
	
	const resolvedSearchParams = await searchParams;
	const error = typeof resolvedSearchParams?.error === "string" ? resolvedSearchParams?.message ?? "Upload failed" : undefined;
	const success = typeof resolvedSearchParams?.success === "string";

	async function createProduct(formData: FormData) {
		"use server";
		const title = String(formData.get("title") || "");
		const price = Number(formData.get("price") || 0);
		const color = String(formData.get("color") || "");
		const description = String(formData.get("description") || "");
		const supabase = await getSupabaseServerClient();
		const { data: product, error } = await supabase.from("products").insert({
			title,
			description,
			price_cents: Math.round(price * 100),
			color,
		}).select().single();
		
		if (error) {
			console.error("Product creation error:", error);
			return;
		}
		
		// Handle file upload if provided
		const file = formData.get("file");
		if (file && file instanceof File && product) {
			try {
				// Upload the image directly using the upload function
				const uploadResult = await uploadProductImage(file, product.id, true);
				
				if (!uploadResult.success) {
					console.error("Image upload failed:", uploadResult.error);
					// Continue without the image - product is still created
				}
			} catch (uploadError) {
				console.error("Upload error:", uploadError);
				// Continue without the image - product is still created
			}
		}
		
		redirect("/admin/products");
	}

	async function toggleActive(formData: FormData) {
		"use server";
		const id = String(formData.get("id") || "");
		const isActive = String(formData.get("isActive") || "true") === "true";
		const supabase = await getSupabaseServerClient();
		await supabase.from("products").update({ is_active: !isActive }).eq("id", id);
		redirect("/admin/products");
	}

	async function removeProduct(formData: FormData) {
		"use server";
		const id = String(formData.get("id") || "");
		const supabase = await getSupabaseServerClient();
		await supabase.from("products").delete().eq("id", id);
		redirect("/admin/products");
	}

	const { data: products } = await supabase
		.from("products").select("id, title, price_cents, is_active, product_images(path, is_primary)").order("created_at", { ascending: false });

	return (
		<div className="p-6 max-w-5xl mx-auto">
			<h1 className="text-2xl font-semibold mb-4">Admin: Products</h1>
			
			{error ? <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 border border-red-200 rounded">{String(error)}</div> : null}
			{success ? <div className="text-green-700 text-sm mb-4 p-3 bg-green-50 border border-green-200 rounded">Product uploaded successfully!</div> : null}
			
			<form action={createProduct} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-6">
				<input name="title" placeholder="Title" className="border rounded px-3 py-2 md:col-span-2" required />
				<input name="price" type="number" step="0.01" placeholder="Price (N$)" className="border rounded px-3 py-2" required />
				<input name="color" placeholder="Color" className="border rounded px-3 py-2" />
				<input name="file" type="file" accept="image/*" className="border rounded px-3 py-2 md:col-span-2" />
				<input name="description" placeholder="Description" className="border rounded px-3 py-2 md:col-span-6" />
				<button className="bg-black text-white rounded px-4 py-2 md:col-span-1">Create</button>
			</form>

			<div className="grid gap-3">
				{(products ?? []).map((p: any) => (
					<div key={p.id} className="border rounded p-3 grid grid-cols-1 md:grid-cols-[64px_1fr_auto_auto] items-center gap-3">
						<div className="w-16 h-16 bg-white rounded overflow-hidden">
							{p.product_images?.[0]?.path ? (
								<a href={`/admin/products/${p.id}`} className="block w-full h-full">
									<LoadingImage 
										src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${p.product_images[0].path}`} 
										alt="thumb" 
										className="w-full h-full"
									/>
								</a>
							) : (
								<form action="/api/upload" method="post" encType="multipart/form-data" className="w-16 h-16 flex flex-col items-center justify-center text-[10px] text-gray-500 gap-1">
									<input type="hidden" name="productId" value={p.id} />
									<input type="file" name="file" accept="image/*" className="text-[10px]" />
									<button className="underline">Upload</button>
								</form>
							)}
						</div>
						<div className="font-medium">{p.title}</div>
						<div className="text-sm text-gray-600">{formatNAD(p.price_cents)}</div>
						<form action={toggleActive} className="justify-self-end">
							<input type="hidden" name="id" value={p.id} />
							<input type="hidden" name="isActive" value={String(p.is_active)} />
							<button className="underline text-sm">{p.is_active ? "Deactivate" : "Activate"}</button>
						</form>
						<form action={removeProduct} className="justify-self-end">
							<input type="hidden" name="id" value={p.id} />
							<button className="text-red-600 underline text-sm">Delete</button>
						</form>
					</div>
				))}
			</div>
		</div>
	);
}