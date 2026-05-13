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
  full_name: z.string().min(1, "Your name is required").max(100),
  email: z.string().email("Enter a valid email address"),
  username: z
    .string()
    .min(3, "At least 3 characters")
    .max(50)
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, and underscore only"),
  password: z.string().min(8, "At least 8 characters").max(128),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerUser = useAuthStore((s) => s.register);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
      toast.success("Account created — let's go!");
      router.replace("/dashboard");
    } catch {
      toast.error(useAuthStore.getState().error || "Registration failed");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl text-ink-900 leading-tight">
          Create your <span className="italic text-accent-600">account</span>.
        </h1>
        <p className="text-sm text-ink-500 mt-1.5">
          Free forever. No credit card required.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="full_name">Full name</Label>
          <Input
            id="full_name"
            autoComplete="name"
            placeholder="Ada Lovelace"
            error={errors.full_name?.message}
            {...register("full_name")}
          />
        </div>

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
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            autoComplete="username"
            placeholder="ada_99"
            error={errors.username?.message}
            {...register("username")}
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          Create account
        </Button>
      </form>

      <p className="text-sm text-center text-ink-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-ink-900 underline underline-offset-2 hover:text-accent-600"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
