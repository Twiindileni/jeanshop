import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminCategoriesPage() {
  const supabase = await getSupabaseServerClient();

  async function create(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    const supabase = await getSupabaseServerClient();
    await supabase.from("categories").insert({ name });
  }

  async function remove(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    const supabase = await getSupabaseServerClient();
    await supabase.from("categories").delete().eq("id", id);
  }

  const { data: categories } = await supabase.from("categories").select("id, name").order("name");

  return (
    <div className="grid gap-4">
      <h1 className="text-xl font-semibold">Categories</h1>
      <form action={create} className="flex gap-2">
        <input name="name" className="border rounded px-3 py-2" placeholder="New category" required />
        <button className="btn-primary">Add</button>
      </form>
      <ul className="grid gap-2">
        {(categories ?? []).map((c: any) => (
          <li key={c.id} className="flex justify-between items-center border rounded px-3 py-2">
            <span>{c.name}</span>
            <form action={remove}>
              <input type="hidden" name="id" value={c.id} />
              <button className="text-red-600 hover:underline">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

