'use client';

import { useMemo, useState } from "react";
import { Evaluation, estimateTokens } from "@/lib/promptEvaluator";
import { stageCopy } from "@/lib/learningPath";
import { promptTemplates } from "@/lib/templates";
import Link from "next/link";
import { flags } from "@/lib/env";
import { getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/evaluationColors";

type HistoryItem = {
  id: number;
  prompt: string;
  intent: string;
  model: string;
  tokensUsed: number;
  evaluation: Evaluation;
  output: string | null;
  timestamp: string;
};

const models = [
  { id: "gpt-4.1", label: "GPT" },
  { id: "claude-3.5", label: "Claude" },
  { id: "gemini-1.5", label: "Gemini" },
];

const startingPrompt =
  "Act as a prompt coach. I want to write a prompt that extracts the top 3 customer complaints from support tickets. Help me design it.";

const totalTokens = 8000;

export default function PlaygroundPage() {
  const [prompt, setPrompt] = useState(startingPrompt);
  const [intent, setIntent] = useState("");
  const [model, setModel] = useState(models[0].id);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [tokensLeft, setTokensLeft] = useState(totalTokens);
  const [loading, setLoading] = useState(false);

  const latest = history[0];

  const learningStage = latest?.evaluation.stage ?? "onboarding";
  const stage = stageCopy[learningStage];

  const tokenUsagePercent = useMemo(() => {
    const spent = totalTokens - tokensLeft;
    return Math.min(100, Math.max(0, Math.round((spent / totalTokens) * 100)));
  }, [tokensLeft]);

  const handleRun = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    const tokensUsed = estimateTokens(prompt);
    let evaluation: Evaluation | null = null;
    let output: string | null = null;

    try {
      // Get evaluation
      const evalRes = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          previousIterations: history.length,
          userIntent: intent.trim() || undefined,
        }),
      });
      const evalJson = await evalRes.json();
      evaluation = evalJson.evaluation;

      // Get actual LLM output (mock for now, replace with real API call)
      // TODO: Replace with actual LLM API call
      output = `Sample output for demonstration:\n\nBased on your prompt about extracting customer complaints, here's a structured response:\n\n1. Complaint categorization\n2. Frequency analysis\n3. Priority ranking\n\nNote: This is a demo output. Configure your LLM API keys to get real results.`;
    } catch (error) {
      console.error("Evaluation fallback", error);
    }

    if (!evaluation) {
      const { evaluatePrompt } = await import("@/lib/promptEvaluator");
      evaluation = evaluatePrompt(prompt, {
        previousIterations: history.length,
        userIntent: intent.trim() || undefined,
      });
    } else {
      // Ensure evaluation has score (for backward compatibility)
      if (!evaluation.score) {
        const { evaluatePrompt } = await import("@/lib/promptEvaluator");
        const fullEvaluation = evaluatePrompt(prompt, {
          previousIterations: history.length,
          userIntent: intent.trim() || undefined,
        });
        evaluation = { ...evaluation, score: fullEvaluation.score, intentMatch: fullEvaluation.intentMatch };
      }
    }

    const entry: HistoryItem = {
      id: history.length + 1,
      prompt,
      intent: intent.trim(),
      model,
      tokensUsed,
      evaluation,
      output,
      timestamp: new Date().toISOString(),
    };

    setHistory([entry, ...history].slice(0, 6));
    setTokensLeft(Math.max(0, tokensLeft - tokensUsed));
    setLoading(false);
  };

  const recommendedTemplates = useMemo(() => promptTemplates.slice(0, 3), []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Playground
        </p>
        <h1 className="text-3xl font-semibold text-ink">
          Practice prompts with explain-first feedback
        </h1>
        <p className="max-w-2xl text-sm text-muted">
          The prompt, model, and system instructions are always visible. Feedback is
          structured: what happened, why, how to improve, optional rewrite. No numeric
          scoring—only explanations and next steps.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full bg-card px-3 py-1 font-semibold text-ink shadow-sm">
            Stage: {stage.title}
          </span>
          <span className="rounded-full bg-card-alt px-3 py-1 text-muted">
            Model visible · Versioned runs · Token-aware
          </span>
        </div>
      </div>

      <div className="card grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  model === m.id
                    ? "border-brand bg-brand text-white shadow-sm"
                    : "border-border text-ink hover:border-brand"
                }`}
              >
                {m.label}
              </button>
            ))}
            <span className="rounded-full bg-card px-3 py-2 text-xs text-muted shadow-sm">
              Tokens left: {tokensLeft} / {totalTokens}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-card-alt">
            <div
              className="h-full bg-brand transition-all"
              style={{ width: `${tokenUsagePercent}%` }}
              aria-label="token usage"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink">Your Intent</label>
            <input
              type="text"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
              placeholder="What do you want to achieve with this prompt? (e.g., 'Extract top 3 customer complaints')"
            />
            <p className="text-xs text-muted">
              State your goal first. We&apos;ll compare it with your prompt to see how well they align.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={8}
              className="w-full rounded-xl border border-border bg-white p-4 font-mono text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
              placeholder="State the goal, audience, context, constraints, and desired format…"
            />
            <p className="text-xs text-muted">
              Show system instructions and model in UI; don&apos;t hide them. Keep one
              primary action per screen.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRun}
              disabled={loading || tokensLeft <= 0}
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
            >
              {loading ? "Running…" : "Run prompt"}
            </button>
            <span className="text-xs text-muted">
              Estimated tokens: {estimateTokens(prompt)} · Model: {model}
            </span>
            {flags.gatewayEnabled ? (
              <span className="text-xs rounded-full bg-card px-3 py-1 text-ink shadow-sm">
                Using Vercel AI Gateway
              </span>
            ) : (
              <span className="text-xs text-muted">
                Gateway not configured; using local heuristic evaluation.
              </span>
            )}
          </div>
          <div className="rounded-xl border border-border bg-card-alt p-4 text-sm text-ink">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Stage guidance
            </p>
            <p className="mt-1 font-semibold text-ink">{stage.tip}</p>
            <ul className="mt-2 grid gap-2 text-sm text-muted sm:grid-cols-2">
              {stage.actions.map((action) => (
                <li key={action} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          {latest?.output && (
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Prompt Output
              </p>
              <div className="mt-3 rounded-lg border border-border bg-card-alt p-4">
                <pre className="whitespace-pre-wrap text-sm text-ink font-mono">
                  {latest.output}
                </pre>
              </div>
            </div>
          )}
          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Evaluation (education first)
            </p>
            {latest ? (
              <EvaluationView item={latest} />
            ) : (
              <p className="mt-2 text-sm text-muted">
                Run the prompt to see the explain-first evaluation with scores and colors.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Version history
              </p>
              <span className="text-[11px] text-muted">
                {history.length} versions (local)
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              {history.map((item) => (
                <li
                  key={item.id}
                  className="rounded-xl border border-border bg-card-alt/70 p-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-ink">
                      V{item.id} · {item.model}
                    </span>
                    <span className="text-xs text-muted">
                      Tokens {item.tokensUsed} · Stage {item.evaluation.stage}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{item.prompt}</p>
                </li>
              ))}
              {history.length === 0 && (
                <li className="rounded-xl border border-dashed border-border bg-card-alt/50 p-3 text-sm text-muted">
                  No versions yet. Each run creates a version for reflection and restore.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {recommendedTemplates.map((tpl) => (
          <div key={tpl.id} className="card p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              {tpl.category}
            </p>
            <h3 className="mt-1 text-lg font-semibold text-ink">{tpl.title}</h3>
            <p className="mt-2 text-sm text-muted">{tpl.intent}</p>
            <pre className="mt-3 max-h-48 overflow-auto rounded-lg border border-border bg-card-alt p-3 text-xs text-ink">
              {tpl.prompt}
            </pre>
            <p className="mt-2 text-xs text-muted">Why it works: {tpl.whyItWorks}</p>
            <button
              onClick={() => {
                setPrompt(tpl.prompt);
              }}
              className="mt-3 w-full rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink transition hover:border-brand"
            >
              Load into prompt
            </button>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Learning section
            </p>
            <h3 className="text-lg font-semibold text-ink">
              Reinforce fundamentals, patterns, and common mistakes
            </h3>
          </div>
          <Link
            href="/learn"
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-brand hover:text-white"
          >
            Open learning hub
          </Link>
        </div>
        <ul className="mt-3 grid gap-2 text-sm text-muted md:grid-cols-3">
          <li className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
            Prompt fundamentals and rubric language reused in UI.
          </li>
          <li className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
            Common mistakes with before/after examples.
          </li>
          <li className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
            Templates mapped to stage progression to reduce overload.
          </li>
        </ul>
      </div>
    </div>
  );
}

function EvaluationView({ item }: { item: HistoryItem }) {
  const { evaluation, intent } = item;
  const score = evaluation.score || {
    intentClarity: 50,
    contextCompleteness: 50,
    constraints: 50,
    outputFormat: 50,
    scopeControl: 50,
    overall: 50,
  };

  return (
    <div className="mt-3 space-y-4 text-sm text-ink">
      {/* Score Overview */}
      <div className="rounded-lg border border-border bg-card-alt p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Overall Score
          </p>
          <div className={`rounded-full px-3 py-1 text-sm font-semibold ${getScoreBgColor(score.overall)} ${getScoreColor(score.overall)}`}>
            {score.overall}/100 · {getScoreLabel(score.overall)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ScoreItem label="Intent Clarity" score={score.intentClarity} />
          <ScoreItem label="Context" score={score.contextCompleteness} />
          <ScoreItem label="Constraints" score={score.constraints} />
          <ScoreItem label="Format" score={score.outputFormat} />
          <ScoreItem label="Scope" score={score.scopeControl} className="col-span-2" />
        </div>
        {intent && evaluation.intentMatch !== undefined && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted">Intent Match</span>
              <span className={`text-sm font-semibold ${getScoreColor(evaluation.intentMatch)}`}>
                {evaluation.intentMatch}%
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Your intent: &quot;{intent}&quot;
            </p>
          </div>
        )}
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          1) What the prompt did
        </p>
        <ul className="mt-1 space-y-2">
          {evaluation.whatHappened.map((entry) => (
            <li
              key={entry}
              className="rounded-lg bg-card-alt/60 px-3 py-2 text-ink"
            >
              {entry}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          2) Why that output would happen
        </p>
        <ul className="mt-1 space-y-2">
          {evaluation.why.map((entry) => (
            <li
              key={entry}
              className="rounded-lg bg-card-alt/60 px-3 py-2 text-ink"
            >
              {entry}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          3) How to improve next (1–3 bullets)
        </p>
        <ul className="mt-1 space-y-2">
          {evaluation.improvements.map((entry) => (
            <li
              key={entry}
              className="rounded-lg bg-card-alt/60 px-3 py-2 text-ink"
            >
              {entry}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
          4) Example rewrite (optional)
        </p>
        <p className="mt-1 rounded-lg border border-dashed border-border bg-card-alt/60 px-3 py-2 text-muted">
          {evaluation.rewrite}
        </p>
      </div>
    </div>
  );
}

function ScoreItem({ label, score, className = "" }: { label: string; score: number; className?: string }) {
  return (
    <div className={`flex items-center justify-between rounded-lg border ${getScoreBgColor(score)} px-2 py-1.5 ${className}`}>
      <span className="text-xs text-muted">{label}</span>
      <span className={`text-xs font-semibold ${getScoreColor(score)}`}>
        {score}
      </span>
    </div>
  );
}
