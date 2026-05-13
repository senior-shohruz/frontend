"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data);
      toast.success("Welcome back");
      const user = useAuthStore.getState().user;
      router.replace(user?.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      toast.error(useAuthStore.getState().error || "Login failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-ink-900 leading-tight">
          Welcome <span className="italic text-accent-600">back</span>.
        </h1>
        <p className="text-sm text-ink-500 mt-1.5">
          Sign in to continue your journey.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label htmlFor="password" className="mb-0">
              Password
            </Label>
            <button
              type="button"
              className="text-2xs text-ink-500 hover:text-ink-800"
              onClick={() => toast.info("Password recovery coming soon")}
            >
              Forgot?
            </button>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <p className="text-sm text-center text-ink-500">
        New here?{" "}
        <Link
          href="/register"
          className="text-ink-900 underline underline-offset-2 hover:text-accent-600"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
