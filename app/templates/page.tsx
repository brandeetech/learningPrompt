'use client';

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import type { Template } from "@/lib/db/schema";
import type { PromptCategory } from "@/lib/db/schema";

const categories = ["all", "summary", "analysis", "compare", "extract", "critique", "writing"] as const;
type Category = (typeof categories)[number];

export default function TemplatesPage() {
  const [category, setCategory] = useState<Category>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== "all") {
          params.set("category", category);
        }
        if (searchQuery.trim()) {
          params.set("search", searchQuery.trim());
        }

        const response = await fetch(`/api/templates?${params.toString()}`);
        const data = await response.json();
        setTemplates(data.templates || []);
      } catch (error) {
        console.error("[Templates] Error fetching templates:", error);
        setTemplates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [category, searchQuery]);

  const visible = useMemo(() => templates, [templates]);

  return (
    <div className="space-y-8 pt-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Templates
        </p>
        <h1 className="text-3xl font-semibold text-ink">
          Patterned prompts with intent and rationale
        </h1>
        <p className="max-w-2xl text-sm text-muted">
          Each template includes intent, the prompt itself, and why it works—so users learn the structure, not just copy it. Load a template, edit context, and run it in the playground with feedback.
        </p>
        
        {/* Search */}
        <div className="max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by title, intent, or content..."
            className="w-full rounded-lg border border-border bg-white px-4 py-2 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
          />
        </div>

        {/* Categories */}
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

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand/20 border-t-brand mb-4" />
            <p className="text-sm text-muted">Loading templates...</p>
          </div>
        </div>
      ) : visible.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-muted">
            {searchQuery.trim() 
              ? `No templates found matching "${searchQuery}"`
              : "No templates found"}
          </p>
        </div>
      ) : (
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
                  {tpl.content}
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
                      navigator.clipboard.writeText(tpl.content);
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
      )}
    </div>
  );
}
