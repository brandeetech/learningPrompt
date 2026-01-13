# AskRight — Adaptive Learning Path

Purpose: guide users from basic clarity to structured prompting by adapting tasks and guidance based on their progress signals.

## Progress Signals (track passively)
- Iterations per prompt and time between runs.
- Rubric coverage gaps over last N runs (see `docs/prompt_evaluation.md`).
- Whether users apply suggestions (version diffs).
- Template usage and outcomes (did rubric coverage improve?).
- Token exhaustion frequency before meaningful revision.

## Stages (example progression)
- Onboarding: Show controls, run first prompt, reveal feedback order.
- Fundamentals: Focus on intent clarity + context completeness; micro-tips on missing info.
- Structure: Add constraints and output format patterns; introduce 2–3 templates.
- Control: Emphasize scope control and safe reasoning steps; teach handling unknowns.
- Reflection: Encourage before/after comparison; spotlight version history and why changes matter.

## Advancement Heuristics (non-numeric)
- Move from Fundamentals → Structure after 2–3 runs with consistent intent clarity and added context.
- Move from Structure → Control after user specifies format/constraints in consecutive runs.
- Surface Reflection prompts when users iterate at least twice on the same prompt.
- If a stage regresses (e.g., missing context returns), re-show the relevant micro-tip.

## Interventions
- Micro-tips: short, stage-specific guidance injected near the playground.
- Suggested templates: offer 1–2 patterns that match the task category; avoid overwhelming.
- Reflection cards: show “before vs after” diff with why it improved.
- Guardrails: if user asks for “perfect prompt,” respond with explanation-first pattern.

## Implementation Notes
- Keep state lightweight: store last few rubric observations and timestamps.
- Stage can be derived on the fly; do not gate core functionality.
- Use the same rubric language in UI to reinforce learning.
- Keep copy calm and explanatory; avoid celebratory gamification or badges.
