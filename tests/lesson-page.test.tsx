import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useQuery } from "@tanstack/react-query";
import LessonPage from "@/app/(app)/lessons/[id]/page";

// ─── Mocklar ────────────────────────────────────────────

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  use: jest.fn(() => ({ id: "7" })),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(),
}));

jest.mock("@/lib/endpoints", () => ({
  coursesApi: { getLesson: jest.fn() },
  progressApi: { get: jest.fn(), update: jest.fn().mockResolvedValue({}) },
}));

jest.mock("@/components/ui/feedback", () => ({
  Skeleton: ({ className }: { className?: string }) => (
    <div className={className} data-testid="skeleton" />
  ),
}));

jest.mock("@/components/features/code-editor", () => ({
  CodeEditor: () => <div data-testid="code-editor">Code Editor</div>,
}));

jest.mock("@/components/features/quiz", () => ({
  Quiz: () => <div data-testid="quiz">Quiz</div>,
}));

jest.mock("@/components/features/ai-teacher", () => ({
  AITeacher: () => <div data-testid="ai-teacher" />,
}));

// ─── Test ma'lumotlari ───────────────────────────────────

const mockLesson = {
  id: 7,
  title: "HTML Semantic Elements",
  description: "Learn how to use semantic HTML",
  content: "## Introduction\nSemantic elements clearly describe their meaning.",
  video_url: null,
  xp_reward: 50,
  starter_code_html: "",
  starter_code_css: "",
  starter_code_js: "",
  questions_count: 0,
};

const mockUseQuery = useQuery as jest.Mock;

// ─── Testlar ────────────────────────────────────────────

describe("LessonPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Loading holati
  it("Loading paytida skeleton ko'rinishi kerak", () => {
    mockUseQuery.mockReturnValue({ data: undefined, isLoading: true });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThan(0);
  });

  // 2. Lesson topilmasa
  it("Lesson topilmasa xabar ko'rinishi kerak", () => {
    mockUseQuery.mockReturnValue({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    expect(screen.getByText("Lesson not found.")).toBeInTheDocument();
  });

  // 3. Lesson nomi
  it("Lesson title ko'rinishi kerak", () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockLesson, isLoading: false })
      .mockReturnValueOnce({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    expect(screen.getByText("HTML Semantic Elements")).toBeInTheDocument();
  });

  // 4. XP ko'rinishi
  it("XP miqdori ko'rinishi kerak", () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockLesson, isLoading: false })
      .mockReturnValueOnce({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    expect(screen.getByText(/\+50 XP/)).toBeInTheDocument();
  });

  // 5. Back to courses havolasi
  it('"Back to courses" link mavjud bo\'lishi kerak', () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockLesson, isLoading: false })
      .mockReturnValueOnce({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    expect(screen.getByText("Back to courses")).toBeInTheDocument();
  });

  // 6. Lesson tab har doim ko'rinadi
  it('"Lesson" tab har doim ko\'rinishi kerak', () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockLesson, isLoading: false })
      .mockReturnValueOnce({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    expect(screen.getByText("Lesson")).toBeInTheDocument();
  });

  // 7. Practice tab — starter_code yo'q bo'lsa ko'rinmaydi
  it("starter_code yo'q bo'lsa Practice tab ko'rinmasligi kerak", () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockLesson, isLoading: false })
      .mockReturnValueOnce({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    expect(screen.queryByText("Practice")).not.toBeInTheDocument();
  });

  // 8. Practice tab — starter_code bo'lsa ko'rinadi
  it("starter_code bo'lsa Practice tab ko'rinishi kerak", () => {
    const lessonWithCode = { ...mockLesson, starter_code_html: "<h1>Hello</h1>" };
    mockUseQuery
      .mockReturnValueOnce({ data: lessonWithCode, isLoading: false })
      .mockReturnValueOnce({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    expect(screen.getByText("Practice")).toBeInTheDocument();
  });

  // 9. Quiz tab — questions_count 0 bo'lsa ko'rinmaydi
  it("questions_count 0 bo'lsa Quiz tab ko'rinmasligi kerak", () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockLesson, isLoading: false })
      .mockReturnValueOnce({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    expect(screen.queryByText("Quiz")).not.toBeInTheDocument();
  });

  // 10. Quiz tab — questions_count > 0 bo'lsa ko'rinadi
  it("questions_count > 0 bo'lsa Quiz tab ko'rinishi kerak", () => {
    const lessonWithQuiz = { ...mockLesson, questions_count: 5 };
    mockUseQuery
      .mockReturnValueOnce({ data: lessonWithQuiz, isLoading: false })
      .mockReturnValueOnce({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    expect(screen.getByText("Quiz")).toBeInTheDocument();
  });

  // 11. Practice tabiga bosish
  it("Practice tabiga bosganda Code Editor ko'rinishi kerak", () => {
    const lessonWithCode = { ...mockLesson, starter_code_html: "<h1>Hello</h1>" };
    mockUseQuery
      .mockReturnValueOnce({ data: lessonWithCode, isLoading: false })
      .mockReturnValueOnce({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    fireEvent.click(screen.getByText("Practice"));
    expect(screen.getByTestId("code-editor")).toBeInTheDocument();
  });

  // 12. Quiz tabiga bosish
  it("Quiz tabiga bosganda Quiz ko'rinishi kerak", () => {
    const lessonWithQuiz = { ...mockLesson, questions_count: 3 };
    mockUseQuery
      .mockReturnValueOnce({ data: lessonWithQuiz, isLoading: false })
      .mockReturnValueOnce({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    fireEvent.click(screen.getByText("Quiz"));
    expect(screen.getByTestId("quiz")).toBeInTheDocument();
  });

  // 13. AI Teacher widget mavjud
  it("AI Teacher widget ko'rinishi kerak", () => {
    mockUseQuery
      .mockReturnValueOnce({ data: mockLesson, isLoading: false })
      .mockReturnValueOnce({ data: null, isLoading: false });
    render(<LessonPage params={Promise.resolve({ id: "7" })} />);
    expect(screen.getByTestId("ai-teacher")).toBeInTheDocument();
  });
});
