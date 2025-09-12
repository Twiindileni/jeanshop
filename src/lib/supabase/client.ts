"use client";

import { createBrowserClient } from "@supabase/ssr";

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowserClient() {
  if (browserClient) return browserClient;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Set them in your environment."
    );
  }

  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        if (typeof document === "undefined") return [];
        return document.cookie.split(';').map(cookie => {
          const [name, value] = cookie.trim().split('=');
          return { name, value: value ? decodeURIComponent(value) : '' };
        });
      },
      setAll(cookiesToSet) {
        if (typeof document === "undefined") return;
        cookiesToSet.forEach(({ name, value, options }) => {
          let cookieString = `${name}=${encodeURIComponent(value)}`;
          if (options?.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
          if (options?.path) cookieString += `; Path=${options.path}`;
          if (options?.domain) cookieString += `; Domain=${options.domain}`;
          if (options?.secure) cookieString += `; Secure`;
          if (options?.httpOnly) cookieString += `; HttpOnly`;
          if (options?.sameSite) cookieString += `; SameSite=${options.sameSite}`;
          document.cookie = cookieString;
        });
      },
    },
  });

  return browserClient;
}

