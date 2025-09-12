import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatNAD } from "@/lib/currency";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
	const supabase = await getSupabaseServerClient();
	const { data: { user } } = await supabase.auth.getUser();
	if (!user) redirect("/login");
	const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
	if (!profile?.is_admin) redirect("/");

	const [{ data: paidOrders }, viewsCount, { data: products }, { data: views } ] = await Promise.all([
		supabase.from("orders").select("total_cents, status").in("status", ["paid","shipped","delivered"]),
		(async () => {
			const { count } = await supabase.from("product_views").select("id", { count: "exact", head: true });
			return count ?? 0;
		})(),
		supabase.from("products").select("id, title").limit(1000),
		supabase.from("product_views").select("product_id").limit(10000),
	]);

	const totalSalesCents = (paidOrders ?? []).reduce((sum: number, o: any) => sum + (o.total_cents ?? 0), 0);
	const viewCounts = new Map<string, number>();
	(views ?? []).forEach((v: any) => {
		viewCounts.set(v.product_id, (viewCounts.get(v.product_id) ?? 0) + 1);
	});
	const top = (products ?? [])
		.map((p: any) => ({ id: p.id, title: p.title, views: viewCounts.get(p.id) ?? 0 }))
		.sort((a: any, b: any) => b.views - a.views)
		.slice(0, 5);

	return (
		<div className="p-6 max-w-5xl mx-auto grid gap-6">
			<h1 className="text-2xl font-semibold">Analytics</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<div className="border rounded p-4"><div className="text-sm text-gray-600">Sales</div><div className="text-xl font-semibold">{formatNAD(totalSalesCents)}</div></div>
				<div className="border rounded p-4"><div className="text-sm text-gray-600">Total Views</div><div className="text-xl font-semibold">{viewsCount}</div></div>
				<div className="border rounded p-4"><div className="text-sm text-gray-600">Top Products</div><ul className="text-sm">{(top ?? []).map((t: any) => (<li key={t.id} className="flex justify-between"><span>{t.title}</span><span>{t.views}</span></li>))}</ul></div>
			</div>
		</div>
	);
}