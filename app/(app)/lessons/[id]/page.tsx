"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, BookText, Code2, GraduationCap } from "lucide-react";
import { coursesApi, progressApi } from "@/lib/endpoints";
import { Skeleton } from "@/components/ui/feedback";
import { CodeEditor } from "@/components/features/code-editor";
import { Quiz } from "@/components/features/quiz";
import { AITeacher } from "@/components/features/ai-teacher";
import type { CodeDraft } from "@/types";
import { cn } from "@/lib/utils";

type Tab = "lesson" | "code" | "quiz";

export default function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const lessonId = Number(id);

  const [tab, setTab] = useState<Tab>("lesson");
  const codeRef = useRef<CodeDraft | undefined>(undefined);

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => coursesApi.getLesson(lessonId),
    enabled: !!lessonId,
  });

  const { data: progress } = useQuery({
    queryKey: ["progress", lessonId],
    queryFn: () => progressApi.get(lessonId),
    enabled: !!lessonId,
  });

  // Mark lesson as in-progress on first visit
  useEffect(() => {
    if (lesson && !progress) {
      progressApi.update(lessonId, { status: "in_progress" }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson, progress, lessonId]);

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-8 space-y-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="max-w-5xl mx-auto px-6 lg:px-10 py-12">
        <p className="text-ink-500">Lesson not found.</p>
      </div>
    );
  }

  const starterCode: CodeDraft = {
    html: progress?.code_draft?.html ?? lesson.starter_code_html ?? "",
    css:  progress?.code_draft?.css  ?? lesson.starter_code_css  ?? "",
    js:   progress?.code_draft?.js   ?? lesson.starter_code_js   ?? "",
  };
  const hasCodeStarter =
    !!(lesson.starter_code_html || lesson.starter_code_css || lesson.starter_code_js);

  const onCodeChange = (code: CodeDraft) => {
    codeRef.current = code;
    progressApi.update(lessonId, { code_draft: code }).catch(() => {});
  };

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "lesson", label: "Lesson", icon: BookText },
    ...(hasCodeStarter ? [{ key: "code" as Tab, label: "Practice", icon: Code2 }] : []),
    ...(lesson.questions_count > 0
      ? [{ key: "quiz" as Tab, label: "Quiz", icon: GraduationCap }]
      : []),
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 lg:px-10 py-8 lg:py-10">
      {/* Back */}
      <Link
        href={`/courses`}
        className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-900 mb-5 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to courses
      </Link>

      {/* Header */}
      <header className="mb-8">
        <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-2">
          Lesson · +{lesson.xp_reward} XP
        </p>
        <h1 className="font-display text-4xl lg:text-5xl text-ink-900 leading-[1.05] tracking-tight">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="text-base text-ink-600 mt-3 max-w-2xl leading-relaxed">
            {lesson.description}
          </p>
        )}
      </header>

      {/* Tabs */}
      <div className="border-b border-ink-200 mb-8">
        <div className="flex gap-1 -mb-px">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors",
                  tab === t.key
                    ? "border-ink-900 text-ink-900 font-medium"
                    : "border-transparent text-ink-500 hover:text-ink-700"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {tab === "lesson" && (
          <div className="space-y-8">
            {lesson.video_url && (
              <div className="aspect-video rounded-xl overflow-hidden border border-ink-200/70 bg-ink-900">
                <VideoEmbed url={lesson.video_url} />
              </div>
            )}

            <article className="prose-lesson max-w-2xl">
              {lesson.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {lesson.content}
                </ReactMarkdown>
              ) : (
                <p className="text-ink-500">
                  This lesson doesn't have written content yet.
                </p>
              )}
            </article>
          </div>
        )}

        {tab === "code" && (
          <CodeEditor initialCode={starterCode} onChange={onCodeChange} />
        )}

        {tab === "quiz" && <Quiz lessonId={lessonId} />}
      </div>

      {/* AI Teacher floating widget */}
      <AITeacher lessonId={lessonId} getCodeContext={() => codeRef.current} />
    </div>
  );
}

// ─── Video helper ─────────────────────────────────────

function VideoEmbed({ url }: { url: string }) {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/]+)/);
  if (ytMatch) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${ytMatch[1]}`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }
  // Vimeo
  const vMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vMatch) {
    return (
      <iframe
        src={`https://player.vimeo.com/video/${vMatch[1]}`}
        className="w-full h-full"
        allow="autoplay; fullscreen; picture-in-picture"
      />
    );
  }
  // Generic <video>
  return (
    <video src={url} controls className="w-full h-full">
      Your browser doesn't support video playback.
    </video>
  );
}
