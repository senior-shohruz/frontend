"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/auth";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && user) {
      router.replace(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, isHydrated, router]);

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink-50">
      {/* Form side */}
      <div className="flex flex-col justify-between px-6 py-8 lg:px-16 lg:py-12">
        <Link href="/" className="flex items-center gap-2 group w-fit">
          <div className="h-7 w-7 rounded-md bg-ink-900 text-accent-300 flex items-center justify-center transition-transform group-hover:rotate-[-6deg]">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl tracking-tight">
            Frontend<span className="italic text-accent-600">Studio</span>
          </span>
        </Link>

        <div className="flex-1 flex items-center justify-center py-8">
          <div className="w-full max-w-sm">{children}</div>
        </div>

        <p className="text-2xs text-ink-400 font-mono">
          © {new Date().getFullYear()} Frontend Studio
        </p>
      </div>

      {/* Editorial side - decorative quote */}
      <div className="hidden lg:flex relative bg-ink-900 text-ink-50 p-16 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.05]" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-accent-700/10 blur-3xl" />

        <div className="relative flex flex-col justify-between">
          <p className="text-2xs uppercase tracking-[0.2em] text-accent-400">
            A note from us
          </p>

          <div>
            <blockquote className="font-display text-4xl xl:text-5xl leading-[1.1] tracking-tight">
              The best way to learn frontend is to{" "}
              <span className="italic text-accent-300">build</span> things —
              and break them, and fix them, and{" "}
              <span className="italic text-accent-300">build</span> them again.
            </blockquote>
            <p className="mt-6 text-sm text-ink-400">
              Every lesson here is designed around that loop. Read a little,
              write a lot, get feedback, repeat.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-ink-700" />
            <p className="text-2xs uppercase tracking-[0.2em] text-ink-500">
              Welcome
            </p>
            <div className="h-px flex-1 bg-ink-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
