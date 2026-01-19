import Link from "next/link";

const pillars = [
  {
    title: "Guided practice",
    bullets: [
      "Model choice stays visible; prompt is never hidden.",
      "Immediate feedback: what happened → why → how to improve.",
      "Optional rewrite comes last, not first.",
    ],
  },
  {
    title: "Educational evaluation",
    bullets: [
      "Rubric: intent, context, constraints, format, scope, reasoning, assumptions.",
      "No grades—only explanations and targeted suggestions.",
      "Tracks iterations to adapt guidance and suggest next steps.",
    ],
  },
  {
    title: "Learning-ready content",
    bullets: [
      "Templates with intent + example + why it works.",
      "Learning section with fundamentals, mistakes, patterns.",
      "Before/after comparisons to build intuition.",
    ],
  },
];


export default function Home() {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="grid items-center gap-10 md:grid-cols-[1.2fr_1fr] pt-8">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            AskRight · Prompt Learning
          </p>
          <h1 className="text-4xl font-semibold leading-[1.1] text-ink">
            Learn how to ask AI the right way—by practicing with feedback, not vibes.
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            AskRight is a calm, educational practice space. We teach clarity and structure:
            the prompt is always visible, the model is explicit, and feedback is
            explain-first so users understand *why* outputs change.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/auth"
              className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-strong"
            >
              Get started
            </Link>
            <Link
              href="/templates"
              className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-ink transition hover:border-ink hover:bg-card-alt"
            >
              View templates
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-brand/10 via-secondary/5 to-accent/10 p-8 shadow-lg">
          {/* Hero illustration */}
          <div className="relative h-64 w-full rounded-xl mb-4 overflow-hidden">
            <img 
              src="/hero-illustration.png" 
              alt="Person working with AI assistant on computer" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Feature highlights with colors */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-brand/10 p-3 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-brand/20 mb-2 flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <p className="text-xs font-semibold text-ink">Write</p>
            </div>
            <div className="rounded-xl bg-secondary/10 p-3 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-secondary/20 mb-2 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <p className="text-xs font-semibold text-ink">Improve</p>
            </div>
            <div className="rounded-xl bg-accent/10 p-3 text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-accent/20 mb-2 flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <p className="text-xs font-semibold text-ink">Learn</p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            Why AskRight
          </p>
          <h2 className="text-2xl font-semibold text-ink">
            Educational-first approach
          </h2>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="card p-5">
              <h3 className="text-base font-semibold text-ink mb-3">{pillar.title}</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                {pillar.bullets.map((item) => (
                  <li key={item} className="flex gap-2.5">
                    <span className="mt-[6px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted">
            How it works
          </p>
          <h2 className="text-2xl font-semibold text-ink">
            Practice with instant feedback
          </h2>
          <p className="mt-2 text-muted">
            Sign in to access the practice area and start improving your prompts with real-time evaluation.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {/* Step 1 */}
          <div className="card p-6">
            <div className="mb-4 relative h-48 w-full rounded-xl overflow-hidden">
              <img 
                src="/step-1-write-prompt.png" 
                alt="Text editor with prompt being written" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">1</span>
              <h3 className="text-lg font-semibold text-ink">Write your prompt</h3>
            </div>
            <p className="text-sm text-muted">
              Start with your intent, then write your prompt. The model and system instructions are always visible.
            </p>
          </div>

          {/* Step 2 */}
          <div className="card p-6">
            <div className="mb-4 relative h-48 w-full rounded-xl overflow-hidden">
              <img 
                src="/step-2-feedback.png" 
                alt="Educational feedback interface with structured feedback cards" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-white">2</span>
              <h3 className="text-lg font-semibold text-ink">Get feedback</h3>
            </div>
            <p className="text-sm text-muted">
              Receive structured feedback: what your prompt did, why the output happened, and how to improve.
            </p>
          </div>

          {/* Step 3 */}
          <div className="card p-6">
            <div className="mb-4 relative h-48 w-full rounded-xl overflow-hidden">
              <img 
                src="/step-3-iterate.png" 
                alt="Version history interface showing prompt iterations and improvements" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-semibold text-white">3</span>
              <h3 className="text-lg font-semibold text-ink">Iterate and learn</h3>
            </div>
            <p className="text-sm text-muted">
              Compare versions, see your progress, and build intuition about what makes prompts effective.
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Link
            href="/auth"
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-brand-strong"
          >
            Sign in to get started
          </Link>
        </div>
      </section>
    </div>
  );
}

