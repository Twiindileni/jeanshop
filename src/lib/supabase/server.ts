import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Set them in your environment."
    );
  }

  const cookieStore = await cookies();
  const client = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (_) {
          // In Server Components, Next.js forbids modifying cookies.
          // Ignore here; cookie writes should happen in Server Actions/Route Handlers.
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options });
        } catch (_) {
          // Ignore in RSC context; see note above.
        }
      },
    },
    auth: {
      persistSession: false, // Disable session persistence to prevent token conflicts
      autoRefreshToken: false, // Disable automatic token refresh
      detectSessionInUrl: false, // Disable session detection in URL
    },
  });

  return client;
}

