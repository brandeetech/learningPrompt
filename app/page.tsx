import Link from "next/link";
import { DemoConsole } from "@/components/demo-console";

const pillars = [
  {
    title: "Guided playground",
    bullets: [
      "Model choice stays visible; prompt is never hidden.",
      "Immediate feedback: what happened → why → how to improve.",
      "Optional rewrite comes last, not first.",
    ],
  },
  {
    title: "Educational evaluation",
    bullets: [
      "Rubric: intent, context, constraints, format, scope, reasoning, assumptions.",
      "No grades—only explanations and targeted suggestions.",
      "Tracks iterations to adapt guidance and suggest next steps.",
    ],
  },
  {
    title: "Learning-ready content",
    bullets: [
      "Templates with intent + example + why it works.",
      "Learning section with fundamentals, mistakes, patterns.",
      "Before/after comparisons to build intuition.",
    ],
  },
];

const highlights = [
  "Version history per prompt; restore and reflect.",
  "Token visibility and exhaustion nudges to drive upgrades.",
  "Supabase-ready: auth, Postgres, RLS (configure via env).",
];

export default function Home() {
  return (
    <div className="space-y-12 pb-16">
      <section className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            AskRight · Prompt Learning
          </p>
          <h1 className="text-4xl font-semibold leading-[1.1] text-ink">
            Learn how to ask AI the right way—by practicing with feedback, not vibes.
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            AskRight is a calm, educational playground. We teach clarity and structure:
            the prompt is always visible, the model is explicit, and feedback is
            explain-first so users understand *why* outputs change.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/play"
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-strong"
            >
              Launch playground
            </Link>
            <Link
              href="/templates"
              className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink hover:bg-card-alt"
            >
              View templates
            </Link>
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs text-muted shadow-sm">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Educational-first · No prompt scoring
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="card p-4">
                <p className="text-sm font-semibold text-ink">{pillar.title}</p>
                <ul className="mt-2 space-y-2 text-sm text-muted">
                  {pillar.bullets.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="card border border-border/80 bg-card p-6 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Brand + UX guardrails
          </p>
          <div className="mt-3 space-y-3 text-sm text-ink">
            <p className="rounded-xl bg-card-alt px-3 py-2 text-muted">
              Calm, minimal, structured. One primary action per screen. Feedback order
              is fixed: what happened → why → how to improve → optional rewrite.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                <p className="text-xs font-semibold uppercase text-muted">Colors</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <ColorSwatch label="Primary" color="#1E3A8A" />
                  <ColorSwatch label="Secondary" color="#22C55E" />
                  <ColorSwatch label="Accent" color="#F59E0B" />
                  <ColorSwatch label="Ink" color="#0F172A" />
                </div>
              </div>
              <div className="rounded-xl border border-border bg-white p-3 shadow-sm">
                <p className="text-xs font-semibold uppercase text-muted">Typography</p>
                <ul className="mt-2 space-y-1 text-sm text-ink">
                  <li>Inter — UI</li>
                  <li>JetBrains Mono — prompts/code</li>
                  <li className="text-muted">Starting point; adjust if research demands.</li>
                </ul>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-ink">
              {highlights.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
              Guided flow
            </p>
            <h2 className="text-2xl font-semibold text-ink">
              See the no-login demo prompt and the evaluation flow
            </h2>
          </div>
          <Link
            href="/play"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-brand hover:text-white"
          >
            Go to playground
          </Link>
        </div>
        <DemoConsole />
      </section>
    </div>
  );
}

function ColorSwatch({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border px-2 py-1 text-xs text-ink">
      <span
        className="h-5 w-5 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <span className="font-semibold">{label}</span>
      <span className="text-muted">{color}</span>
    </div>
  );
}
