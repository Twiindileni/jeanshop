import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatNAD } from "@/lib/currency";

export default async function AdminUsersPage() {
  const supabase = await getSupabaseServerClient();

  async function toggleAdmin(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const isAdmin = String(formData.get("isAdmin") || "false") === "true";
    const supabase = await getSupabaseServerClient();
    await supabase.from("profiles").update({ is_admin: !isAdmin }).eq("id", id);
  }

  async function setWallet(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const amount = Number(formData.get("amount") || 0);
    const supabase = await getSupabaseServerClient();
    await supabase.from("profiles").update({ wallet_cents: Math.round(amount * 100) }).eq("id", id);
  }

  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, username, is_admin, wallet_cents")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Users</h1>
      <div className="grid gap-2">
        {(users ?? []).map((u: any) => (
          <div key={u.id} className="border rounded p-3 grid grid-cols-2 md:grid-cols-6 items-center gap-2">
            <div className="text-sm">{u.email}</div>
            <div className="text-sm">{u.username ?? '-'}</div>
            <div className="text-sm">Wallet: {formatNAD(u.wallet_cents)}</div>
            <form action={toggleAdmin} className="justify-self-end">
              <input type="hidden" name="id" value={u.id} />
              <input type="hidden" name="isAdmin" value={String(u.is_admin)} />
              <button className="underline text-sm">{u.is_admin ? 'Revoke Admin' : 'Make Admin'}</button>
            </form>
            <form action={setWallet} className="flex items-center gap-2 justify-self-end">
              <input type="hidden" name="id" value={u.id} />
              <input name="amount" type="number" step="0.01" placeholder="Set wallet" className="border rounded px-2 py-1 text-sm w-28" />
              <button className="underline text-sm">Save</button>
            </form>
            <a href={`/admin/users/${u.id}`} className="underline text-sm justify-self-end">View</a>
          </div>
        ))}
      </div>
    </div>
  );
}

