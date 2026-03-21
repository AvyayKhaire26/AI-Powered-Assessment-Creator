"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MOBILE_ITEMS = [
  { label: "Home", href: "/", icon: "home" },
  { label: "My Groups", href: "/groups", icon: "groups" },
  { label: "Library", href: "/library", icon: "library" },
  { label: "AI Toolkit", href: "/toolkit", icon: "toolkit" },
];

export default function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--color-cta-black)] flex items-center justify-around px-2 py-3 z-50">
      {MOBILE_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
            <div className={`p-1 rounded-lg ${active ? "bg-white/10" : ""}`}>
              <div className="w-5 h-5 bg-gray-400 rounded" />
            </div>
            <span className={`text-xs ${active ? "text-white" : "text-gray-400"}`}>{item.label}</span>
          </Link>
        );
      })}
      {/* FAB */}
      <Link
        href="/assignments/create"
        className="absolute right-4 -top-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
      >
        <span className="text-2xl text-[var(--color-text-primary)] font-light">+</span>
      </Link>
    </nav>
  );
}
