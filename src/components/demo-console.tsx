'use client';

import { useMemo, useState } from "react";
import { evaluatePrompt } from "@/lib/promptEvaluator";

const demoPrompt =
  "Summarize the 2024 EU heat pump market for homeowners. Keep to 4 bullets + 1 risk. Include adoption drivers and cite unknowns as 'unknown'.";

const sampleModelOutput = [
  "EU heat pump demand rose in 2024, driven by energy security policies and high gas prices.",
  "Upfront cost remains the main adoption barrier; subsidies differ by country.",
  "Consumers want install clarity: home suitability, noise, and payback period.",
  "Grid impact is localized; utilities need load management in dense areas.",
  "Risk: installers are scarce; timelines stretch in winter.",
];

export function DemoConsole() {
  const [prompt, setPrompt] = useState(demoPrompt);
  const [showResult, setShowResult] = useState(false);

  const evaluation = useMemo(() => {
    if (!showResult) return null;
    return evaluatePrompt(prompt, { previousIterations: 1 });
  }, [prompt, showResult]);

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            No-login demo
          </p>
          <h3 className="text-lg font-semibold text-ink">
            Try the playground flow in seconds
          </h3>
          <p className="text-sm text-muted">
            We teach prompts, not outputs—so you&apos;ll see the prompt evaluation first.
          </p>
        </div>
        <button
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-strong"
          onClick={() => setShowResult(true)}
        >
          Run demo
        </button>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border/80 bg-card-alt/60 p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
            <span>Prompt</span>
            <span className="rounded-full bg-card px-2 py-1 text-[11px] text-ink shadow-sm">
              Model visible
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            className="w-full rounded-xl border border-border bg-white p-3 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/50"
          />
        </div>
        <div className="rounded-2xl border border-border/80 bg-card-alt/60 p-4">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
            <span>Sample Output</span>
            <span className="rounded-full bg-card px-2 py-1 text-[11px] text-ink shadow-sm">
              Clipped for demo
            </span>
          </div>
          <ul className="space-y-2 text-sm text-ink">
            {sampleModelOutput.map((line) => (
              <li
                key={line}
                className="rounded-lg border border-transparent bg-white px-3 py-2 shadow-sm"
              >
                {line}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {evaluation && (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              What the prompt did
            </p>
            <ul className="mt-2 space-y-2 text-sm text-ink">
              {evaluation.whatHappened.map((item) => (
                <li key={item} className="rounded-lg bg-card-alt/70 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Why the output would happen
            </p>
            <ul className="mt-2 space-y-2 text-sm text-ink">
              {evaluation.why.map((item) => (
                <li key={item} className="rounded-lg bg-card-alt/70 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Improve next
            </p>
            <ul className="mt-2 space-y-2 text-sm text-ink">
              {evaluation.improvements.map((item) => (
                <li key={item} className="rounded-lg bg-card-alt/70 px-3 py-2">
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3 rounded-lg bg-card-alt px-3 py-2 text-xs text-muted">
              Example rewrite: {evaluation.rewrite}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
