"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users, BookOpen, Layers, Activity, TrendingUp, Award, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { adminApi } from "@/lib/endpoints";
import { Card, CardBody } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/feedback";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: adminApi.dashboard,
  });

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-12 space-y-10">
      <header>
        <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-2">
          Admin · Overview
        </p>
        <h1 className="font-display text-4xl lg:text-5xl text-ink-900 leading-tight">
          The <span className="italic text-accent-600">control room</span>.
        </h1>
        <p className="text-ink-500 mt-2">
          Everything happening across the platform, at a glance.
        </p>
      </header>

      {/* Top stats */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            icon={Users}
            label="Total users"
            value={data?.total_users ?? 0}
            sub={`${data?.new_users_last_30d ?? 0} new this month`}
            loading={isLoading}
          />
          <StatCard
            icon={Activity}
            label="Active (7d)"
            value={data?.active_users_last_7d ?? 0}
            sub="users with activity"
            loading={isLoading}
          />
          <StatCard
            icon={BookOpen}
            label="Courses"
            value={data?.published_courses ?? 0}
            sub={`${data?.total_courses ?? 0} total`}
            loading={isLoading}
          />
          <StatCard
            icon={Layers}
            label="Lessons"
            value={data?.total_lessons ?? 0}
            sub={`${data?.lessons_completed_total ?? 0} completions`}
            loading={isLoading}
          />
        </div>
      </section>

      {/* Two-column section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Popular courses */}
        <section className="lg:col-span-2">
          <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-3">
            Most popular courses
          </p>
          <Card>
            {isLoading ? (
              <CardBody>
                <Skeleton className="h-32" />
              </CardBody>
            ) : data?.popular_courses && data.popular_courses.length > 0 ? (
              <div className="divide-y divide-ink-100">
                {data.popular_courses.map((c, idx) => (
                  <div
                    key={c.course_id}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-ink-50 transition-colors"
                  >
                    <span className="font-mono text-2xs text-ink-400 w-6">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{c.title}</p>
                      <p className="text-2xs text-ink-500 mt-0.5">
                        {c.enrolled_users} enrolled · {Math.round(c.completion_rate)}% completion
                      </p>
                    </div>
                    <TrendingUp className="h-3.5 w-3.5 text-accent-500" />
                  </div>
                ))}
              </div>
            ) : (
              <CardBody className="py-12 text-center">
                <p className="text-sm text-ink-500">No course data yet.</p>
              </CardBody>
            )}
          </Card>
        </section>

        {/* Quick actions */}
        <section>
          <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-3">
            Quick actions
          </p>
          <div className="space-y-2">
            <QuickLink href="/admin/courses" icon={BookOpen} label="Manage courses" />
            <QuickLink href="/admin/lessons" icon={Layers} label="Edit lessons & quizzes" />
            <QuickLink href="/admin/users" icon={Users} label="View users" />
            <QuickLink href="/admin/analytics" icon={Award} label="Detailed analytics" />
          </div>

          <div className="mt-6 p-4 bg-ink-900 text-white rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-[0.06]" />
            <div className="relative">
              <p className="text-2xs font-mono uppercase tracking-wider text-accent-400 mb-1">
                Quiz attempts
              </p>
              <p className="font-display text-3xl">
                {data?.total_quiz_attempts ?? 0}
              </p>
              <p className="text-2xs text-ink-300 mt-1">All-time submissions</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  loading,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  sub?: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-center gap-1.5 mb-2">
          <Icon className="h-3.5 w-3.5 text-ink-400" />
          <span className="text-2xs font-mono uppercase tracking-wider text-ink-500">
            {label}
          </span>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-12" />
        ) : (
          <div className="font-display text-3xl text-ink-900">{value}</div>
        )}
        {sub && <p className="text-2xs text-ink-500 mt-1">{sub}</p>}
      </CardBody>
    </Card>
  );
}

function QuickLink({
  href, icon: Icon, label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-4 py-3 bg-white border border-ink-200/70 rounded-lg hover:border-ink-400 hover:shadow-soft transition-all group"
    >
      <Icon className="h-4 w-4 text-ink-500 group-hover:text-accent-600" />
      <span className="flex-1 text-sm font-medium text-ink-900">{label}</span>
      <ChevronRight className="h-3.5 w-3.5 text-ink-400 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
