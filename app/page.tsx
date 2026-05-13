"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Code2, Zap, Trophy, Brain, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink-50 text-ink-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-ink-50/80 border-b border-ink-200/60">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-7 w-7 rounded-md bg-ink-900 text-accent-300 flex items-center justify-center transition-transform group-hover:rotate-[-6deg]">
              <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
            </div>
            <span className="font-display text-xl tracking-tight">
              Frontend<span className="italic text-accent-600">Studio</span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/login"
              className="text-sm text-ink-600 hover:text-ink-900 px-3 py-1.5 rounded-md hover:bg-ink-100 transition-colors"
            >
              Log in
            </Link>
            <Link href="/register">
              <Button size="sm">
                Get started
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />
        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-50 to-transparent pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-50 to-transparent pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-32 lg:pt-32 lg:pb-40">
          {/* Tagline pill */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-ink-200 shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-2xs font-medium tracking-wider uppercase text-ink-600">
                AI-powered · Interactive · Free
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center text-5xl lg:text-7xl font-display leading-[1.02] tracking-tight mb-6 animate-slide-up">
            Learn frontend,
            <br />
            <span className="italic text-accent-600">beautifully.</span>
          </h1>

          {/* Subheading */}
          <p
            className="max-w-2xl mx-auto text-center text-base lg:text-lg text-ink-600 leading-relaxed mb-10 animate-slide-up"
            style={{ animationDelay: "60ms", animationFillMode: "backwards" }}
          >
            Master HTML, CSS, JavaScript, and React through hands-on lessons,
            interactive code editors, and an AI teacher that explains concepts
            until they actually click.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-slide-up"
            style={{ animationDelay: "120ms", animationFillMode: "backwards" }}
          >
            <Link href="/register">
              <Button size="lg" className="min-w-[180px]">
                Start learning — free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="min-w-[140px]">
                I have an account
              </Button>
            </Link>
          </div>

          {/* Spline placeholder — drop your scene URL into <iframe> below */}
          <div
            className="relative max-w-4xl mx-auto mt-20 aspect-[16/9] rounded-2xl border border-ink-200/70 bg-white shadow-card overflow-hidden animate-scale-in"
            style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
          >
            {/* TODO(spline): Replace this block with:
                <iframe src="YOUR_SPLINE_URL" className="absolute inset-0 w-full h-full" /> */}
            <div className="absolute inset-0 grid-bg opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-tr from-accent-100/40 via-transparent to-ink-100/60" />
            <div className="absolute inset-0 flex items-center justify-center p-10">
              <div className="text-center">
                <div className="h-14 w-14 mx-auto mb-4 rounded-2xl bg-ink-900 text-accent-300 flex items-center justify-center">
                  <Sparkles className="h-7 w-7" strokeWidth={2} />
                </div>
                <p className="font-display text-2xl text-ink-900 mb-1">
                  Your Spline scene goes here
                </p>
                <p className="text-sm text-ink-500 max-w-xs mx-auto">
                  Replace the marked block in{" "}
                  <code className="text-2xs bg-ink-100 px-1.5 py-0.5 rounded font-mono">
                    app/page.tsx
                  </code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is frontend? — editorial section */}
      <section className="border-y border-ink-200/70 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="text-2xs uppercase tracking-[0.2em] text-ink-500 mb-3">
              01 — Foundation
            </p>
            <h2 className="font-display text-4xl lg:text-5xl text-ink-900 leading-[1.05] tracking-tight">
              What is{" "}
              <span className="italic text-accent-600">frontend</span>,
              really?
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-5 text-ink-700 leading-relaxed">
            <p className="text-lg">
              Frontend is everything you{" "}
              <em className="text-ink-900">touch</em> on the web — the buttons
              you click, the forms you fill, the layouts that adapt to your
              phone. It's the craft of turning ideas into interfaces people
              actually use.
            </p>
            <p>
              You'll learn the three languages browsers speak — HTML for
              structure, CSS for style, JavaScript for behaviour — and then
              compose them into modern apps with React. Each lesson is
              short, interactive, and immediately useful.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum cards */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-2xs uppercase tracking-[0.2em] text-ink-500 mb-3">
            02 — Curriculum
          </p>
          <h2 className="font-display text-4xl lg:text-5xl text-ink-900 leading-[1.05] tracking-tight">
            Four pillars.{" "}
            <span className="italic text-accent-600">One craft.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { letter: "H", name: "HTML", note: "Structure", n: 1 },
            { letter: "C", name: "CSS",  note: "Style",     n: 2 },
            { letter: "J", name: "JavaScript", note: "Behaviour", n: 3 },
            { letter: "R", name: "React", note: "Composition", n: 4 },
          ].map((c) => (
            <div
              key={c.name}
              className="group relative bg-white border border-ink-200/70 rounded-xl p-6 hover:border-ink-900 hover:-translate-y-0.5 transition-all duration-300 cursor-default"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="text-2xs font-mono text-ink-400">
                  0{c.n} / 04
                </div>
                <div className="font-display text-7xl leading-none text-ink-900 group-hover:text-accent-600 transition-colors">
                  {c.letter}
                </div>
              </div>
              <p className="text-2xs uppercase tracking-wider text-ink-500 mb-1">
                {c.note}
              </p>
              <p className="font-sans font-semibold text-ink-900">{c.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="bg-ink-900 text-ink-50 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.04]" />
        <div className="relative max-w-6xl mx-auto px-6 py-24">
          <div className="mb-14 max-w-2xl">
            <p className="text-2xs uppercase tracking-[0.2em] text-accent-400 mb-3">
              03 — Method
            </p>
            <h2 className="font-display text-4xl lg:text-5xl leading-[1.05] tracking-tight">
              Why this works
              <span className="italic text-accent-300"> when others don't</span>.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink-700/40 border border-ink-700/40 rounded-xl overflow-hidden">
            {[
              {
                icon: Code2,
                title: "Live code editor",
                body: "Write HTML, CSS, and JS — see results instantly. No setup, no terminal.",
              },
              {
                icon: Brain,
                title: "AI teacher, on demand",
                body: "Stuck? Ask. It reads your code and explains exactly what's wrong.",
              },
              {
                icon: Trophy,
                title: "XP, levels, badges",
                body: "Real progression. Every lesson moves you forward — visibly.",
              },
              {
                icon: BookOpen,
                title: "Bite-sized lessons",
                body: "Each lesson is one idea, ten minutes, one quiz. Easy to start, hard to stop.",
              },
              {
                icon: Zap,
                title: "Auto-graded quizzes",
                body: "10 questions per lesson. Instant feedback with explanations for every miss.",
              },
              {
                icon: Sparkles,
                title: "Designed with care",
                body: "We sweat the typography so you can focus on the syntax.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-ink-900 p-7 hover:bg-ink-800/50 transition-colors"
              >
                <f.icon className="h-5 w-5 text-accent-400 mb-4" strokeWidth={1.75} />
                <h3 className="font-sans font-semibold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-ink-300 leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-display text-5xl lg:text-6xl leading-[1.02] tracking-tight mb-5">
          Ready to{" "}
          <span className="italic text-accent-600">begin</span>?
        </h2>
        <p className="text-ink-600 max-w-md mx-auto mb-8">
          Free forever. No credit card. Start your first lesson in 30 seconds.
        </p>
        <Link href="/register">
          <Button size="lg">
            Create your account
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-200/70 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-500">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-ink-900 text-accent-300 flex items-center justify-center">
              <Sparkles className="h-3 w-3" strokeWidth={2.5} />
            </div>
            <span className="font-display text-base text-ink-900">
              Frontend<span className="italic text-accent-600">Studio</span>
            </span>
          </div>
          <p>© {new Date().getFullYear()} · Built with care.</p>
        </div>
      </footer>
    </main>
  );
}
