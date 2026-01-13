'use client';

import { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement actual Supabase auth
      // For now, just show a message
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError('Authentication not yet implemented. Configure Supabase auth to enable this feature.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-brand text-white flex items-center justify-center text-sm font-semibold shadow-sm">
              AR
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-lg font-semibold text-ink">AskRight</span>
              <span className="text-xs text-muted">Prompt Learning</span>
            </div>
          </Link>
          <h1 className="mt-6 text-2xl font-semibold text-ink">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {mode === 'login' 
              ? 'Sign in to continue learning prompt engineering'
              : 'Start your journey to better prompts'}
          </p>
        </div>

        <div className="card p-6">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === 'login'
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-card-alt text-muted hover:text-ink'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === 'signup'
                  ? 'bg-brand text-white shadow-sm'
                  : 'bg-card-alt text-muted hover:text-ink'
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-ink mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-xl border border-border bg-white px-4 py-2 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-accent bg-accent/10 px-4 py-3 text-sm text-ink">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-muted">
            <p>
              By continuing, you agree to AskRight&apos;s terms of service and privacy policy.
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-muted hover:text-ink transition"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
