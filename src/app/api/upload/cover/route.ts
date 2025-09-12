import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { uploadCoverImage } from "@/lib/upload";

export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL("/login", req.url));
    
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
    if (!profile?.is_admin) return NextResponse.redirect(new URL("/", req.url));

    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      const url = new URL("/admin/settings", req.url);
      url.searchParams.set("error", "nofile");
      return NextResponse.redirect(url);
    }

    const result = await uploadCoverImage(file);
    
    if (!result.success) {
      const url = new URL("/admin/settings", req.url);
      url.searchParams.set("error", "upload");
      url.searchParams.set("message", result.error || "Upload failed");
      return NextResponse.redirect(url);
    }

    const url = new URL("/admin/settings", req.url);
    url.searchParams.set("success", "1");
    return NextResponse.redirect(url);
    
  } catch (error) {
    console.error("Cover upload error:", error);
    const url = new URL("/admin/settings", req.url);
    url.searchParams.set("error", "upload");
    url.searchParams.set("message", "Internal server error");
    return NextResponse.redirect(url);
  }
}


