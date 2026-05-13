"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Flame, Trophy, Target, BookOpen, ArrowRight, Sparkles, ChevronRight,
} from "lucide-react";
import { progressApi } from "@/lib/endpoints";
import { useAuthStore } from "@/lib/auth";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  const { data: analytics, isLoading: aLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: progressApi.myAnalytics,
  });

  const { data: courseProgress, isLoading: cLoading } = useQuery({
    queryKey: ["my-courses"],
    queryFn: progressApi.myCourses,
  });

  const { data: badges } = useQuery({
    queryKey: ["my-badges"],
    queryFn: progressApi.myBadges,
  });

  const inProgressCourse = courseProgress?.find(
    (c) => c.completed_lessons > 0 && c.completed_lessons < c.total_lessons
  );

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-12 space-y-10">
      {/* Header */}
      <header>
        <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-2">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
        <h1 className="font-display text-4xl lg:text-5xl text-ink-900 leading-tight">
          Hey, <span className="italic text-accent-600">{user?.full_name?.split(" ")[0] || user?.username}</span>.
        </h1>
        <p className="text-ink-500 text-base mt-1">
          {analytics?.streak_days
            ? `${analytics.streak_days}-day streak — keep it going.`
            : "Let's start something today."}
        </p>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          icon={Sparkles}
          label="Total XP"
          value={analytics?.total_xp ?? 0}
          loading={aLoading}
          accent
        />
        <StatCard
          icon={Trophy}
          label={`Level ${analytics?.level ?? 1}`}
          value={`${analytics?.xp_to_next_level ?? 0} XP to next`}
          loading={aLoading}
          smallValue
        />
        <StatCard
          icon={Flame}
          label="Day streak"
          value={analytics?.streak_days ?? 0}
          loading={aLoading}
        />
        <StatCard
          icon={Target}
          label="Lessons done"
          value={analytics?.lessons_completed ?? 0}
          loading={aLoading}
        />
      </div>

      {/* Continue learning */}
      {inProgressCourse && (
        <section>
          <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-3">
            Pick up where you left off
          </p>
          <Link
            href={`/courses/${inProgressCourse.course_slug}`}
            className="group block bg-ink-900 text-white rounded-xl overflow-hidden relative hover:shadow-popover transition-shadow"
          >
            <div className="absolute inset-0 grid-bg opacity-[0.06]" />
            <div className="absolute -right-24 top-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-accent-500/15 blur-3xl" />
            <div className="relative p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex-1 min-w-0">
                <Badge variant="accent" className="mb-3">
                  In progress
                </Badge>
                <h2 className="font-display text-3xl lg:text-4xl tracking-tight text-white">
                  {inProgressCourse.course_title}
                </h2>
                <div className="flex items-center gap-3 mt-4 max-w-md">
                  <Progress
                    value={inProgressCourse.progress_percentage}
                    variant="accent"
                    className="flex-1"
                  />
                  <span className="text-2xs font-mono text-accent-300 whitespace-nowrap">
                    {inProgressCourse.completed_lessons}/{inProgressCourse.total_lessons}
                  </span>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-accent-300 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </Link>
        </section>
      )}

      {/* Two-column section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Courses */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500">
              Your courses
            </p>
            <Link
              href="/courses"
              className="text-xs text-ink-600 hover:text-ink-900 inline-flex items-center gap-1"
            >
              All courses <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {cLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          ) : courseProgress && courseProgress.length > 0 ? (
            <div className="space-y-2">
              {courseProgress.slice(0, 5).map((c) => (
                <CourseProgressRow key={c.course_id} course={c} />
              ))}
            </div>
          ) : (
            <Card>
              <CardBody className="py-12 text-center">
                <BookOpen className="h-8 w-8 text-ink-300 mx-auto mb-3" />
                <p className="font-display text-xl text-ink-900 mb-1">
                  No courses yet
                </p>
                <p className="text-sm text-ink-500 mb-4">
                  Browse the catalog and start your first lesson.
                </p>
                <Link href="/courses">
                  <Button size="sm">
                    Browse courses <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </CardBody>
            </Card>
          )}
        </section>

        {/* Badges */}
        <section>
          <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-4">
            Badges earned
          </p>
          <Card>
            <CardBody>
              {badges && badges.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {badges.slice(0, 6).map((ub) => (
                    <div
                      key={ub.id}
                      className="flex flex-col items-center text-center group"
                      title={ub.badge.description}
                    >
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent-300 to-accent-500 flex items-center justify-center mb-1.5 shadow-soft group-hover:scale-105 transition-transform">
                        <Trophy className="h-5 w-5 text-white" strokeWidth={2} />
                      </div>
                      <p className="text-2xs font-medium text-ink-700 leading-tight">
                        {ub.badge.name}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Trophy className="h-7 w-7 text-ink-300 mx-auto mb-2" />
                  <p className="text-xs text-ink-500">
                    Complete lessons to earn badges.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </section>
      </div>
    </div>
  );
}

// ─── Sub-components ─────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  loading,
  accent,
  smallValue,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  loading?: boolean;
  accent?: boolean;
  smallValue?: boolean;
}) {
  return (
    <Card className={accent ? "bg-ink-900 text-white border-ink-900" : ""}>
      <CardBody className="space-y-2">
        <div className="flex items-center gap-1.5">
          <Icon
            className={`h-3.5 w-3.5 ${accent ? "text-accent-400" : "text-ink-400"}`}
          />
          <span
            className={`text-2xs font-mono uppercase tracking-wider ${
              accent ? "text-ink-300" : "text-ink-500"
            }`}
          >
            {label}
          </span>
        </div>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div
            className={`font-display ${smallValue ? "text-base" : "text-3xl"} ${
              accent ? "text-white" : "text-ink-900"
            }`}
          >
            {value}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function CourseProgressRow({
  course,
}: {
  course: {
    course_id: number;
    course_title: string;
    course_slug: string;
    icon_key: string | null;
    total_lessons: number;
    completed_lessons: number;
    progress_percentage: number;
  };
}) {
  return (
    <Link
      href={`/courses/${course.course_slug}`}
      className="flex items-center gap-4 p-4 bg-white border border-ink-200/70 rounded-lg hover:border-ink-400 hover:shadow-soft transition-all group"
    >
      <div className="h-10 w-10 rounded-lg bg-ink-100 flex items-center justify-center font-display text-xl text-ink-700 group-hover:bg-accent-100 group-hover:text-accent-700 transition-colors flex-shrink-0">
        {(course.icon_key || course.course_title)[0].toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <h3 className="font-medium text-sm text-ink-900 truncate">
            {course.course_title}
          </h3>
          <span className="text-2xs font-mono text-ink-500 ml-2 whitespace-nowrap">
            {course.completed_lessons}/{course.total_lessons}
          </span>
        </div>
        <Progress value={course.progress_percentage} variant="default" />
      </div>
      <ChevronRight className="h-4 w-4 text-ink-400 group-hover:text-ink-700 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </Link>
  );
}
