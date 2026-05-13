"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Trophy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { quizApi, coursesApi } from "@/lib/endpoints";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/feedback";
import { toast } from "sonner";
import type { QuizResult } from "@/types";

interface QuizProps {
  lessonId: number;
  onComplete?: (result: QuizResult) => void;
}

export function Quiz({ lessonId, onComplete }: QuizProps) {
  const { data: questions, isLoading } = useQuery({
    queryKey: ["quiz", lessonId],
    queryFn: () => coursesApi.getQuiz(lessonId),
  });

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);

  if (isLoading) {
    return <Skeleton className="h-64" />;
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white border border-ink-200/70 rounded-lg p-8 text-center">
        <p className="text-sm text-ink-500">
          No quiz available for this lesson yet.
        </p>
      </div>
    );
  }

  const allAnswered = questions.every((q) => answers[q.id]);

  const submit = async () => {
    setSubmitting(true);
    try {
      const res = await quizApi.submit(lessonId, {
        answers: Object.entries(answers).map(([qid, key]) => ({
          question_id: Number(qid),
          selected_key: key,
        })),
      });
      setResult(res);
      onComplete?.(res);
      if (res.passed) {
        toast.success(`Passed! +${res.xp_earned} XP`);
      }
    } catch {
      toast.error("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const retry = () => {
    setAnswers({});
    setResult(null);
  };

  // ─── Results view ───────────────────────────
  if (result) {
    const correctById = new Map(result.answers.map((a) => [a.question_id, a]));

    return (
      <div className="space-y-6">
        {/* Summary */}
        <div
          className={cn(
            "rounded-xl p-6 lg:p-8 relative overflow-hidden",
            result.passed
              ? "bg-ink-900 text-white"
              : "bg-white border border-ink-200"
          )}
        >
          {result.passed && <div className="absolute inset-0 grid-bg opacity-[0.06]" />}
          <div className="relative flex items-start gap-4">
            <div
              className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center flex-shrink-0",
                result.passed
                  ? "bg-accent-500 text-white"
                  : "bg-ink-100 text-ink-500"
              )}
            >
              <Trophy className="h-5 w-5" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-3xl tracking-tight mb-1">
                {result.passed ? "Nicely done!" : "Keep going."}
              </h3>
              <p
                className={cn(
                  "text-sm",
                  result.passed ? "text-ink-300" : "text-ink-500"
                )}
              >
                You got{" "}
                <span className={result.passed ? "text-white font-semibold" : "text-ink-900 font-semibold"}>
                  {result.correct_count}/{result.total_questions}
                </span>{" "}
                ({Math.round(result.percentage)}%).
                {result.xp_earned > 0 && (
                  <>
                    {" "}
                    Earned{" "}
                    <span className="text-accent-400 font-semibold">+{result.xp_earned} XP</span>.
                  </>
                )}
              </p>
            </div>
            <Button
              variant={result.passed ? "outline" : "primary"}
              onClick={retry}
              size="sm"
              className={result.passed ? "border-ink-700 text-white hover:bg-ink-800" : ""}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        </div>

        {/* Per-question review */}
        <div className="space-y-3">
          {questions.map((q, idx) => {
            const r = correctById.get(q.id);
            if (!r) return null;
            return (
              <div
                key={q.id}
                className="bg-white border border-ink-200/70 rounded-lg p-5"
              >
                <div className="flex items-start gap-3 mb-3">
                  {r.is_correct ? (
                    <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="h-5 w-5 text-danger flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-2xs font-mono text-ink-400 mb-1">
                      Question {idx + 1}
                    </p>
                    <p className="text-sm text-ink-900">{q.question_text}</p>
                  </div>
                </div>

                <div className="space-y-1.5 ml-8">
                  {q.options.map((opt) => {
                    const isCorrect = opt.key === r.correct_key;
                    const isSelected = opt.key === r.selected_key;
                    return (
                      <div
                        key={opt.key}
                        className={cn(
                          "px-3 py-2 rounded text-sm border",
                          isCorrect
                            ? "bg-green-50 border-green-200 text-green-900"
                            : isSelected
                            ? "bg-red-50 border-red-200 text-red-900"
                            : "bg-ink-50/50 border-ink-100 text-ink-600"
                        )}
                      >
                        <span className="font-mono text-2xs mr-2 opacity-60">
                          {opt.key.toUpperCase()}
                        </span>
                        {opt.text}
                        {isCorrect && (
                          <span className="ml-2 text-2xs font-semibold">✓ correct</span>
                        )}
                        {isSelected && !isCorrect && (
                          <span className="ml-2 text-2xs font-semibold">your answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {r.explanation && (
                  <div className="ml-8 mt-3 px-3 py-2 bg-accent-50 border border-accent-200/50 rounded text-xs text-ink-700 leading-relaxed">
                    <span className="font-semibold text-accent-700">Why: </span>
                    {r.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── Quiz form ───────────────────────────
  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div
          key={q.id}
          className="bg-white border border-ink-200/70 rounded-lg p-5 lg:p-6"
        >
          <p className="text-2xs font-mono text-ink-400 mb-2">
            Question {idx + 1} of {questions.length}
          </p>
          <p className="text-base text-ink-900 mb-4 leading-snug">
            {q.question_text}
          </p>
          <div className="space-y-2">
            {q.options.map((opt) => {
              const selected = answers[q.id] === opt.key;
              return (
                <label
                  key={opt.key}
                  className={cn(
                    "flex items-start gap-3 px-3 py-2.5 border rounded-md cursor-pointer transition-all",
                    selected
                      ? "bg-ink-900 text-white border-ink-900"
                      : "bg-white border-ink-200 hover:border-ink-400 hover:bg-ink-50"
                  )}
                >
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    value={opt.key}
                    checked={selected}
                    onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt.key }))}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "h-4 w-4 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                      selected
                        ? "border-accent-400"
                        : "border-ink-300"
                    )}
                  >
                    {selected && <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />}
                  </span>
                  <span className="text-sm leading-snug">{opt.text}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-ink-500">
          {Object.keys(answers).length} of {questions.length} answered
        </p>
        <Button
          onClick={submit}
          disabled={!allAnswered}
          loading={submitting}
          size="lg"
        >
          Submit answers
        </Button>
      </div>
    </div>
  );
}
