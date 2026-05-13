"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  User as UserIcon,
  LogOut,
  Settings,
  Users,
  BarChart3,
  GraduationCap,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth";
import { Avatar } from "@/components/ui/card";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const userNav: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/courses",   label: "Courses",   icon: BookOpen },
  { href: "/profile",   label: "Profile",   icon: UserIcon },
];

const adminNav: NavItem[] = [
  { href: "/admin",            label: "Overview",  icon: LayoutDashboard },
  { href: "/admin/courses",    label: "Courses",   icon: GraduationCap },
  { href: "/admin/lessons",    label: "Lessons",   icon: Layers },
  { href: "/admin/users",      label: "Users",     icon: Users },
  { href: "/admin/analytics",  label: "Analytics", icon: BarChart3 },
];

export function Sidebar({ variant }: { variant: "user" | "admin" }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const items = variant === "admin" ? adminNav : userNav;

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 bg-ink-50 border-r border-ink-200/70">
      {/* Brand */}
      <div className="px-5 pt-6 pb-5">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="h-7 w-7 rounded-md bg-ink-900 text-accent-300 flex items-center justify-center transition-transform group-hover:rotate-[-4deg]">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl text-ink-900 tracking-tight">
            Frontend<span className="italic text-accent-600">Studio</span>
          </span>
        </Link>
        {variant === "admin" && (
          <span className="inline-flex items-center gap-1 mt-2 px-1.5 py-0.5 rounded bg-ink-900 text-2xs text-white font-medium">
            ADMIN
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        {items.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href + "/")) ||
            (item.href === "/admin" && pathname === "/admin");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-ink-900 text-white"
                  : "text-ink-600 hover:text-ink-900 hover:bg-ink-100"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {variant === "user" && user?.role === "admin" && (
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm text-ink-600 hover:text-ink-900 hover:bg-ink-100 transition-colors mt-3 border-t border-ink-200 pt-3"
          >
            <Settings className="h-4 w-4" />
            <span>Admin panel</span>
          </Link>
        )}
      </nav>

      {/* User block */}
      {user && (
        <div className="p-3 border-t border-ink-200/70">
          <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-ink-100 transition-colors group">
            <Avatar name={user.full_name || user.username} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-ink-900 truncate">
                {user.full_name || user.username}
              </p>
              <p className="text-2xs text-ink-500 truncate">{user.email}</p>
            </div>
            <button
              onClick={logout}
              className="text-ink-400 hover:text-ink-700 transition-colors p-1"
              aria-label="Log out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
