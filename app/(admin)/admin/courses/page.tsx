"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Edit2, Trash2, Eye, EyeOff, BookOpen } from "lucide-react";
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
import { formatDate, slugify } from "@/lib/utils";
import { getErrorMessage } from "@/lib/api";
import type { Course, CourseLevel } from "@/types";

const schema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "lowercase, numbers, dashes only"),
  description: z.string().min(1),
  short_description: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  icon_key: z.string().optional(),
  estimated_minutes: z.coerce.number().int().min(0),
  order_index: z.coerce.number().int().min(0),
  is_published: z.boolean(),
});
type FormData = z.infer<typeof schema>;

export default function AdminCoursesPage() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Course | null | undefined>(undefined);

  const { data: courses, isLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => adminApi.listCourses(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteCourse(id),
    onSuccess: () => {
      toast.success("Course deleted");
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
      <header className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-500 mb-2">
            Admin · Courses
          </p>
          <h1 className="font-display text-4xl text-ink-900 leading-tight">
            Course catalog
          </h1>
        </div>
        <Button onClick={() => setEditing(null)}>
          <Plus className="h-3.5 w-3.5" />
          New course
        </Button>
      </header>

      <Card>
        {isLoading ? (
          <CardBody>
            <Skeleton className="h-32" />
          </CardBody>
        ) : !courses || courses.length === 0 ? (
          <CardBody>
            <EmptyState
              icon={<BookOpen className="h-5 w-5" />}
              title="No courses yet"
              description="Create your first course to get started."
              action={<Button onClick={() => setEditing(null)}><Plus className="h-3.5 w-3.5" /> New course</Button>}
            />
          </CardBody>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium">Title</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden sm:table-cell">Level</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden md:table-cell">Lessons</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden md:table-cell">Status</th>
                  <th className="text-left px-5 py-3 text-2xs font-mono uppercase tracking-wider text-ink-500 font-medium hidden lg:table-cell">Updated</th>
                  <th className="px-5 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/40 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md bg-ink-100 flex items-center justify-center font-display text-lg text-ink-700 flex-shrink-0">
                          {(c.icon_key || c.title)[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink-900 truncate">{c.title}</p>
                          <p className="text-2xs font-mono text-ink-500">/{c.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <Badge variant="outline" className="capitalize">{c.level}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-ink-700 hidden md:table-cell">{c.lessons_count}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {c.is_published ? (
                        <Badge variant="success"><Eye className="h-2.5 w-2.5" /> Live</Badge>
                      ) : (
                        <Badge><EyeOff className="h-2.5 w-2.5" /> Draft</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-2xs font-mono text-ink-500 hidden lg:table-cell">
                      {formatDate(c.updated_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => setEditing(c)}
                          className="p-1.5 rounded text-ink-500 hover:text-ink-900 hover:bg-ink-100"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${c.title}"? This will also delete all lessons.`)) {
                              deleteMutation.mutate(c.id);
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

      {editing !== undefined && (
        <CourseFormModal
          course={editing}
          onClose={() => setEditing(undefined)}
          onSaved={() => {
            qc.invalidateQueries({ queryKey: ["admin-courses"] });
            setEditing(undefined);
          }}
        />
      )}
    </div>
  );
}

function CourseFormModal({
  course, onClose, onSaved,
}: {
  course: Course | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isNew = course === null;

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: course ? {
      title: course.title,
      slug: course.slug,
      description: course.description,
      short_description: course.short_description || "",
      level: course.level,
      icon_key: course.icon_key || "",
      estimated_minutes: course.estimated_minutes,
      order_index: course.order_index,
      is_published: course.is_published,
    } : {
      title: "", slug: "", description: "", short_description: "",
      level: "beginner" as CourseLevel, icon_key: "",
      estimated_minutes: 60, order_index: 0, is_published: false,
    },
  });

  // Auto-generate slug when typing title (only for new courses)
  const titleValue = watch("title");
  const slugValue = watch("slug");
  useEffect(() => {
    if (isNew && titleValue && !slugValue) {
      setValue("slug", slugify(titleValue));
    }
  }, [titleValue, slugValue, isNew, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      if (isNew) {
        await adminApi.createCourse(data);
        toast.success("Course created");
      } else {
        await adminApi.updateCourse(course!.id, data);
        toast.success("Course updated");
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
      title={isNew ? "New course" : "Edit course"}
      description={isNew ? "Add a new course to the catalog." : "Update course details."}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <Label>Description</Label>
          <Textarea rows={3} error={errors.description?.message} {...register("description")} />
        </div>

        <div>
          <Label>Short description (optional)</Label>
          <Input error={errors.short_description?.message} {...register("short_description")} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>Level</Label>
            <Select error={errors.level?.message} {...register("level")}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Select>
          </div>
          <div>
            <Label>Icon letter</Label>
            <Input maxLength={2} placeholder="H" {...register("icon_key")} />
          </div>
          <div>
            <Label>Order index</Label>
            <Input type="number" {...register("order_index")} />
          </div>
        </div>

        <div>
          <Label>Estimated minutes</Label>
          <Input type="number" {...register("estimated_minutes")} />
        </div>

        <label className="flex items-center gap-2 pt-2 cursor-pointer">
          <input type="checkbox" {...register("is_published")} className="rounded" />
          <span className="text-sm text-ink-700">Published (visible to users)</span>
        </label>

        <div className="flex justify-end gap-2 pt-4 border-t border-ink-100">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={isSubmitting}>
            {isNew ? "Create course" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
