# AskRight — Agent Notes

This file summarizes the MVP plan and product guardrails from `desc.md` so future agents can build consistently and keep the build educational-first.

## Product Summary
- AskRight is a personal, educational prompt engineering app.
- It teaches users how to ask better questions via practice, feedback, and structure.
- It is not a prompt marketplace, observability platform, or agent builder.

## Target User
- Professionals who use LLMs regularly but struggle with inconsistent results.
- People who want clarity and structure over hacks or gimmicks.

## Brand + UX Principles
- Calm, minimal, educational; whitespace is a feature.
- Clarity over cleverness, learning over shortcuts, structure over vibes.
- Always show the actual prompt text, model used, and system instructions.
- Feedback order: what happened → why → what to improve → optional rewrite (never start with a rewrite).
- Reduce cognitive load; avoid power-user toggles; one primary action per screen.

## Visual System (Starting Points, Not Final)
- Colors (tunable with research): deep blue #1E3A8A (trust), soft green #22C55E (learning), amber #F59E0B (highlights/CTAs), off-white #F9FAFB (background), slate #0F172A (text).
- Typography: Inter for UI; JetBrains Mono for prompts/code. Treat as a starting stack—swap only if legibility or brand research dictates.
- Layout: prefer clear hierarchy, generous spacing, and explicit context (model, system prompt, tokens).
- Motion: minimal and purposeful; support learning (e.g., staged reveal of feedback rather than flashy transitions).

## Core MVP Features
- Prompt playground: input, model select (GPT/Claude/Gemini), run, stream output.
- Prompt evaluation (educational): LLM feedback focused on clarity, context, constraints, format, and scope; no grades.
- Improvement suggestions: static + LLM-generated (explanations first, rewrite optional).
- Templates: curated patterns with intent + example + rationale.
- Learning section: fundamentals, mistakes, patterns, links.
- Versioning: linear versions per prompt; restore older versions.
- Token-based usage: free tier with quotas; lock on exhaustion; upgrade or bring own API key.
- Landing page with no-login demo prompt and CTA.

## Educational Evaluation + Learning Path
- Principle: teach thinking, not produce "perfect prompts." No numeric grading in MVP.
- Rubric focus: intent clarity, context completeness, constraints, output format, scope control, reasoning steps. Each run produces short observations and 1–3 targeted improvement suggestions.
- Sequence feedback: 1) what the prompt did, 2) why that output happened, 3) what to improve, 4) optional rewrite.
- Learning path: adapt guidance based on user progress (iteration count, rubric coverage, time between revisions). Start with fundamentals; unlock structure patterns and formatting guidance as users show competence. Keep friction that encourages reflection.
- Progress signals to capture: number of iterations per prompt, improvements accepted/applied, template usage, token exhaustion leading to revisions, time-to-second-run.
- Evaluation pipeline: prefer Vercel AI Gateway for model calls; fall back to local heuristic evaluation when gateway or keys are absent.

## Non-Goals (MVP)
- Community features, sharing, or marketplaces.
- Enterprise observability, governance, or RBAC.
- Agent orchestration, prompt injection tooling, collaboration.
- Scoring prompts numerically (use explanations only).

## Tech Stack (Assumed)
- Next.js (App Router) on Vercel.
- Tailwind CSS.
- Supabase (Auth, Postgres, RLS).
- Vercel AI SDK with OpenAI/Anthropic/Google providers.

## Data Model (Supabase)
- users: role (free|pro|admin), tokens_remaining.
- prompts: per-user prompt records.
- prompt_versions: per-prompt version history.
- templates: curated prompt patterns.
- usage_logs: per-run model usage.

## Token + Model Logic
1. User selects model.
2. Check tokens.
3. Route to provider via Vercel AI Gateway (uses gateway API keys).
4. Record tokens used and deduct.

## Roadmap Phases
1. Foundation: auth, DB, playground, single model.
2. Learning layer: templates, evals, suggestions, versioning.
3. Monetization: tokens, Stripe, pro tier, API keys.
4. Polish: landing demo, UX improvements, admin tools.

## Success Criteria
- Users iterate prompts and understand why changes matter.
- Prompt quality improves with feedback.
- Token exhaustion drives upgrade intent.

## Risks to Avoid
- Becoming a rewrite tool or one-click prompt fixer.
- Hiding explanations behind a perfect rewrite.
- Over-automation that removes learning friction.
