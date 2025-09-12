"use client";

import { useAuth } from "@/components/auth-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthNav() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback to server-side logout
      window.location.href = "/api/auth/logout";
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return (
    <div className="flex items-center gap-3">
      {user ? (
        <>
          <a href="/dashboard" className="hover:opacity-70 text-sm">Dashboard</a>
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-sm underline hover:opacity-70 disabled:opacity-50"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </>
      ) : (
        <>
          <a href="/login" className="text-sm underline">Login</a>
          <a href="/register" className="text-sm underline">Sign Up</a>
        </>
      )}
    </div>
  );
}
