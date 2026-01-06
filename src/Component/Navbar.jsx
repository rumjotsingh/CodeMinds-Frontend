"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { toast } from "sonner";
import { useState } from "react";
import { Menu, X, Search, User, Award, LogOut, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // LeetCode-style navigation items
  const mainNavItems = [
    { label: "Explore", href: "/" },
    { label: "Problems", href: "/problem" },
    { label: "Contest", href: "/contest" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Discuss", href: "/about-us" },
  ];

  const handleLogout = () => {
    logout();
    toast("Logged out successfully!");
    setIsOpen(false);
  };

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || "U";
  };

  return (
    <nav className="bg-[#1a1a1a] border-b border-[#303030] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-[56px]">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-lg font-bold text-[#eff1f6] hover:text-[#00b8a3]"
            >
              CodeMinds
            </Link>

            {/* Main Navigation Tabs - Desktop */}
            <div className="hidden md:flex items-center gap-1">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium rounded transition-colors ${
                    pathname === item.href
                      ? "text-[#00b8a3] bg-[#00b8a320]"
                      : "text-[#eff1f6bf] hover:text-[#eff1f6] hover:bg-[#303030]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search - Desktop */}
            <div className="hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#eff1f6bf] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  className="w-64 pl-10 pr-4 py-1.5 text-sm bg-[#282828] border border-[#303030] rounded text-[#eff1f6] placeholder-[#eff1f6bf] focus:outline-none focus:ring-1 focus:ring-[#00b8a3] focus:border-[#00b8a3]"
                  onFocus={() => router.push("/problem")}
                />
              </div>
            </div>

            {/* User Menu or Login */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden md:flex items-center gap-2 hover:opacity-80">
                  <Avatar className="w-8 h-8 border border-[#303030]">
                    <AvatarFallback className="bg-[#00b8a3] text-white text-xs font-semibold">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#282828] border-[#303030]">
                  <div className="px-2 py-1.5 text-sm font-semibold text-[#eff1f6]">{user?.name || user?.email}</div>
                  <DropdownMenuSeparator className="bg-[#303030]" />
                  <DropdownMenuItem asChild className="text-[#eff1f6bf] hover:text-[#eff1f6] hover:bg-[#303030] focus:bg-[#303030]">
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-[#eff1f6bf] hover:text-[#eff1f6] hover:bg-[#303030] focus:bg-[#303030]">
                    <Link href="/playlist" className="flex items-center gap-2 cursor-pointer">
                      <Award className="w-4 h-4" />
                      Playlists
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="text-[#eff1f6bf] hover:text-[#eff1f6] hover:bg-[#303030] focus:bg-[#303030]">
                    <Link
                      href={user?.role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#303030]" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-[#ff375f] cursor-pointer hover:bg-[#303030] focus:bg-[#303030]"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-1.5 text-sm font-medium text-[#eff1f6] hover:text-[#00b8a3]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-1.5 text-sm font-medium text-white bg-[#00b8a3] hover:bg-[#00a392] rounded"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded hover:bg-[#303030]"
            >
              {isOpen ? (
                <X size={20} className="text-[#eff1f6]" />
              ) : (
                <Menu size={20} className="text-[#eff1f6]" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[#303030] bg-[#1a1a1a]">
          <div className="px-4 py-3 space-y-2">
            {/* Search Mobile */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#eff1f6bf] w-4 h-4" />
              <input
                type="text"
                placeholder="Search problems..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-[#282828] border border-[#303030] rounded text-[#eff1f6] placeholder-[#eff1f6bf] focus:outline-none focus:ring-1 focus:ring-[#00b8a3]"
                onFocus={() => {
                  router.push("/problem");
                  setIsOpen(false);
                }}
              />
            </div>

            {/* Main Nav Items */}
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 text-sm font-medium rounded ${
                  pathname === item.href
                    ? "text-[#00b8a3] bg-[#00b8a320]"
                    : "text-[#eff1f6bf] hover:text-[#eff1f6] hover:bg-[#303030]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth Section */}
            {isAuthenticated ? (
              <>
                <div className="border-t border-[#303030] my-2"></div>
                <Link
                  href="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#eff1f6bf] hover:text-[#eff1f6] hover:bg-[#303030] rounded"
                >
                  Profile
                </Link>
                <Link
                  href="/playlist"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#eff1f6bf] hover:text-[#eff1f6] hover:bg-[#303030] rounded"
                >
                  Playlists
                </Link>
                <Link
                  href={user?.role === "admin" ? "/dashboard/admin" : "/dashboard/user"}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#eff1f6bf] hover:text-[#eff1f6] hover:bg-[#303030] rounded"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm font-medium text-[#ff375f] hover:bg-[#303030] rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="border-t border-[#303030] my-2"></div>
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-[#00b8a3] hover:bg-[#00b8a320] rounded"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 text-sm font-medium text-white bg-[#00b8a3] hover:bg-[#00a392] rounded text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
