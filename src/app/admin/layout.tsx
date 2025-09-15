import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  return (
    <div className="container-page py-6 grid md:grid-cols-[220px_1fr] gap-6">
      <aside className="border rounded p-4 h-max sticky top-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold">Admin</h2>
          <div className="flex gap-2 text-xs">
            <Link href="/dashboard" className="text-blue-600 hover:underline">User View</Link>
            <Link href="/logout" className="text-red-600 hover:underline">Logout</Link>
          </div>
        </div>
        <nav className="grid gap-2 text-sm">
          <a className="hover:opacity-70" href="/admin">Overview</a>
          <a className="hover:opacity-70" href="/admin/users">Users</a>
          <a className="hover:opacity-70" href="/admin/products">Products</a>
          <a className="hover:opacity-70" href="/admin/orders">Orders</a>
          <a className="hover:opacity-70" href="/admin/contact">Contact Messages</a>
          <a className="hover:opacity-70" href="/admin/categories">Categories</a>
          <a className="hover:opacity-70" href="/admin/sizes">Sizes</a>
          <a className="hover:opacity-70" href="/admin/analytics">Analytics</a>
          <a className="hover:opacity-70" href="/admin/settings">Settings</a>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}

