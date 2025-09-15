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
    .select("id, email, username, name, is_admin, wallet_cents, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-gray-600">
            Manage all registered users, their wallets, and admin privileges
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {users?.length || 0} total users
        </div>
      </div>

      <div className="bg-white rounded-lg border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">User</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Wallet</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Joined</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">👥</span>
                      <p>No users found</p>
                      <p className="text-sm">Users will appear here when they register</p>
                    </div>
                  </td>
                </tr>
              ) : (
                (users ?? []).map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">
                          {u.name || u.username || 'Unnamed User'}
                        </div>
                        {u.username && u.name !== u.username && (
                          <div className="text-sm text-gray-500">@{u.username}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{u.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        u.is_admin 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.is_admin ? '👑 Admin' : '👤 User'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-900">{formatNAD(u.wallet_cents)}</span>
                        <form action={setWallet} className="flex items-center gap-1">
                          <input type="hidden" name="id" value={u.id} />
                          <input 
                            name="amount" 
                            type="number" 
                            step="0.01" 
                            placeholder="Set wallet" 
                            className="border rounded px-2 py-1 text-xs w-20" 
                          />
                          <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">
                            Set
                          </button>
                        </form>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {u.created_at ? formatDate(u.created_at) : 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <form action={toggleAdmin}>
                          <input type="hidden" name="id" value={u.id} />
                          <input type="hidden" name="isAdmin" value={String(u.is_admin)} />
                          <button className={`text-xs font-medium ${
                            u.is_admin 
                              ? 'text-red-600 hover:text-red-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}>
                            {u.is_admin ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                        </form>
                        <a 
                          href={`/admin/users/${u.id}`} 
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          View
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

