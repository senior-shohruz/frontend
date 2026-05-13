"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, Send, X } from "lucide-react";
import { aiApi } from "@/lib/endpoints";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/feedback";
import { getErrorMessage } from "@/lib/api";
import type { CodeDraft } from "@/types";

interface AITeacherProps {
  lessonId?: number;
  getCodeContext?: () => CodeDraft | undefined;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function AITeacher({ lessonId, getCodeContext }: AITeacherProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your AI teacher. Ask me to explain a concept, fix an error, or review your code.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await aiApi.ask({
        question: text,
        lesson_id: lessonId,
        code_context: getCodeContext?.(),
      });
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: res.answer },
      ]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Sorry, I couldn't reach the AI service. ${getErrorMessage(e)}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-ink-900 hover:bg-ink-800 text-white px-4 h-11 rounded-full shadow-popover transition-colors group"
        >
          <Sparkles className="h-4 w-4 text-accent-300 group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-medium">Ask AI</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[400px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-6rem)] bg-white border border-ink-200 rounded-xl shadow-popover flex flex-col animate-scale-in overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 h-12 border-b border-ink-100 bg-ink-50/50">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-ink-900 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-accent-300" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold text-ink-900">AI Teacher</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-ink-400 hover:text-ink-700 p-1 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                    m.role === "user"
                      ? "bg-ink-900 text-white"
                      : "bg-ink-50 text-ink-800 border border-ink-200/60"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose-lesson prose-sm">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-ink-50 border border-ink-200/60 px-3 py-2 rounded-lg flex items-center gap-2">
                  <Spinner className="h-3 w-3 text-ink-400" />
                  <span className="text-2xs font-mono text-ink-500">thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-ink-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                disabled={loading}
                className="flex-1 h-9 px-3 text-sm bg-white border border-ink-200 rounded-md focus:outline-none focus:border-accent-400 focus:ring-2 focus:ring-accent-400/20"
              />
              <Button onClick={send} loading={loading} disabled={!input.trim()} size="md">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
