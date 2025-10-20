"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/authContext";
import { toast } from "sonner";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const commonNavItems = [
     { label: "Leaderboard", href: "/leaderboard" },
    { label: "Problems", href: "/problem" },
   
  ];

  const guestNavItems = [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
  ];

  const authNavItems = [
    { label: "Profile", href: "/profile" },
    { label: "Playlists", href: "/playlist" },
    {
      label: "Dashboard",
      href: user?.role === "admin" ? "/dashboard/admin" : "/dashboard/user",
    },
    
  ];

  const navItems = isAuthenticated
    ? [...commonNavItems, ...authNavItems]
    : [...commonNavItems, ...guestNavItems];

  const handleLogout = () => {
    logout();
    toast("Logged out successfully!");
    setIsOpen(false);
  };

  const renderNavLink = (item) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setIsOpen(false)}
      className={`block px-4 py-2 text-base font-medium transition-colors rounded-xl ${
        pathname === item.href 
          ? "text-[#6366F1] dark:text-[#818CF8] bg-[#EEF2FF] dark:bg-[#312E81] font-semibold" 
          : "text-[#111827] dark:text-[#E2E8F0] hover:text-[#6366F1] dark:hover:text-[#818CF8] hover:bg-[#F3F4F6] dark:hover:bg-[#1E293B]"
      }`}
    >
      {item.label}
    </Link>
  );

  return (
    <nav className="bg-white dark:bg-[#1E293B] shadow-md border-b border-[#CBD5E1] dark:border-[#334155] sticky top-0 z-50 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-xl font-bold tracking-tight">
            <Link
              href="/"
              className="flex items-center space-x-2 text-[#6366F1] dark:text-[#818CF8] hover:text-[#4F46E5] dark:hover:text-[#6366F1] transition-colors"
            >
              <span>CodeMinds</span>
            </Link>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex gap-2 items-center">
            {navItems.map(renderNavLink)}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-base font-medium text-[#111827] dark:text-[#E2E8F0] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
              >
                Logout
              </button>
            )}
            <ThemeToggle />
          </div>

          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl hover:bg-[#F3F4F6] dark:hover:bg-[#334155] transition-colors"
            >
              {isOpen ? <X size={24} className="text-[#111827] dark:text-[#E2E8F0]" /> : <Menu size={24} className="text-[#111827] dark:text-[#E2E8F0]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile slide-in nav */}
        {isOpen && (
          <div className="md:hidden fixed top-0 right-0 w-64 h-[100vh]  bg-white dark:bg-[#1E293B] shadow-2xl z-50 animate-slide-in border-l border-[#CBD5E1] dark:border-[#334155]">
            <div className="flex justify-between items-center px-4 py-4 border-b border-[#CBD5E1] dark:border-[#334155]">
              <span className="text-[#6366F1] dark:text-[#818CF8] font-bold text-lg">Menu</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-[#F3F4F6] dark:hover:bg-[#334155] transition-colors"
              >
                <X size={24} className="text-[#111827] dark:text-[#E2E8F0]" />
              </button>
            </div>
            <div className="flex flex-col px-2 py-4 space-y-2">
              {navItems.map(renderNavLink)}
              {isAuthenticated && (
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-2 text-base font-medium text-[#111827] dark:text-[#E2E8F0] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
    </nav>
  );
}
