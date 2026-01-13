'use client';

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Evaluation, estimateTokens } from "@/lib/promptEvaluator";
import Link from "next/link";
import { getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/evaluationColors";
import { getCurrentUser } from "@/lib/auth";
import type { Template } from "@/lib/db/schema";

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

export default function PracticePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userMessage, setUserMessage] = useState(startingPrompt);
  const [intent, setIntent] = useState("");
  const [model, setModel] = useState(models[0].id);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const searchParams = useSearchParams();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const user = await getCurrentUser();
      if (!user) {
        console.log("[Practice] User not authenticated, redirecting to auth");
        router.push('/auth');
      } else {
        console.log("[Practice] User authenticated", { userId: user.id, email: user.email });
        setIsAuthenticated(true);
        setCurrentUser(user);
      }
    };
    checkAuth();
  }, [router]);

  // Load template from URL if present
  useEffect(() => {
    const templateId = searchParams.get('template');
    if (templateId && isAuthenticated) {
      const loadTemplate = async () => {
        try {
          const response = await fetch(`/api/templates?id=${templateId}`);
          const data = await response.json();
          if (data.template) {
            setUserMessage(data.template.content);
            // Clear template from URL
            router.replace('/play', { scroll: false });
          }
        } catch (error) {
          console.error("[Practice] Error loading template:", error);
        }
      };
      loadTemplate();
    }
  }, [searchParams, isAuthenticated, router]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand/20 border-t-brand mb-4" />
          <p className="text-sm text-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  const latest = history[0];

  const handleRun = async () => {
    const fullPrompt = systemPrompt.trim() 
      ? `${systemPrompt}\n\n${userMessage}` 
      : userMessage;
    
    if (!userMessage.trim()) {
      console.log("[Practice] Run cancelled: empty user message");
      return;
    }

    const startTime = performance.now();
    const tokensUsed = estimateTokens(fullPrompt);
    const runId = `run-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log("[Practice] Starting prompt run", {
      runId,
      systemPromptLength: systemPrompt.length,
      userMessageLength: userMessage.length,
      fullPromptLength: fullPrompt.length,
      intent: intent.trim() || "not provided",
      model,
      estimatedTokens: tokensUsed,
      previousIterations: history.length,
      timestamp: new Date().toISOString(),
    });

    setLoading(true);
    let evaluation: Evaluation | null = null;
    let output: string | null = null;

    try {
      // Get evaluation
      const evalRes = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fullPrompt,
          previousIterations: history.length,
          userIntent: intent.trim() || undefined,
        }),
      });

      const evalJson = await evalRes.json();
      
      console.log("[Practice] Evaluation received", {
        runId,
        status: evalRes.status,
        hasEvaluation: !!evalJson.evaluation,
        evaluationScore: evalJson.evaluation?.score?.overall,
      });

      evaluation = evalJson.evaluation;

      // Get actual LLM output
      const outputStartTime = performance.now();
      console.log("[Practice] Generating output", {
        runId,
        model,
        systemPromptLength: systemPrompt.length,
        userMessageLength: userMessage.length,
      });

      const outputRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt: systemPrompt.trim() || undefined,
          userMessage,
          model,
        }),
      });

      if (outputRes.ok) {
        const outputData = await outputRes.json();
        output = outputData.output || "";
        const outputDuration = performance.now() - outputStartTime;
        
        console.log("[Practice] Output generated", {
          runId,
          outputLength: output.length,
          duration: `${outputDuration.toFixed(2)}ms`,
        });
      } else {
        const errorData = await outputRes.json();
        console.error("[Practice] Output generation failed", {
          runId,
          error: errorData.error,
        });
      }
    } catch (error) {
      console.error("[Practice] Error", {
        runId,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }

    if (!evaluation) {
      console.error("[Practice] No evaluation received", { runId });
      setLoading(false);
      return;
    }

    // Store in database
    if (currentUser && evaluation) {
      try {
        const saveRes = await fetch("/api/runs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            prompt: fullPrompt,
            systemPrompt: systemPrompt.trim() || undefined,
            userMessage,
            model,
            tokensUsed,
            intent: intent.trim() || undefined,
            output,
            evaluationScore: evaluation.score?.overall,
            evaluationData: evaluation,
          }),
        });

        if (saveRes.ok) {
          console.log("[Practice] Run saved to database", { runId });
        } else {
          const errorData = await saveRes.json();
          console.error("[Practice] Failed to save run", { runId, error: errorData.message });
        }
      } catch (error) {
        console.error("[Practice] Failed to save run", { runId, error });
      }
    }

    const totalDuration = performance.now() - startTime;
    const entry: HistoryItem = {
      id: history.length + 1,
      prompt: fullPrompt,
      intent: intent.trim(),
      model,
      tokensUsed,
      evaluation,
      output,
      timestamp: new Date().toISOString(),
    };

    console.log("[Practice] Run completed", {
      runId,
      totalDuration: `${totalDuration.toFixed(2)}ms`,
      historyLength: history.length + 1,
      evaluationScore: evaluation?.score?.overall,
      hasOutput: !!output,
      outputLength: output?.length || 0,
      intentMatch: evaluation?.intentMatch,
    });

    setHistory([entry, ...history].slice(0, 6));
    setLoading(false);
  };

  return (
    <div className="space-y-6 pt-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-ink">
          Practice
        </h1>
        <p className="text-sm text-muted">
          Write your prompt, run it, and get educational feedback to improve.
        </p>
      </div>

      <div className="card grid gap-6 p-6 lg:grid-cols-[1fr_1fr]">
        {/* Left: Input */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {models.map((m) => (
              <button
                key={m.id}
                  onClick={() => setModel(m.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  model === m.id
                    ? "border-brand bg-brand text-white shadow-sm"
                    : "border-border text-ink hover:border-brand"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink">Your Intent (optional)</label>
            <input
              type="text"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
              placeholder="What do you want to achieve? (e.g., 'Extract top 3 customer complaints')"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink">System Prompt (optional)</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-white p-3 font-mono text-xs text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
              placeholder="You are a helpful assistant. (System instructions that set context and behavior)"
            />
            <p className="text-xs text-muted">
              System prompt sets the AI&apos;s role and behavior. Leave empty if not needed.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink">User Message</label>
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-border bg-white p-3 font-mono text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
              placeholder="Write your message here..."
            />
            <p className="text-xs text-muted">
              This is the actual prompt or question you&apos;re asking the AI.
            </p>
          </div>
          
          <button
            onClick={handleRun}
            disabled={loading || !userMessage.trim()}
            className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
          >
            {loading ? "Running…" : "Run prompt"}
          </button>
        </div>

        {/* Right: Results */}
        <div className="space-y-4">
          {latest?.output && (
            <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                Output
              </p>
              <div className="rounded border border-border bg-card-alt p-3">
                <pre className="whitespace-pre-wrap text-xs text-ink font-mono">
                  {latest.output}
                </pre>
              </div>
            </div>
          )}
          
          <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
              Evaluation
            </p>
            {latest ? (
              <EvaluationView item={latest} />
            ) : (
              <p className="text-sm text-muted">
                Run your prompt to see feedback.
              </p>
            )}
          </div>

          {history.length > 0 && (
            <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-2">
                History ({history.length})
              </p>
              <ul className="space-y-1.5">
                {history.slice(0, 3).map((item) => (
                  <li
                    key={item.id}
                    onClick={() => {
                    // Try to parse system prompt and user message if they were stored separately
                    setUserMessage(item.prompt);
                  }}
                    className="cursor-pointer rounded border border-border bg-card-alt/50 p-2 text-xs text-muted hover:bg-card-alt transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink">V{item.id}</span>
                      <span className="text-[10px]">{item.model}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-1">{item.prompt}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
