import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { AuthNav } from "@/components/auth-nav";
import { LoadingProvider } from "@/components/loading-context";
import { MobileNav } from "@/components/mobile-nav";
import { Footer } from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nubia Denim by AG - Premium Jeans for Women | Namibia",
  description: "Discover luxury craftsmanship with Nubia Denim by AG. Premium women's jeans designed for elegance and comfort. Shop our exclusive collection of designer denim in Namibia.",
  keywords: ["women's jeans", "premium denim", "luxury jeans", "Namibia fashion", "designer jeans", "women's clothing"],
  authors: [{ name: "Nubia Denim by AG" }],
  creator: "Nubia Denim by AG",
  openGraph: {
    title: "Nubia Denim by AG - Premium Women's Jeans",
    description: "Luxury craftsmanship for women who own their elegance. Shop our exclusive collection of premium denim in Namibia.",
    url: "https://nubiajeans.com",
    siteName: "Nubia Denim by AG",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nubia Denim by AG - Premium Women's Jeans",
    description: "Luxury craftsmanship for women who own their elegance.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoadingProvider>
          <AuthProvider>
            <header className="bg-white shadow-sm sticky top-0 z-50">
              <div className="container-page py-4">
                <div className="flex justify-between items-center">
                  {/* Logo */}
                  <div className="flex items-center">
                    <a href="/" className="text-2xl font-bold">
                      <span className="text-[#B88972]">Nubiadenim by </span>
                      <span className="text-black">AG</span>
                    </a>
                  </div>
                  
                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center gap-8 text-sm">
                    <a href="/" className="hover:opacity-70 transition-opacity">HOME</a>
                    <a href="/products" className="hover:opacity-70 transition-opacity">SHOP</a>
                    <a href="/about" className="hover:opacity-70 transition-opacity">ABOUT US</a>
                    <a href="/contact" className="hover:opacity-70 transition-opacity">CONTACT</a>
                  </nav>
                  
                  {/* Desktop Auth */}
                  <div className="hidden md:block">
                    <AuthNav />
                  </div>
                  
                  {/* Mobile Menu Button */}
                  <MobileNav />
                </div>
              </div>
            </header>
            {children}
            <Footer />
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}

