"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Problems", href: "/problem" },
  { label: "Discuss", href: "/discuss" },
  { label: "Contest", href: "/contest" },
  { label: "Profile", href: "/profile" },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-gray-900 text-white shadow-md">
      <div className="text-xl font-bold tracking-tight text-yellow-400">
        CodeMinds
      </div>
      <ul className="flex gap-8">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`hover:text-yellow-400 ${
                pathname === item.href ? "text-yellow-400 font-semibold" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
