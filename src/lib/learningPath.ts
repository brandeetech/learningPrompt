import { LearningStage } from "./promptEvaluator";

export const stageCopy: Record<
  LearningStage,
  { title: string; tip: string; actions: string[] }
> = {
  onboarding: {
    title: "Onboarding",
    tip: "Run your first prompt. You’ll see what it did, why, and how to improve.",
    actions: [
      "State the goal in one sentence.",
      "Add who/what it’s for.",
      "Keep scope to one task.",
    ],
  },
  fundamentals: {
    title: "Fundamentals",
    tip: "Add missing context so the model stops guessing.",
    actions: [
      "Include audience, region, timeframe, and examples.",
      "Say what to do if info is unknown.",
      "Use clear nouns instead of placeholders.",
    ],
  },
  structure: {
    title: "Structure",
    tip: "Define the shape and constraints so outputs are comparable.",
    actions: [
      "Pick an output format (bullets/table/JSON schema).",
      "Set tone/length limits and must-include items.",
      "Keep it one task per run.",
    ],
  },
  control: {
    title: "Control",
    tip: "Keep the model inside bounds and surface unknowns.",
    actions: [
      "Ask for unknowns to be flagged explicitly.",
      "Request reasoning steps only when necessary.",
      "Restate scope + format together.",
    ],
  },
  reflection: {
    title: "Reflection",
    tip: "Compare versions and note why the latest is better.",
    actions: [
      "Check the diff: what changed and why?",
      "Did you tighten context, constraints, and format?",
      "Plan the next iteration before running again.",
    ],
  },
};
