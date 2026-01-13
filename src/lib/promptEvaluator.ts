export type LearningStage =
  | "onboarding"
  | "fundamentals"
  | "structure"
  | "control"
  | "reflection";

export type EvaluationScore = {
  intentClarity: number; // 0-100
  contextCompleteness: number; // 0-100
  constraints: number; // 0-100
  outputFormat: number; // 0-100
  scopeControl: number; // 0-100
  overall: number; // 0-100, average of above
};

export type Evaluation = {
  whatHappened: string[];
  why: string[];
  improvements: string[];
  rewrite: string;
  missing: string[];
  stage: LearningStage;
  score: EvaluationScore;
  intentMatch?: number; // 0-100, how well prompt matches user's stated intent
};

type EvaluateOptions = {
  previousIterations?: number;
  userIntent?: string; // User's stated intent to compare with prompt
};

const formatKeywords = ["json", "table", "bullet", "bullets", "list", "markdown"];
const contextKeywords = ["audience", "region", "market", "example", "data", "source"];
const constraintKeywords = ["tone", "length", "words", "sentences", "must", "avoid"];
const scopeKeywords = ["single", "one", "focus", "narrow", "bounded"];

function detectMissing(prompt: string) {
  const lower = prompt.toLowerCase();
  const missing: string[] = [];

  if (!formatKeywords.some((word) => lower.includes(word))) {
    missing.push("output format");
  }
  if (!contextKeywords.some((word) => lower.includes(word))) {
    missing.push("context/examples");
  }
  if (!constraintKeywords.some((word) => lower.includes(word))) {
    missing.push("constraints (tone/length/must-include)");
  }
  if (!scopeKeywords.some((word) => lower.includes(word))) {
    missing.push("scope control");
  }

  return missing;
}

function deriveStage(missing: string[], previousIterations = 0): LearningStage {
  if (previousIterations === 0) return "onboarding";
  if (missing.includes("context/examples")) return "fundamentals";
  if (missing.includes("output format") || missing.includes("constraints (tone/length/must-include)")) {
    return "structure";
  }
  if (missing.includes("scope control")) return "control";
  return previousIterations > 1 ? "reflection" : "control";
}

function calculateScore(missing: string[], prompt: string, userIntent?: string): EvaluationScore {
  const lower = prompt.toLowerCase();
  
  // Intent clarity (0-100)
  const hasGoal = prompt.trim().length > 10;
  const hasQuestion = prompt.includes('?');
  const intentClarity = hasGoal ? (hasQuestion ? 90 : 70) : 40;
  
  // Context completeness (0-100)
  const contextKeywords = ["audience", "region", "market", "example", "data", "source", "for", "about"];
  const hasContext = contextKeywords.some(word => lower.includes(word));
  const contextCompleteness = missing.includes("context/examples") ? 30 : (hasContext ? 80 : 50);
  
  // Constraints (0-100)
  const constraintKeywords = ["tone", "length", "words", "sentences", "must", "avoid", "keep", "limit"];
  const hasConstraints = constraintKeywords.some(word => lower.includes(word));
  const constraints = missing.includes("constraints (tone/length/must-include)") ? 30 : (hasConstraints ? 85 : 50);
  
  // Output format (0-100)
  const formatKeywords = ["json", "table", "bullet", "bullets", "list", "markdown", "format"];
  const hasFormat = formatKeywords.some(word => lower.includes(word));
  const outputFormat = missing.includes("output format") ? 25 : (hasFormat ? 90 : 45);
  
  // Scope control (0-100)
  const scopeKeywords = ["single", "one", "focus", "narrow", "bounded", "top", "first"];
  const hasScope = scopeKeywords.some(word => lower.includes(word));
  const scopeControl = missing.includes("scope control") ? 35 : (hasScope ? 85 : 60);
  
  const overall = Math.round(
    (intentClarity + contextCompleteness + constraints + outputFormat + scopeControl) / 5
  );
  
  return {
    intentClarity,
    contextCompleteness,
    constraints,
    outputFormat,
    scopeControl,
    overall,
  };
}

function calculateIntentMatch(prompt: string, userIntent?: string): number | undefined {
  if (!userIntent || !userIntent.trim()) return undefined;
  
  const promptLower = prompt.toLowerCase();
  const intentLower = userIntent.toLowerCase();
  
  // Simple keyword matching - in production, use more sophisticated NLP
  const intentWords = intentLower.split(/\s+/).filter(w => w.length > 3);
  const matchingWords = intentWords.filter(word => promptLower.includes(word));
  
  if (intentWords.length === 0) return undefined;
  
  const matchRatio = matchingWords.length / intentWords.length;
  return Math.round(matchRatio * 100);
}

export function evaluatePrompt(
  prompt: string,
  options: EvaluateOptions = {}
): Evaluation {
  const missing = detectMissing(prompt);
  const stage = deriveStage(missing, options.previousIterations);
  const trimmed = prompt.trim().replace(/\s+/g, " ");
  const goal = trimmed.length > 140 ? `${trimmed.slice(0, 140)}…` : trimmed;

  const score = calculateScore(missing, prompt, options.userIntent);
  const intentMatch = calculateIntentMatch(prompt, options.userIntent);

  const whatHappened = [
    goal ? `Detected goal: "${goal}"` : "Goal unclear; state the outcome in one sentence.",
    "Model choice impacts style/latency—keep it visible to the user.",
  ];

  const why: string[] = [];
  if (missing.includes("context/examples")) {
    why.push(
      "Without audience/region/examples, the model will fill gaps with generic content."
    );
  }
  if (missing.includes("output format")) {
    why.push("No output format leads to variable structure and harder comparison.");
  }
  if (missing.includes("constraints (tone/length/must-include)")) {
    why.push("Missing constraints make answers verbose or off-tone.");
  }
  if (missing.includes("scope control")) {
    why.push("Unbounded asks risk drift and hallucination; limit tasks per run.");
  }
  if (why.length === 0) {
    why.push("Prompt is reasonably structured; emphasize reflection and iteration.");
  }

  const improvements: string[] = [];
  if (missing.includes("context/examples")) {
    improvements.push("Add audience/region/timeframe/examples so the model stops guessing.");
  }
  if (missing.includes("output format")) {
    improvements.push("Specify the output shape (bullets, table, JSON schema).");
  }
  if (missing.includes("constraints (tone/length/must-include)")) {
    improvements.push("Add constraints: tone, length, must-include facts, and exclusions.");
  }
  if (missing.includes("scope control")) {
    improvements.push("Narrow the ask to one clear task; ask for unknowns to be flagged.");
  }
  if (improvements.length === 0) {
    improvements.push("Compare this version with the previous one; note why it improved.");
  }

  const rewriteParts = [
    "State the goal and audience in one sentence.",
    "Add key context (region/timeframe/examples).",
    "Specify format (e.g., 4 bullets + 1 risk; or JSON with fields).",
    "Set constraints (tone/length) and what to do if data is unknown.",
  ];

  const rewrite = rewriteParts.join(" ");

  return {
    whatHappened,
    why,
    improvements,
    rewrite,
    missing,
    stage,
    score,
    intentMatch,
  };
}

export function estimateTokens(prompt: string) {
  const words = prompt.trim().split(/\s+/).filter(Boolean).length;
  const base = 120;
  return Math.max(base, Math.round(words * 1.4));
}
