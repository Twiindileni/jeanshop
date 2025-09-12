import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function AdminSettingsPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const supabase = await getSupabaseServerClient();
  const { data: settings } = await supabase.from("site_settings").select("cover_image_path").maybeSingle();
  const coverUrl = settings?.cover_image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/covers/${settings.cover_image_path}`
    : undefined;
  const error = typeof searchParams?.error === "string" ? searchParams?.message ?? "Upload failed" : undefined;
  const success = typeof searchParams?.success === "string";

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-semibold">Site Settings</h1>
      
      {/* Cover Image Section */}
      <section className="border rounded p-4 grid gap-3">
        <h2 className="font-medium">Homepage Cover Image</h2>
        <p className="text-sm text-gray-600">Upload a cover image that will be displayed on the homepage. Recommended size: 1200x800px or similar aspect ratio.</p>
        {error ? <div className="text-red-600 text-sm">{String(error)}</div> : null}
        {success ? <div className="text-green-700 text-sm">Cover updated successfully!</div> : null}
        {coverUrl ? (
          <div className="w-full max-w-2xl aspect-[3/2] bg-white grid place-items-center overflow-hidden rounded border">
            <img src={coverUrl} alt="Current cover" className="max-w-full max-h-full object-contain" />
          </div>
        ) : (
          <div className="w-full max-w-2xl aspect-[3/2] bg-gray-100 grid place-items-center rounded border border-dashed">
            <div className="text-center text-gray-500">
              <p className="text-sm">No cover image uploaded</p>
              <p className="text-xs">Upload an image below</p>
            </div>
          </div>
        )}
        <form action="/api/upload/cover" method="post" encType="multipart/form-data" className="flex items-center gap-3">
          <input type="file" name="file" accept="image/*" className="border rounded px-3 py-2" required />
          <button className="btn-primary">Upload Cover</button>
        </form>
        <p className="text-xs text-gray-500">Supported formats: JPEG, PNG, WebP. Max size: 10MB</p>
      </section>

      {/* Site Information Section */}
      <section className="border rounded p-4 grid gap-3">
        <h2 className="font-medium">Site Information</h2>
        <div className="grid gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Site Name:</span>
            <span>NubiadenimbyAG</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current Cover:</span>
            <span>{coverUrl ? "Uploaded" : "Not set"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Storage Bucket:</span>
            <span>covers</span>
          </div>
        </div>
      </section>
    </div>
  );
}


