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
            <div className="flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs text-muted shadow-sm">
              <span className="h-2 w-2 rounded-full bg-secondary" />
              Learn by doing · Get instant feedback
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="card p-4">
                <p className="text-sm font-semibold text-ink">{pillar.title}</p>
                <ul className="mt-2 space-y-2 text-sm text-muted">
                  {pillar.bullets.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
            <div className="mb-4 relative h-48 w-full rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2">Step 1 Image</p>
                  <p className="text-[10px] text-muted/70 max-w-xs">
                    Image prompt: "A clean, modern interface showing a text editor with a prompt being written. The style should be minimalist with soft blue tones. Show the prompt text clearly visible, with a model selector visible in the UI. Convey a sense of clarity and structure."
                  </p>
                </div>
              </div>
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
            <div className="mb-4 relative h-48 w-full rounded-xl bg-gradient-to-br from-secondary/20 to-secondary/5 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2">Step 2 Image</p>
                  <p className="text-[10px] text-muted/70 max-w-xs">
                    Image prompt: "An educational feedback interface showing structured feedback cards. Display 'What happened', 'Why it happened', and 'How to improve' sections. Use green and blue color accents. The design should feel helpful and educational, not judgmental."
                  </p>
                </div>
              </div>
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
            <div className="mb-4 relative h-48 w-full rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-muted">
                  <p className="text-xs font-semibold uppercase tracking-wide mb-2">Step 3 Image</p>
                  <p className="text-[10px] text-muted/70 max-w-xs">
                    Image prompt: "A version history interface showing multiple iterations of a prompt with improvement arrows. Show progression from initial to refined prompt. Use warm orange/amber tones. Convey growth and learning through iteration."
                  </p>
                </div>
              </div>
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

