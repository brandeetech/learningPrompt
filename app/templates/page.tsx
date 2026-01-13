'use client';

import { useMemo, useState } from "react";
import { promptTemplates } from "@/lib/templates";
import Link from "next/link";

const categories = ["all", "summary", "analysis", "compare", "extract", "critique", "writing"] as const;
type Category = (typeof categories)[number];

export default function TemplatesPage() {
  const [category, setCategory] = useState<Category>("all");
  const [copied, setCopied] = useState<string | null>(null);

  const visible = useMemo(() => {
    if (category === "all") return promptTemplates;
    return promptTemplates.filter((tpl) => tpl.category === category);
  }, [category]);

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Templates
        </p>
        <h1 className="text-3xl font-semibold text-ink">
          Patterned prompts with intent and rationale
        </h1>
        <p className="max-w-2xl text-sm text-muted">
          Each template includes intent, the prompt itself, and why it works—so users learn the structure, not just copy it. Load a template, edit context, and run it in the playground with feedback.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full border px-3 py-2 text-xs font-semibold transition ${
                category === cat
                  ? "border-brand bg-brand text-white shadow-sm"
                  : "border-border text-ink hover:border-brand"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((tpl) => (
          <div key={tpl.id} className="card p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-1">
                  {tpl.category}
                </p>
                <h3 className="text-lg font-semibold text-ink">{tpl.title}</h3>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs font-semibold text-ink">Intent</p>
              <p className="text-sm text-muted leading-relaxed">{tpl.intent}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-ink">Prompt Template</p>
              <pre className="max-h-40 overflow-auto rounded-lg border border-border bg-card-alt p-3 text-xs text-ink font-mono leading-relaxed">
                {tpl.prompt}
              </pre>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-ink">Why it works</p>
              <p className="text-xs text-muted leading-relaxed">{tpl.whyItWorks}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
              <Link
                href={`/play?template=${tpl.id}`}
                className="flex-1 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white text-center shadow-sm transition hover:bg-brand-strong"
              >
                Use in Playground
              </Link>
              <button
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(tpl.prompt);
                    setCopied(tpl.id);
                    setTimeout(() => setCopied(null), 1600);
                  }
                }}
                className="rounded-full border border-border px-3 py-2 text-xs font-semibold text-ink transition hover:border-brand hover:bg-card-alt"
              >
                {copied === tpl.id ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
