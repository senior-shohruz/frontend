// ─────────── Auth & User ───────────

export type UserRole = "user" | "admin";

export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_active: boolean;
  is_verified: boolean;
  xp: number;
  level: number;
  streak_days: number;
  created_at: string;
}

export interface UserAdminView extends User {
  last_active_at: string | null;
  updated_at: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// ─────────── Course / Lesson ───────────

export type CourseLevel = "beginner" | "intermediate" | "advanced";

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description: string | null;
  thumbnail_url: string | null;
  level: CourseLevel;
  icon_key: string | null;
  estimated_minutes: number;
  order_index: number;
  is_published: boolean;
  lessons_count: number;
  created_at: string;
  updated_at: string;
}

export interface LessonSummary {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  video_duration_seconds: number;
  xp_reward: number;
  order_index: number;
  is_published: boolean;
}

export interface CourseWithLessons extends Course {
  lessons: LessonSummary[];
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  video_url: string | null;
  video_duration_seconds: number;
  starter_code_html: string | null;
  starter_code_css: string | null;
  starter_code_js: string | null;
  xp_reward: number;
  order_index: number;
  is_published: boolean;
  questions_count: number;
  created_at: string;
  updated_at: string;
}

// ─────────── Quiz ───────────

export interface QuizOption {
  key: string;
  text: string;
}

export interface QuizQuestionForUser {
  id: number;
  question_text: string;
  options: QuizOption[];
  points: number;
  order_index: number;
}

export interface QuizQuestionAdmin extends QuizQuestionForUser {
  lesson_id: number;
  correct_option_key: string;
  explanation: string | null;
  created_at: string;
}

export interface QuizAnswer {
  question_id: number;
  selected_key: string;
}

export interface QuizSubmission {
  answers: QuizAnswer[];
}

export interface QuizAnswerResult {
  question_id: number;
  selected_key: string;
  correct_key: string;
  is_correct: boolean;
  explanation: string | null;
}

export interface QuizResult {
  attempt_id: number;
  lesson_id: number;
  score: number;
  total_questions: number;
  correct_count: number;
  percentage: number;
  xp_earned: number;
  passed: boolean;
  answers: QuizAnswerResult[];
  submitted_at: string;
}

// ─────────── Progress ───────────

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export interface CodeDraft {
  html?: string;
  css?: string;
  js?: string;
}

export interface LessonProgress {
  id: number;
  lesson_id: number;
  status: ProgressStatus;
  completion_percentage: number;
  code_draft: CodeDraft | null;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string;
}

export interface UserAnalytics {
  user_id: number;
  total_xp: number;
  level: number;
  xp_to_next_level: number;
  streak_days: number;
  lessons_completed: number;
  lessons_in_progress: number;
  courses_started: number;
  quizzes_taken: number;
  avg_quiz_score: number;
  badges_earned: number;
}

export interface CourseProgressSummary {
  course_id: number;
  course_title: string;
  course_slug: string;
  icon_key: string | null;
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

export interface Badge {
  id: number;
  key: string;
  name: string;
  description: string;
  icon_url: string | null;
}

export interface UserBadge {
  id: number;
  badge: Badge;
  earned_at: string;
}

// ─────────── Admin ───────────

export interface PopularCourse {
  course_id: number;
  title: string;
  enrolled_users: number;
  completion_rate: number;
}

export interface AdminDashboardStats {
  total_users: number;
  active_users_last_7d: number;
  new_users_last_30d: number;
  total_courses: number;
  published_courses: number;
  total_lessons: number;
  total_quiz_attempts: number;
  lessons_completed_total: number;
  popular_courses: PopularCourse[];
}

// ─────────── AI ───────────

export interface AIAskRequest {
  question: string;
  lesson_id?: number;
  code_context?: CodeDraft;
}

export interface AIAskResponse {
  answer: string;
  lesson_id: number | null;
}
