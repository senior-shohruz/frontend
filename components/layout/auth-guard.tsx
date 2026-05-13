"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
import { LoadingScreen } from "@/components/ui/feedback";

export function AuthGuard({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode;
  requireAdmin?: boolean;
}) {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
    if (!user) {
      router.replace("/login");
    } else if (requireAdmin && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, isHydrated, requireAdmin, router]);

  if (!isHydrated) return <LoadingScreen />;
  if (!user) return <LoadingScreen />;
  if (requireAdmin && user.role !== "admin") return <LoadingScreen />;

  return <>{children}</>;
}
