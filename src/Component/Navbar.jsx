"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/authContext";
import { toast } from "sonner";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const commonNavItems = [
    { label: "Problems", href: "/problem" },
    { label: "Contest", href: "/contest" },
  ];

  const guestNavItems = [
    { label: "Login", href: "/login" },
    { label: "Register", href: "/register" },
  ];

  const authNavItems = [
    {
      label: "Dashboard",
      href: user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard",
    },
    { label: "Profile", href: "/profile" },
  ];

  const navItems = isAuthenticated
    ? [...commonNavItems, ...authNavItems]
    : [...commonNavItems, ...guestNavItems];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    setIsOpen(false);
  };

  const renderNavLink = (item) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setIsOpen(false)}
      className={`block px-4 py-2 text-lg md:text-base hover:text-yellow-400 ${
        pathname === item.href ? "text-yellow-400 font-semibold" : ""
      }`}
    >
      {item.label}
    </Link>
  );

  return (
    <nav className="bg-gray-900 text-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-xl font-bold tracking-tight text-yellow-400">
          <Link
            href="/"
            className={`hover:text-yellow-400 ${
              pathname === "/" ? "text-yellow-400 font-semibold" : ""
            }`}
          >
            CodeMinds
          </Link>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map(renderNavLink)}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="hover:text-yellow-300 font-semibold"
            >
              Logout
            </button>
          )}
        </div>

        {/* Hamburger button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile slide-in nav */}
      {isOpen && (
        <div className="md:hidden fixed top-0 right-0 w-64 h-full bg-gray-800 text-white shadow-lg z-50 transition-transform duration-300 ease-in-out transform translate-x-0">
          <div className="flex justify-between items-center px-4 py-4 border-b border-gray-700">
            <span className="text-yellow-400 font-bold text-lg">Menu</span>
            <button onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>
          </div>
          <div className="flex flex-col px-2 py-4 space-y-2">
            {navItems.map(renderNavLink)}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-left px-4 py-2 text-lg hover:text-yellow-300"
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
