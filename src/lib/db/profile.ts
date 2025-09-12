import { getSupabaseServerClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  username: string | null;
  email: string;
  wallet_cents: number;
  is_admin: boolean;
};

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await getSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, username, email, wallet_cents, is_admin")
    .eq("id", user.id)
    .single();
  return (data as unknown as Profile) ?? null;
}

