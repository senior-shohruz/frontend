"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Eye, EyeOff, Layers, GraduationCap, ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { adminApi } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Card, CardBody, Badge } from "@/components/ui/card";
import { Skeleton, EmptyState } from "@/components/ui/feedback";
import { slugify } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api";
import type { Lesson, QuizQuestionAdmin } from "@/types";

// ─── Lesson schema ───────────────────────────────
const lessonSchema = z.object({
  course_id: z.coerce.number().int().positive(),
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  content: z.string(),
  video_url: z.string().optional(),
  video_duration_seconds: z.coerce.number().int().min(0),
  starter_code_html: z.string().optional(),
  starter_code_css: z.string().optional(),
  starter_code_js: z.string().optional(),
  xp_reward: z.coerce.number().int().min(0),
  order_index: z.coerce.number().int().min(0),
  is_published: z.boolean(),
});
type LessonForm = z.infer<typeof lessonSchema>;

export default function AdminLessonsPage() {
  const qc = useQueryClient();
  const [filterCourseId, setFilterCourseId] = useState<number | undefined>();
  const [editing, setEditing] = useState<Lesson | null | undefined>(undefined);
  const [managingQuiz, setManagingQuiz] = useState<Lesson | null>(null);

  const { data: courses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => adminApi.listCourses(),
  });

  const { data: lessons, isLoading } = useQuery({
    queryKey: ["admin-lessons", filterCourseId],
    queryFn: () => adminApi.listLessons({ course_id: filterCourseId }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteLesson(id),
    onSuccess: () => {
      toast.success("Lesson deleted");
      qc.invalidateQueries({ queryKey: ["admin-lessons"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const courseTitle = (id: number) => courses?.find((c) => c.id === id)?.title ?? "—";

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
      <header className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-2">
            Admin · Lessons
          </p>
          <h1 className="font-display text-4xl text-ink-900 leading-tight">
            All lessons
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Select
            className="w-48"
            value={filterCourseId ?? ""}
            onChange={(e) => setFilterCourseId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <option value="">All courses</option>
            {courses?.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </Select>
          <Button onClick={() => setEditing(null)}>
            <Plus className="h-3.5 w-3.5" />
            New lesson
          </Button>
        </div>
      </header>

      <Card>
        {isLoading ? (
          <CardBody>
            <Skeleton className="h-32" />
          </CardBody>
        ) : !lessons || lessons.length === 0 ? (
          <CardBody>
            <EmptyState
              icon={<Layers className="h-5 w-5" />}
              title="No lessons yet"
              description="Create courses first, then add lessons to them."
            />
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium">Title</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden md:table-cell">Course</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden sm:table-cell">XP</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden md:table-cell">Quiz</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden sm:table-cell">Status</th>
                  <th className="px-5 py-3 w-24"></th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((l) => (
                  <tr key={l.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/40">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-ink-900">{l.title}</p>
                      <p className="text-2xs font-mono text-ink-500">/{l.slug}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-ink-700 hidden md:table-cell">
                      {courseTitle(l.course_id)}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-accent-600 font-mono hidden sm:table-cell">
                      +{l.xp_reward}
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <button
                        onClick={() => setManagingQuiz(l)}
                        className="text-xs text-ink-700 hover:text-accent-600 inline-flex items-center gap-1"
                      >
                        <GraduationCap className="h-3 w-3" />
                        {l.questions_count} q's
                      </button>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      {l.is_published ? (
                        <Badge variant="success"><Eye className="h-2.5 w-2.5" /> Live</Badge>
                      ) : (
                        <Badge><EyeOff className="h-2.5 w-2.5" /> Draft</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setEditing(l)}
                          className="p-1.5 rounded text-ink-500 hover:text-ink-900 hover:bg-ink-100"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${l.title}"?`)) {
                              deleteMutation.mutate(l.id);
                            }
                          }}
                          className="p-1.5 rounded text-ink-500 hover:text-danger hover:bg-red-50"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing !== undefined && courses && (
        <LessonFormModal
          lesson={editing}
          courses={courses}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin-lessons"] });
            setEditing(undefined);
          }}
        />
      )}

      {managingQuiz && (
        <QuizManagerModal
          lesson={managingQuiz}
          onClose={() => {
            setManagingQuiz(null);
            qc.invalidateQueries({ queryKey: ["admin-lessons"] });
          }}
        />
      )}
    </div>
  );
}

// ─── Lesson form ─────────────────────────────────
function LessonFormModal({
  lesson, courses, onClose, onSaved,
}: {
  lesson: Lesson | null;
  courses: { id: number; title: string }[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = lesson === null;

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm<LessonForm>({
    resolver: zodResolver(lessonSchema),
    defaultValues: lesson ? {
      course_id: lesson.course_id,
      title: lesson.title,
      slug: lesson.slug,
      description: lesson.description ?? "",
      content: lesson.content ?? "",
      video_url: lesson.video_url ?? "",
      video_duration_seconds: lesson.video_duration_seconds,
      starter_code_html: lesson.starter_code_html ?? "",
      starter_code_css: lesson.starter_code_css ?? "",
      starter_code_js: lesson.starter_code_js ?? "",
      xp_reward: lesson.xp_reward,
      order_index: lesson.order_index,
      is_published: lesson.is_published,
    } : {
      course_id: courses[0]?.id ?? 0,
      title: "", slug: "", description: "", content: "",
      video_url: "", video_duration_seconds: 0,
      starter_code_html: "", starter_code_css: "", starter_code_js: "",
      xp_reward: 10, order_index: 0, is_published: false,
    },
  });

  const titleValue = watch("title");
  const slugValue = watch("slug");
  useEffect(() => {
    if (isNew && titleValue && !slugValue) {
      setValue("slug", slugify(titleValue));
    }
  }, [titleValue, slugValue, isNew, setValue]);

  const onSubmit = async (data: LessonForm) => {
    try {
      if (isNew) {
        await adminApi.createLesson(data);
        toast.success("Lesson created");
      } else {
        await adminApi.updateLesson(lesson!.id, data);
        toast.success("Lesson updated");
      }
      onSaved();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <Modal open onClose={onClose} title={isNew ? "New lesson" : "Edit lesson"} size="xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Course</Label>
            <Select error={errors.course_id?.message} {...register("course_id")}>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Order index</Label>
            <Input type="number" {...register("order_index")} />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Title</Label>
            <Input error={errors.title?.message} {...register("title")} />
          </div>
          <div>
            <Label>Slug</Label>
            <Input error={errors.slug?.message} {...register("slug")} />
          </div>
        </div>

        <div>
          <Label>Description (one-liner)</Label>
          <Input {...register("description")} />
        </div>

        <div>
          <Label>Content (Markdown)</Label>
          <Textarea
            rows={6}
            placeholder="# Heading&#10;Lesson content in markdown..."
            className="font-mono text-xs"
            {...register("content")}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <Label>Video URL (YouTube/Vimeo/direct)</Label>
            <Input placeholder="https://youtube.com/watch?v=..." {...register("video_url")} />
          </div>
          <div>
            <Label>Video duration (seconds)</Label>
            <Input type="number" {...register("video_duration_seconds")} />
          </div>
        </div>

        <div className="border-t border-ink-100 pt-4">
          <p className="text-xs font-medium text-ink-700 mb-2">Starter code (optional)</p>
          <div className="space-y-2">
            <div>
              <Label className="text-2xs font-mono uppercase">HTML</Label>
              <Textarea rows={3} className="font-mono text-xs" {...register("starter_code_html")} />
            </div>
            <div>
              <Label className="text-2xs font-mono uppercase">CSS</Label>
              <Textarea rows={3} className="font-mono text-xs" {...register("starter_code_css")} />
            </div>
            <div>
              <Label className="text-2xs font-mono uppercase">JS</Label>
              <Textarea rows={3} className="font-mono text-xs" {...register("starter_code_js")} />
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 border-t border-ink-100 pt-4">
          <div>
            <Label>XP reward</Label>
            <Input type="number" {...register("xp_reward")} />
          </div>
          <label className="flex items-center gap-2 pt-7 cursor-pointer">
            <input type="checkbox" {...register("is_published")} className="rounded" />
            <span className="text-sm text-ink-700">Published</span>
          </label>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-ink-100">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? "Create lesson" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Quiz manager ────────────────────────────────
const questionSchema = z.object({
  question_text: z.string().min(1),
  options: z.array(z.object({ key: z.string().min(1), text: z.string().min(1) })).min(2),
  correct_option_key: z.string().min(1),
  explanation: z.string().optional(),
  points: z.coerce.number().int().min(1),
  order_index: z.coerce.number().int().min(0),
});
type QuestionForm = z.infer<typeof questionSchema>;

function QuizManagerModal({
  lesson, onClose,
}: { lesson: Lesson; onClose: () => void; }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<QuizQuestionAdmin | null | undefined>(undefined);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["admin-questions", lesson.id],
    queryFn: () => adminApi.listQuestions(lesson.id),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteQuestion(id),
    onSuccess: () => {
      toast.success("Question deleted");
      qc.invalidateQueries({ queryKey: ["admin-questions", lesson.id] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (editing !== undefined) {
    return (
      <QuestionFormModal
        lessonId={lesson.id}
        question={editing}
        onClose={() => setEditing(undefined)}
        onSaved={() => {
          qc.invalidateQueries({ queryKey: ["admin-questions", lesson.id] });
          setEditing(undefined);
        }}
      />
    );
  }

  return (
    <Modal open onClose={onClose} title={`Quiz · ${lesson.title}`} size="lg">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-ink-500">{questions?.length ?? 0} questions</p>
        <Button size="sm" onClick={() => setEditing(null)}>
          <Plus className="h-3.5 w-3.5" /> Add question
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-32" />
      ) : !questions || questions.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-5 w-5" />}
          title="No questions yet"
          description="Add quiz questions to test learners on this lesson."
        />
      ) : (
        <div className="space-y-2">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="border border-ink-200/70 rounded-md p-3 hover:bg-ink-50/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-2xs font-mono text-ink-400 mb-1">Q{idx + 1}</p>
                  <p className="text-sm text-ink-900 mb-2">{q.question_text}</p>
                  <p className="text-2xs text-ink-500">
                    {q.options.length} options · correct: <span className="font-mono uppercase text-success">{q.correct_option_key}</span> · {q.points} pt
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditing(q)}
                    className="p-1.5 rounded text-ink-500 hover:text-ink-900 hover:bg-ink-100"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this question?")) deleteMutation.mutate(q.id);
                    }}
                    className="p-1.5 rounded text-ink-500 hover:text-danger hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ─── Question form ───────────────────────────────
function QuestionFormModal({
  lessonId, question, onClose, onSaved,
}: {
  lessonId: number;
  question: QuizQuestionAdmin | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = question === null;

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
    defaultValues: question ? {
      question_text: question.question_text,
      options: question.options,
      correct_option_key: question.correct_option_key,
      explanation: question.explanation ?? "",
      points: question.points,
      order_index: question.order_index,
    } : {
      question_text: "",
      options: [
        { key: "a", text: "" },
        { key: "b", text: "" },
        { key: "c", text: "" },
        { key: "d", text: "" },
      ],
      correct_option_key: "a",
      explanation: "",
      points: 1,
      order_index: 0,
    },
  });

  const options = watch("options");

  const updateOption = (idx: number, text: string) => {
    const next = [...options];
    next[idx] = { ...next[idx], text };
    setValue("options", next);
  };

  const onSubmit = async (data: QuestionForm) => {
    try {
      if (isNew) {
        await adminApi.createQuestion({
          lesson_id: lessonId,
          ...data,
          explanation: data.explanation ?? null,
        } as any);
        toast.success("Question added");
      } else {
        await adminApi.updateQuestion(question!.id, data as any);
        toast.success("Question updated");
      }
      onSaved();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "New question" : "Edit question"}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <button
          type="button"
          onClick={onClose}
          className="text-2xs text-ink-500 hover:text-ink-900 inline-flex items-center gap-1"
        >
          <ChevronLeft className="h-3 w-3" /> Back to questions
        </button>

        <div>
          <Label>Question</Label>
          <Textarea rows={2} error={errors.question_text?.message} {...register("question_text")} />
        </div>

        <div>
          <Label>Options</Label>
          <div className="space-y-2">
            {options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase text-ink-400 w-5">{opt.key}</span>
                <Input
                  value={opt.text}
                  onChange={(e) => updateOption(idx, e.target.value)}
                  placeholder={`Option ${opt.key.toUpperCase()}`}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label>Correct answer</Label>
          <Select {...register("correct_option_key")}>
            {options.map((o) => (
              <option key={o.key} value={o.key}>
                {o.key.toUpperCase()} — {o.text || "(empty)"}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Explanation (shown after answering)</Label>
          <Textarea rows={2} {...register("explanation")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Points</Label>
            <Input type="number" {...register("points")} />
          </div>
          <div>
            <Label>Order</Label>
            <Input type="number" {...register("order_index")} />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-ink-100">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? "Add question" : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
