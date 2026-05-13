"use client";

import Link from "next/link";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Play, Clock, CheckCircle2, Circle } from "lucide-react";
import { coursesApi, progressApi } from "@/lib/endpoints";
import { Skeleton } from "@/components/ui/feedback";
import { Badge } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";

const LEVEL_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", slug],
    queryFn: () => coursesApi.getBySlug(slug),
  });

  const { data: courseProgress } = useQuery({
    queryKey: ["my-courses"],
    queryFn: progressApi.myCourses,
  });

  const myProgress = courseProgress?.find((c) => c.course_slug === slug);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-8 lg:py-12 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-24" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-12">
        <p className="text-ink-500">Course not found.</p>
        <Link
          href="/courses"
          className="text-sm text-ink-700 hover:text-ink-900 mt-2 inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to courses
        </Link>
      </div>
    );
  }

  const completedLessonIds = new Set<number>(); // we don't have per-lesson here, but we know total

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
      {/* Back */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All courses
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline">{LEVEL_LABELS[course.level]}</Badge>
          {course.estimated_minutes > 0 && (
            <span className="inline-flex items-center gap-1 text-2xs text-ink-500">
              <Clock className="h-3 w-3" />
              {formatDuration(course.estimated_minutes * 60)}
            </span>
          )}
          <span className="text-2xs text-ink-400">·</span>
          <span className="text-2xs text-ink-500">
            {course.lessons.length} lessons
          </span>
        </div>

        <h1 className="font-display text-5xl lg:text-6xl text-ink-900 leading-[1.05] tracking-tight mb-4">
          {course.title}
        </h1>
        <p className="text-base lg:text-lg text-ink-600 leading-relaxed max-w-2xl">
          {course.description}
        </p>

        {myProgress && myProgress.completed_lessons > 0 && (
          <div className="flex items-center gap-3 mt-6 max-w-md">
            <div className="flex-1 h-1 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-500 transition-all duration-500"
                style={{ width: `${myProgress.progress_percentage}%` }}
              />
            </div>
            <span className="text-2xs font-mono text-ink-500 whitespace-nowrap">
              {myProgress.completed_lessons}/{myProgress.total_lessons} ·{" "}
              {Math.round(myProgress.progress_percentage)}%
            </span>
          </div>
        )}
      </header>

      {/* Lessons */}
      <section>
        <h2 className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-4">
          Lessons
        </h2>

        {course.lessons.length === 0 ? (
          <div className="bg-white border border-ink-200/70 rounded-lg p-8 text-center">
            <p className="text-sm text-ink-500">
              This course doesn't have any lessons yet.
            </p>
          </div>
        ) : (
          <ol className="bg-white border border-ink-200/70 rounded-lg divide-y divide-ink-100 overflow-hidden">
            {course.lessons.map((lesson, idx) => {
              const isDone = completedLessonIds.has(lesson.id);
              return (
                <li key={lesson.id}>
                  <Link
                    href={`/lessons/${lesson.id}`}
                    className="flex items-center gap-4 p-4 lg:p-5 hover:bg-ink-50 transition-colors group"
                  >
                    {/* Number / status */}
                    <div className="w-10 flex-shrink-0 flex justify-center">
                      {isDone ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <span className="font-mono text-2xs text-ink-400 group-hover:text-ink-700">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-ink-900 mb-0.5">
                        {lesson.title}
                      </h3>
                      {lesson.description && (
                        <p className="text-xs text-ink-500 line-clamp-1">
                          {lesson.description}
                        </p>
                      )}
                    </div>

                    {/* Duration */}
                    {lesson.video_duration_seconds > 0 && (
                      <span className="text-2xs font-mono text-ink-400 hidden sm:inline">
                        {formatDuration(lesson.video_duration_seconds)}
                      </span>
                    )}

                    {/* XP */}
                    <span className="text-2xs font-mono text-accent-600 whitespace-nowrap">
                      +{lesson.xp_reward} XP
                    </span>

                    {/* Play */}
                    <Play className="h-3.5 w-3.5 text-ink-400 group-hover:text-ink-900 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </div>
  );
}
