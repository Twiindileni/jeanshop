import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminSizesPage() {
  const supabase = await getSupabaseServerClient();

  async function create(formData: FormData) {
    "use server";
    const label = String(formData.get("label") || "");
    const supabase = await getSupabaseServerClient();
    await supabase.from("sizes").insert({ label });
  }

  async function remove(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const supabase = await getSupabaseServerClient();
    await supabase.from("sizes").delete().eq("id", id);
  }

  const { data: sizes } = await supabase.from("sizes").select("id, label").order("label");

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Sizes</h1>
      <form action={create} className="flex gap-2">
        <input name="label" className="border rounded px-3 py-2" placeholder="New size (e.g., 26, 28)" required />
        <button className="btn-primary">Add</button>
      </form>
      <ul className="grid gap-2">
        {(sizes ?? []).map((s: any) => (
          <li key={s.id} className="flex justify-between items-center border rounded px-3 py-2">
            <span>{s.label}</span>
            <form action={remove}>
              <input type="hidden" name="id" value={s.id} />
              <button className="text-red-600 hover:underline">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

