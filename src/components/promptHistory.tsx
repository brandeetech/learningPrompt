'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Prompt, PromptVersion } from '@/lib/db/schema';

type PromptWithVersion = Prompt & { latestVersion?: PromptVersion };

interface PromptHistoryProps {
  onSelectPrompt: (prompt: PromptWithVersion) => void;
  refreshKey?: number;
}

export function PromptHistory({ onSelectPrompt, refreshKey = 0 }: PromptHistoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompts, setPrompts] = useState<PromptWithVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/prompts');
        
        if (!response.ok) {
          // Handle non-200 responses
          if (response.status === 401) {
            setError('Please sign in to view your prompt history');
          } else {
            setError('Failed to load prompts');
          }
          setPrompts([]);
          setLoading(false);
          return;
        }

        const data = await response.json();
        if (data.ok) {
          setPrompts(data.prompts || []);
        } else {
          setError(data.message || 'Failed to load prompts');
          setPrompts([]);
        }
      } catch (error) {
        console.error('[PromptHistory] Error fetching prompts:', error);
        setError('Failed to load prompts');
        setPrompts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [refreshKey]);

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <>
      {/* Toggle Button - Always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-20 z-30 rounded-lg border border-border bg-card-alt px-3 py-2 shadow-md transition hover:bg-card-alt/80"
        aria-label={isOpen ? 'Close history' : 'Open history'}
      >
        <svg
          className={`h-5 w-5 text-ink transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-20 h-full w-64 bg-card-alt border-r border-border shadow-lg transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-border p-4">
            <h2 className="text-sm font-semibold text-ink">History</h2>
            <p className="text-xs text-muted mt-1">{prompts.length} prompts</p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-xs text-muted">{error}</p>
                {error.includes('sign in') && (
                  <Link
                    href="/auth"
                    className="text-xs text-brand hover:underline mt-2 inline-block"
                  >
                    Sign in
                  </Link>
                )}
              </div>
            ) : prompts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-muted">No prompts yet</p>
                <p className="text-xs text-muted mt-1">Run a prompt to see it here</p>
              </div>
            ) : (
              <div className="space-y-2">
                {prompts.map((prompt) => (
                  <button
                    key={prompt.id}
                    onClick={() => {
                      onSelectPrompt(prompt);
                      setIsOpen(false);
                    }}
                    className="w-full rounded-lg border border-border bg-card-alt/50 p-3 text-left transition hover:bg-card-alt hover:border-brand"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-ink truncate">
                          {prompt.title || 'Untitled'}
                        </p>
                        {prompt.intent && (
                          <p className="text-[10px] text-muted mt-1 line-clamp-1">
                            {prompt.intent}
                          </p>
                        )}
                        {prompt.latestVersion && (
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className="text-[10px] text-muted">
                              {prompt.latestVersion.model.split('/')[1]?.split('-')[0] || prompt.latestVersion.model}
                            </span>
                            {prompt.latestVersion.evaluationScore !== null && (
                              <span className="text-[10px] font-semibold text-muted">
                                {prompt.latestVersion.evaluationScore}/100
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-muted mt-2">
                      {formatDate(prompt.createdAt)}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-10 bg-black/20"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
