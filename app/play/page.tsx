'use client';

import { useMemo, useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Evaluation, estimateTokens } from "@/lib/promptEvaluator";
import Link from "next/link";
import { getScoreColor, getScoreBgColor, getScoreLabel } from "@/lib/evaluationColors";
import { getCurrentUser } from "@/lib/auth";
import type { Template } from "@/lib/db/schema";
import { PromptHistory } from "@/components/promptHistory";
import type { Prompt, PromptVersion } from "@/lib/db/schema";

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

type PromptWithVersion = Prompt & { latestVersion?: PromptVersion };

const models = [
  { id: "openai/gpt-4o-mini", label: "GPT" },
  { id: "anthropic/claude-3-5-sonnet-20241022", label: "Claude" },
  { id: "google/gemini-1.5-flash", label: "Gemini" },
];

const startingPrompt =
  "Act as a prompt coach. I want to write a prompt that extracts the top 3 customer complaints from support tickets. Help me design it.";

function PracticePage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [userMessage, setUserMessage] = useState(startingPrompt);
  const [intent, setIntent] = useState("");
  const [model, setModel] = useState(models[0].id);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [outputExpanded, setOutputExpanded] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
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
          outputLength: (output || "").length,
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
          // Refresh history sidebar
          setHistoryRefreshKey(prev => prev + 1);
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

  const handleSelectPrompt = async (prompt: PromptWithVersion) => {
    if (prompt.latestVersion) {
      // Load the prompt content
      if (prompt.latestVersion.systemInstructions) {
        setSystemPrompt(prompt.latestVersion.systemInstructions);
      } else {
        setSystemPrompt('');
      }
      
      if (prompt.latestVersion.userMessage) {
        setUserMessage(prompt.latestVersion.userMessage);
      } else {
        setUserMessage(prompt.latestVersion.content);
      }
      
      if (prompt.intent) {
        setIntent(prompt.intent);
      }
      
      if (prompt.latestVersion.model) {
        setModel(prompt.latestVersion.model);
      }

      // Fetch all versions of this prompt to populate history
      try {
        const response = await fetch(`/api/prompts?promptId=${prompt.id}`);
        const data = await response.json();
        
        if (data.ok && data.prompt && data.prompt.versions) {
          // Convert versions to HistoryItem format
          const historyItems: HistoryItem[] = data.prompt.versions.map((version: PromptVersion, index: number) => {
            const fullPrompt = version.systemInstructions 
              ? `${version.systemInstructions}\n\n${version.userMessage || version.content}`
              : (version.userMessage || version.content);
            
            return {
              id: version.versionNumber,
              prompt: fullPrompt,
              intent: prompt.intent || '',
              model: version.model,
              tokensUsed: version.tokensUsed || 0,
              evaluation: version.evaluationData as Evaluation || {
                score: { overall: version.evaluationScore || 0 },
                feedback: [],
                strengths: [],
                improvements: [],
                intentMatch: -1,
              },
              output: version.output || null,
              timestamp: version.createdAt?.toString() || new Date().toISOString(),
            };
          });
          
          // Set history with all versions
          setHistory(historyItems);
          
          // If there's output in the latest version, expand it
          if (prompt.latestVersion.output) {
            setOutputExpanded(true);
          }
        }
      } catch (error) {
        console.error('[Practice] Error fetching prompt versions:', error);
      }
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 pt-8">
      <PromptHistory refreshKey={historyRefreshKey} onSelectPrompt={handleSelectPrompt} />
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-ink">
          Practice
        </h1>
        <p className="text-sm text-muted">
          Write your prompt, run it, and get educational feedback to improve.
        </p>
      </div>

      <div className="card space-y-6 p-6">
        {/* Top Section: All Input Fields in Rows */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!loading && userMessage.trim()) {
              handleRun();
            }
          }}
          className="space-y-4"
        >
          {/* Model Selector Row */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink">Model</label>
            <div className="flex flex-wrap items-center gap-2">
              {models.map((m) => (
                <button
                  key={m.id}
                  type="button"
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
            </div>
          </div>
          
          {/* Intent Row */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink">Your Intent (optional)</label>
            <input
              type="text"
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
                  e.preventDefault();
                  if (!loading && userMessage.trim()) {
                    handleRun();
                  }
                }
              }}
              className="w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
              placeholder="What do you want to achieve? (e.g., 'Extract top 3 customer complaints')"
            />
          </div>

          {/* System Prompt Row */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink">System Prompt (optional)</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  if (!loading && userMessage.trim()) {
                    handleRun();
                  }
                }
              }}
              rows={4}
              className="w-full rounded-lg border border-border bg-white p-4 font-mono text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
              placeholder="You are a helpful assistant. (System instructions that set context and behavior)"
            />
            <p className="text-xs text-muted">
              System prompt sets the AI&apos;s role and behavior. Leave empty if not needed. Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to submit.
            </p>
          </div>
          
          {/* User Message Row */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-ink">User Message</label>
            <textarea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  if (!loading && userMessage.trim()) {
                    handleRun();
                  }
                }
              }}
              rows={6}
              className="w-full rounded-lg border border-border bg-white p-4 font-mono text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
              placeholder="Write your message here..."
            />
            <p className="text-xs text-muted">
              This is the actual prompt or question you&apos;re asking the AI. Press Cmd+Enter (Mac) or Ctrl+Enter (Windows) to submit.
            </p>
          </div>
          
          {/* Run Button Row */}
          <div>
            <button
              type="submit"
              disabled={loading || !userMessage.trim()}
              className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
            >
              {loading ? "Running…" : "Run prompt"}
            </button>
          </div>
        </form>

        {/* Second Row: Output (Collapsible) */}
        {latest?.output && (
          <div className="rounded-lg border border-border bg-white shadow-sm">
            <button
              onClick={() => setOutputExpanded(!outputExpanded)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-card-alt/50 transition"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Output
              </p>
              <svg
                className={`w-4 h-4 text-muted transition-transform ${outputExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {outputExpanded && (
              <div className="border-t border-border p-4">
                <div className="rounded border border-border bg-card-alt p-3 max-h-[400px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-xs text-ink font-mono">
                    {latest.output}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Third Row: Evaluation */}
        {latest && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Evaluation
            </p>
            <EvaluationView 
              item={latest} 
              onUseRewrite={(rewrite) => {
                setUserMessage(rewrite);
                setOutputExpanded(false);
              }}
            />
          </div>
        )}

        {/* History Section */}
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
  );
}

function EvaluationView({ item, onUseRewrite }: { item: HistoryItem; onUseRewrite?: (rewrite: string) => void }) {
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
    <div className="space-y-4">
      {/* First Row: Overall Score */}
      <div className="rounded-lg border border-border bg-card-alt p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Overall Score
          </p>
          <div className={`rounded-full px-4 py-1.5 text-sm font-semibold ${getScoreBgColor(score.overall)} ${getScoreColor(score.overall)}`}>
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
        {intent && evaluation.intentMatch >= 0 && (
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

      {/* Second Row: What it did and Why - Two Columns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* What it did */}
        <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
            1) What the prompt did
          </p>
          <ul className="space-y-2">
            {evaluation.whatHappened.map((entry) => (
              <li
                key={entry}
                className="rounded-lg bg-card-alt/60 px-3 py-2 text-sm text-ink"
              >
                {entry}
              </li>
            ))}
          </ul>
        </div>

        {/* Why */}
        <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
            2) Why that output would happen
          </p>
          <ul className="space-y-2">
            {evaluation.why.map((entry) => (
              <li
                key={entry}
                className="rounded-lg bg-card-alt/60 px-3 py-2 text-sm text-ink"
              >
                {entry}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Third Row: Improvements - Full Width, Focused */}
      <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-3">
          3) How to improve
        </p>
        <ul className="space-y-3">
          {evaluation.improvements.map((entry, index) => (
            <li
              key={index}
              className="rounded-lg bg-brand/5 border border-brand/20 px-4 py-3 text-sm text-ink"
            >
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white mt-0.5">
                  {index + 1}
                </span>
                <span>{entry}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Final Row: Rewrite with Use Button */}
      <div className="rounded-lg border border-border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            4) Improved rewrite
          </p>
          {onUseRewrite && evaluation.rewrite && (
            <button
              onClick={() => onUseRewrite(evaluation.rewrite)}
              className="rounded-full bg-brand px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-brand-strong"
            >
              Use this improvement
            </button>
          )}
        </div>
        <div className="rounded-lg border-2 border-brand/30 bg-brand/5 p-4">
          <pre className="whitespace-pre-wrap text-sm text-ink font-mono">
            {evaluation.rewrite}
          </pre>
        </div>
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

export default function PracticePageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand/20 border-t-brand mb-4" />
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    }>
      <PracticePage />
    </Suspense>
  );
}
