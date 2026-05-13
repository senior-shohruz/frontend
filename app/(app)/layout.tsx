"use client";

import { AuthGuard } from "@/components/layout/auth-guard";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileTopbar } from "@/components/layout/topbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-ink-50">
        <Sidebar variant="user" />
        <div className="flex-1 flex flex-col min-w-0">
          <MobileTopbar variant="user" />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
