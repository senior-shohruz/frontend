"use client";

import { useQuery } from "@tanstack/react-query";
import { Trophy, Sparkles, Flame, Calendar } from "lucide-react";
import { useAuthStore } from "@/lib/auth";
import { progressApi } from "@/lib/endpoints";
import { Avatar, Card, CardBody, Badge } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/feedback";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api, getErrorMessage } from "@/lib/api";
import { toast } from "sonner";

const passwordSchema = z
  .object({
    current_password: z.string().min(1),
    new_password: z.string().min(8).max(128),
    confirm: z.string(),
  })
  .refine((d) => d.new_password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [pwOpen, setPwOpen] = useState(false);

  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: progressApi.myAnalytics,
  });

  const { data: badges } = useQuery({
    queryKey: ["my-badges"],
    queryFn: progressApi.myBadges,
  });

  if (!user) return <Skeleton className="h-64 m-10" />;

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-8 lg:py-12 space-y-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-end gap-6">
        <Avatar name={user.full_name || user.username} size="lg" className="h-20 w-20 text-xl" />
        <div className="flex-1 min-w-0">
          <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-1">
            @{user.username}
          </p>
          <h1 className="font-display text-4xl lg:text-5xl text-ink-900 leading-tight tracking-tight">
            {user.full_name || user.username}
          </h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="outline">{user.email}</Badge>
            {user.role === "admin" && <Badge variant="accent">Admin</Badge>}
            <span className="text-2xs text-ink-500 inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined {formatDate(user.created_at)}
            </span>
          </div>
        </div>
        <Button variant="outline" onClick={() => setPwOpen(true)}>
          Change password
        </Button>
      </header>

      {/* Stats */}
      <section>
        <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-4">
          Your stats
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={Sparkles} label="Total XP" value={analytics?.total_xp ?? 0} />
          <StatCard icon={Trophy} label="Level" value={analytics?.level ?? 1} />
          <StatCard icon={Flame} label="Streak" value={`${analytics?.streak_days ?? 0} d`} />
          <StatCard icon={Calendar} label="Lessons" value={analytics?.lessons_completed ?? 0} />
        </div>
      </section>

      {/* Badges */}
      <section>
        <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-4">
          Badges ({badges?.length ?? 0})
        </p>
        {badges && badges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {badges.map((ub) => (
              <Card key={ub.id}>
                <CardBody className="text-center">
                  <div className="h-14 w-14 mx-auto rounded-2xl bg-gradient-to-br from-accent-300 to-accent-500 flex items-center justify-center mb-3 shadow-soft">
                    <Trophy className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="font-medium text-sm text-ink-900">{ub.badge.name}</h3>
                  <p className="text-2xs text-ink-500 mt-1 leading-snug">
                    {ub.badge.description}
                  </p>
                  <p className="text-2xs font-mono text-ink-400 mt-2">
                    Earned {formatDate(ub.earned_at)}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardBody className="py-12 text-center">
              <Trophy className="h-7 w-7 text-ink-300 mx-auto mb-2" />
              <p className="text-sm text-ink-500">No badges yet — complete lessons to earn them.</p>
            </CardBody>
          </Card>
        )}
      </section>

      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-1.5 mb-2">
          <Icon className="h-3.5 w-3.5 text-ink-400" />
          <span className="text-2xs font-mono uppercase tracking-wider text-ink-500">{label}</span>
        </div>
        <div className="font-display text-3xl text-ink-900">{value}</div>
      </CardBody>
    </Card>
  );
}

function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (data: PasswordForm) => {
    try {
      await api.post("/auth/change-password", {
        current_password: data.current_password,
        new_password: data.new_password,
      });
      toast.success("Password updated");
      reset();
      onClose();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Change password" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>Current password</Label>
          <Input type="password" error={errors.current_password?.message} {...register("current_password")} />
        </div>
        <div>
          <Label>New password</Label>
          <Input type="password" error={errors.new_password?.message} {...register("new_password")} />
        </div>
        <div>
          <Label>Confirm new password</Label>
          <Input type="password" error={errors.confirm?.message} {...register("confirm")} />
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            Update
          </Button>
        </div>
      </form>
    </Modal>
  );
}
