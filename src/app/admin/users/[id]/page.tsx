import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatNAD } from "@/lib/currency";

export default async function AdminUserDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/");

  const [{ data: u }, { data: orders }] = await Promise.all([
    supabase.from("profiles").select("id, email, username, wallet_cents").eq("id", id).single(),
    supabase.from("orders").select("id, status, total_cents, created_at").eq("user_id", id).order("created_at", { ascending: false }),
  ]);

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">User</h1>
      <div className="border rounded p-4 grid gap-1">
        <div>Email: {u?.email}</div>
        <div>Username: {u?.username ?? "-"}</div>
        <div>Wallet: {formatNAD(u?.wallet_cents ?? 0)}</div>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Orders</h2>
        <div className="grid gap-2">
          {(orders ?? []).map((o: any) => (
            <div key={o.id} className="border rounded p-3 flex justify-between text-sm">
              <span>{o.status} · {new Date(o.created_at).toLocaleString()}</span>
              <span>{formatNAD(o.total_cents)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}










