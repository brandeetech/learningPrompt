const fundamentals = [
  "Always show the full prompt and model; no hidden system messages.",
  "Order of feedback: what happened → why → what to improve → optional rewrite.",
  "Clarity over cleverness: one primary action per screen.",
];

const mistakes = [
  "Asking multi-part tasks in one run without scope control.",
  "Skipping output format, leading to inconsistent comparisons.",
  "Hiding assumptions—failing to state unknowns or how to handle missing data.",
];

const patterns = [
  "Summary: bullets + risk; enforce length and audience.",
  "Analysis: factors, trade-offs, counterpoint, unknowns.",
  "Compare: shared schema (table/JSON) and recommendation with risk.",
  "Extract: JSON schema with explicit nulls and unknowns[].",
  "Critique: issues → fixes → concise example rewrite.",
];

const contentPlan = [
  "10 prompt patterns with intent + why it works.",
  "10 common mistakes with before/after prompts and outputs.",
  "5 before vs after examples that explain the delta.",
  "3 essays: why prompts fail; why structure matters; why asking is a skill.",
];

export default function LearnPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
          Learning
        </p>
        <h1 className="text-3xl font-semibold text-ink">Learning hub</h1>
        <p className="max-w-2xl text-sm text-muted">
          Educational-first guidance to reinforce the rubric used in the playground.
          Everything here should match the language shown in product UI—no hidden terms.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Fundamentals" items={fundamentals} />
        <Card title="Common mistakes" items={mistakes} />
        <Card title="Prompt patterns" items={patterns} />
      </div>

      <div className="card p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Content track (parallel to build)
        </p>
        <ul className="mt-3 grid gap-2 text-sm text-ink md:grid-cols-2">
          {contentPlan.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">
          Use the same rubric terms as the playground. Keep copy calm and instructional,
          with short paragraphs and scannable bullets.
        </p>
      </div>
    </div>
  );
}

function Card({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="card p-4">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm text-muted">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
