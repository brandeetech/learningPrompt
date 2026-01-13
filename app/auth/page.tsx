'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signUp, getCurrentUser } from "@/lib/auth";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    getCurrentUser().then((user) => {
      if (user) {
        router.push('/play');
      }
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        await signIn(email, password);
        setSuccess('Signed in successfully! Redirecting...');
        setTimeout(() => router.push('/play'), 1000);
      } else {
        await signUp(email, password);
        setSuccess('Account created! Redirecting...');
        setTimeout(() => router.push('/play'), 1000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('[Auth] Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand/5 via-background to-secondary/5">
      <div className="flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-brand to-brand-strong text-white flex items-center justify-center text-lg font-bold shadow-lg">
                AR
              </div>
              <div className="flex flex-col leading-tight text-left">
                <span className="text-2xl font-bold text-ink">AskRight</span>
                <span className="text-xs text-muted">Prompt Learning</span>
              </div>
            </Link>
            
            <div className="relative mb-8">
              {/* Decorative gradient circles */}
              <div className="absolute -top-4 -left-4 h-24 w-24 rounded-full bg-brand/20 blur-2xl" />
              <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
              
              <h1 className="relative text-3xl font-bold text-ink">
                {mode === 'login' ? 'Welcome back' : 'Start learning'}
              </h1>
              <p className="relative mt-2 text-muted">
                {mode === 'login' 
                  ? 'Sign in to continue your prompt engineering journey'
                  : 'Create your account and start improving your prompts'}
              </p>
            </div>
          </div>

          {/* Auth Card */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-white/80 backdrop-blur-sm shadow-xl">
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-secondary/5 pointer-events-none" />
            
            <div className="relative p-8">
              {/* Mode Toggle */}
              <div className="mb-6 flex gap-2 rounded-xl bg-card-alt p-1">
                <button
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    mode === 'login'
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                    mode === 'signup'
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  Sign up
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-ink mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60 focus:border-brand transition"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-ink mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/60 focus:border-brand transition"
                    placeholder="••••••••"
                  />
                  {mode === 'signup' && (
                    <p className="mt-1.5 text-xs text-muted">
                      Must be at least 6 characters
                    </p>
                  )}
                </div>

                {error && (
                  <div className="rounded-xl border border-accent/50 bg-accent/10 px-4 py-3 text-sm text-ink">
                    <div className="flex items-center gap-2">
                      <span className="text-accent">⚠️</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {success && (
                  <div className="rounded-xl border border-secondary/50 bg-secondary/10 px-4 py-3 text-sm text-ink">
                    <div className="flex items-center gap-2">
                      <span className="text-secondary">✓</span>
                      <span>{success}</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-brand to-brand-strong px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-sm"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Processing...
                    </span>
                  ) : (
                    mode === 'login' ? 'Sign in' : 'Create account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted">
                  By continuing, you agree to AskRight&apos;s{' '}
                  <Link href="/terms" className="text-brand hover:underline">terms of service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-brand hover:underline">privacy policy</Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-brand/10 p-3 text-center">
              <div className="text-2xl mb-1">📝</div>
              <p className="text-xs font-semibold text-ink">Write prompts</p>
            </div>
            <div className="rounded-xl bg-secondary/10 p-3 text-center">
              <div className="text-2xl mb-1">✨</div>
              <p className="text-xs font-semibold text-ink">Get feedback</p>
            </div>
            <div className="rounded-xl bg-accent/10 p-3 text-center">
              <div className="text-2xl mb-1">🚀</div>
              <p className="text-xs font-semibold text-ink">Learn faster</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-muted hover:text-ink transition inline-flex items-center gap-1"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
