// File: app/components/nav/MainNav.jsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/app/lib/supabase/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, X } from "lucide-react";
import createclientcomponentclient from "@/app/lib/supabase/client";
export default function MainNav() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      getUser();
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/listings" },
    { name: "Categories", path: "/categories" },
    { name: "How It Works", path: "/how-it-works" },
  ];

  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-indigo-600">
            SkipFurther
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium ${
                  pathname === item.path
                    ? "text-indigo-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-sm ml-2"
              />
            </div>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/create-listing">
                  <Button variant="default" size="sm">
                    Sell a Spot
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.path
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mt-4">
              <Search className="h-4 w-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-sm ml-2 w-full"
              />
            </div>

            {user ? (
              <>
                <Link
                  href="/create-listing"
                  className="block w-full mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="default" className="w-full">
                    Sell a Spot
                  </Button>
                </Link>
                <Link
                  href="/dashboard"
                  className="block w-full mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Dashboard
                  </Button>
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-3 py-2 mt-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block w-full mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link
                  href="/auth/signup"
                  className="block w-full mt-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="default" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
