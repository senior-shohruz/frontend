"use client";

import { api } from "./api";
import type {
  Course,
  CourseWithLessons,
  Lesson,
  QuizQuestionForUser,
  QuizQuestionAdmin,
  QuizSubmission,
  QuizResult,
  LessonProgress,
  CodeDraft,
  ProgressStatus,
  UserAnalytics,
  CourseProgressSummary,
  UserBadge,
  AdminDashboardStats,
  UserAdminView,
  UserRole,
  AIAskRequest,
  AIAskResponse,
} from "@/types";

// ─────────── Courses (user-facing) ───────────

export const coursesApi = {
  list: async () => (await api.get<Course[]>("/courses")).data,
  getBySlug: async (slug: string) =>
    (await api.get<CourseWithLessons>(`/courses/${slug}`)).data,
  getLesson: async (id: number) =>
    (await api.get<Lesson>(`/courses/lessons/${id}`)).data,
  getQuiz: async (lessonId: number) =>
    (await api.get<QuizQuestionForUser[]>(`/courses/lessons/${lessonId}/quiz`)).data,
};

// ─────────── Quiz ───────────

export const quizApi = {
  submit: async (lessonId: number, submission: QuizSubmission) =>
    (await api.post<QuizResult>(`/quiz/lessons/${lessonId}/submit`, submission)).data,
};

// ─────────── Progress ───────────

export const progressApi = {
  update: async (
    lessonId: number,
    body: { status?: ProgressStatus; completion_percentage?: number; code_draft?: CodeDraft }
  ) => (await api.put<LessonProgress>(`/progress/lessons/${lessonId}`, body)).data,
  get: async (lessonId: number) =>
    (await api.get<LessonProgress | null>(`/progress/lessons/${lessonId}`)).data,
  myAnalytics: async () => (await api.get<UserAnalytics>("/progress/me/analytics")).data,
  myCourses: async () =>
    (await api.get<CourseProgressSummary[]>("/progress/me/courses")).data,
  myBadges: async () => (await api.get<UserBadge[]>("/progress/me/badges")).data,
};

// ─────────── AI Teacher ───────────

export const aiApi = {
  ask: async (body: AIAskRequest) =>
    (await api.post<AIAskResponse>("/ai/ask", body)).data,
};

// ─────────── Admin ───────────

export const adminApi = {
  dashboard: async () => (await api.get<AdminDashboardStats>("/admin/dashboard")).data,

  // Courses
  listCourses: async (params?: { search?: string; is_published?: boolean }) =>
    (await api.get<Course[]>("/admin/courses", { params })).data,
  createCourse: async (body: Partial<Course> & { slug: string; title: string; description: string }) =>
    (await api.post<Course>("/admin/courses", body)).data,
  updateCourse: async (id: number, body: Partial<Course>) =>
    (await api.patch<Course>(`/admin/courses/${id}`, body)).data,
  deleteCourse: async (id: number) => api.delete(`/admin/courses/${id}`),

  // Lessons
  listLessons: async (params?: { course_id?: number; search?: string }) =>
    (await api.get<Lesson[]>("/admin/lessons", { params })).data,
  createLesson: async (body: Partial<Lesson> & {
    course_id: number; slug: string; title: string;
  }) => (await api.post<Lesson>("/admin/lessons", body)).data,
  updateLesson: async (id: number, body: Partial<Lesson>) =>
    (await api.patch<Lesson>(`/admin/lessons/${id}`, body)).data,
  deleteLesson: async (id: number) => api.delete(`/admin/lessons/${id}`),

  // Quiz
  listQuestions: async (lessonId: number) =>
    (await api.get<QuizQuestionAdmin[]>(`/admin/lessons/${lessonId}/questions`)).data,
  createQuestion: async (body: Omit<QuizQuestionAdmin, "id" | "created_at">) =>
    (await api.post<QuizQuestionAdmin>("/admin/questions", body)).data,
  updateQuestion: async (id: number, body: Partial<QuizQuestionAdmin>) =>
    (await api.patch<QuizQuestionAdmin>(`/admin/questions/${id}`, body)).data,
  deleteQuestion: async (id: number) => api.delete(`/admin/questions/${id}`),

  // Users
  listUsers: async (params?: { search?: string; role?: UserRole; is_active?: boolean }) =>
    (await api.get<UserAdminView[]>("/admin/users", { params })).data,
  getUser: async (id: number) =>
    (await api.get<UserAdminView>(`/admin/users/${id}`)).data,
  updateUser: async (id: number, body: { role?: UserRole; is_active?: boolean; full_name?: string }) =>
    (await api.patch<UserAdminView>(`/admin/users/${id}`, body)).data,
  deleteUser: async (id: number) => api.delete(`/admin/users/${id}`),
};
