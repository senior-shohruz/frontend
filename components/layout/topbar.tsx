"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth";

const userLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/courses",   label: "Courses" },
  { href: "/profile",   label: "Profile" },
];

const adminLinks = [
  { href: "/admin",           label: "Overview" },
  { href: "/admin/courses",   label: "Courses" },
  { href: "/admin/lessons",   label: "Lessons" },
  { href: "/admin/users",     label: "Users" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function MobileTopbar({ variant }: { variant: "user" | "admin" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const links = variant === "admin" ? adminLinks : userLinks;

  return (
    <>
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-ink-50/90 backdrop-blur border-b border-ink-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-ink-900 text-accent-300 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-lg">
            Frontend<span className="italic text-accent-600">Studio</span>
          </span>
        </Link>
        <button onClick={() => setOpen(true)} className="p-2 -m-2 text-ink-700">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink-950/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white border-l border-ink-200 flex flex-col animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-ink-100">
              <span className="font-display text-lg">Menu</span>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-md hover:bg-ink-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm",
                    pathname === l.href
                      ? "bg-ink-900 text-white"
                      : "text-ink-700 hover:bg-ink-100"
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            {user && (
              <div className="p-3 border-t border-ink-100">
                <p className="text-xs font-medium text-ink-900">{user.full_name || user.username}</p>
                <p className="text-2xs text-ink-500 mb-3">{user.email}</p>
                <button
                  onClick={logout}
                  className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-xs text-ink-600 hover:bg-ink-100"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
