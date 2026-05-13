"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Clock, Layers, ArrowRight } from "lucide-react";
import { coursesApi } from "@/lib/endpoints";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Skeleton, EmptyState } from "@/components/ui/feedback";
import { formatDuration } from "@/lib/utils";

const LEVEL_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
} as const;

export default function CoursesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: coursesApi.list,
  });

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
      {/* Header */}
      <header className="mb-10 lg:mb-14">
        <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-2">
          The catalog
        </p>
        <h1 className="font-display text-4xl lg:text-5xl text-ink-900 leading-tight">
          Courses to <span className="italic text-accent-600">explore</span>.
        </h1>
        <p className="text-ink-500 mt-2 max-w-xl">
          Pick any course and start at lesson one. Each lesson is short,
          interactive, and ends with a quiz.
        </p>
      </header>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-56" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <Card>
          <CardBody>
            <EmptyState
              icon={<Layers className="h-5 w-5" />}
              title="No courses available yet"
              description="Check back soon — we're cooking up something good."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((course, idx) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group block"
            >
              <Card className="h-full hover:border-ink-400 hover:-translate-y-0.5 transition-all duration-300">
                <CardBody className="space-y-4">
                  {/* Visual block */}
                  <div className="aspect-[5/3] rounded-md bg-gradient-to-br from-ink-100 to-ink-50 relative overflow-hidden border border-ink-200/40">
                    <div className="absolute inset-0 grid-bg opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-7xl text-ink-900/85 group-hover:text-accent-600 transition-colors">
                        {(course.icon_key || course.title)[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 text-2xs font-mono text-ink-400">
                      0{idx + 1}
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline">{LEVEL_LABELS[course.level]}</Badge>
                    {course.estimated_minutes > 0 && (
                      <span className="inline-flex items-center gap-1 text-2xs text-ink-500">
                        <Clock className="h-3 w-3" />
                        {formatDuration(course.estimated_minutes * 60)}
                      </span>
                    )}
                    <span className="text-2xs text-ink-500">·</span>
                    <span className="text-2xs text-ink-500">
                      {course.lessons_count} lessons
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl text-ink-900 leading-tight tracking-tight mb-1.5">
                      {course.title}
                    </h3>
                    {course.short_description && (
                      <p className="text-sm text-ink-500 line-clamp-2 leading-relaxed">
                        {course.short_description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-medium text-ink-700 group-hover:text-accent-600 transition-colors">
                    Start course
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
