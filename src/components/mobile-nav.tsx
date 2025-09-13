"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = getSupabaseBrowserClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
      setIsOpen(false); // Close mobile menu after logout
    } catch (error) {
      console.error("Logout error:", error);
      window.location.href = "/api/auth/logout";
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="md:hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#B88972]"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-[#B88972]">Menu</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-2">
                <Link
                  href="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#B88972] hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  HOME
                </Link>
                <Link
                  href="/products"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#B88972] hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  SHOP
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#B88972] hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  ABOUT US
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#B88972] hover:bg-gray-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  CONTACT
                </Link>
              </nav>

              {/* Auth Section */}
              <div className="border-t px-4 py-6">
                {loading ? (
                  <div className="text-center text-sm text-gray-500">Loading...</div>
                ) : user ? (
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      Welcome back!
                    </div>
                    <Link
                      href="/dashboard"
                      className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-[#B88972] rounded-md hover:bg-[#A67B5B] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="block w-full px-4 py-2 text-center text-sm font-medium text-[#B88972] border border-[#B88972] rounded-md hover:bg-[#B88972] hover:text-white transition-colors disabled:opacity-50"
                    >
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      href="/login"
                      className="block w-full px-4 py-2 text-center text-sm font-medium text-[#B88972] border border-[#B88972] rounded-md hover:bg-[#B88972] hover:text-white transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block w-full px-4 py-2 text-center text-sm font-medium text-white bg-[#B88972] rounded-md hover:bg-[#A67B5B] transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
