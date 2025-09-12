import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatNAD } from "@/lib/currency";

export default async function AdminOverview() {
  const supabase = await getSupabaseServerClient();

  const [productsCountRes, inactiveProductsRes, ordersCountRes, pendingOrdersRes, usersCountRes, totalsRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", false),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("total_cents").in("status", ["paid","shipped","delivered"]),
  ]);

  const totalUsers = usersCountRes.count ?? 0;
  const totalProducts = productsCountRes.count ?? 0;
  const pendingProducts = inactiveProductsRes.count ?? 0;
  const totalOrders = ordersCountRes.count ?? 0;
  const pendingOrders = pendingOrdersRes.count ?? 0;
  const totalOrderValueCents = (totalsRes.data ?? []).reduce((s: number, o: any) => s + (o.total_cents ?? 0), 0);

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-sm text-gray-600">Overview of your platform's performance and management tools</p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
        <Card title="Total Users" value={totalUsers} />
        <Card title="Total Products" value={totalProducts} />
        <Card title="Total Orders" value={totalOrders} />
        <Card title="Pending Orders" value={pendingOrders} />
        <Card title="Pending Products" value={pendingProducts} />
        <Card title="Total Order Value" value={formatNAD(totalOrderValueCents)} />
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <QuickAction href="/admin/products" label="Manage Products" />
          <QuickAction href="/admin/orders" label="Manage Orders" />
          <QuickAction href="/admin/categories" label="Manage Categories" />
          <QuickAction href="/admin/sizes" label="Manage Sizes" />
          <QuickAction href="/admin/settings" label="Site Settings" />
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="border rounded p-4 bg-white/60">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="border-2 border-dashed rounded p-8 text-center hover:bg-white/60 transition">
      <div className="text-sm font-medium">{label}</div>
    </a>
  );
}

