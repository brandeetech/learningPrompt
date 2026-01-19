import type { ReactNode } from "react";
import Image from "next/image";

type LessonSection = {
  title: string;
  description?: ReactNode;
  bullets?: ReactNode[];
};

type Lesson = {
  id: string;
  label: string;
  title: string;
  summary: ReactNode;
  focus: string;
  bullets: ReactNode[];
  sections: LessonSection[];
  examples: { label: string; content: string }[];
  tip: string;
  image?: { src: string; alt: string; caption: string };
};

const lessons: Lesson[] = [
  {
    id: "lesson-1",
    label: "Lesson 1",
    title: "What Is a Prompt?",
    summary: (
      <>
        A prompt is the text you give an AI to produce a response. Strong prompts
        combine an <strong>instruction</strong>, <strong>context</strong>,{" "}
        <strong>input data</strong>, and an <strong>output indicator</strong>. When
        one part is missing, the model fills gaps with guesses.
      </>
    ),
    focus: "Foundations",
    bullets: [
      <>
        <strong className="text-ink">Instruction</strong>: the task (summarize,
        classify, plan).
      </>,
      <>
        <strong className="text-ink">Context</strong>: background, audience, or
        constraints.
      </>,
      <>
        <strong className="text-ink">Input data</strong>: the content to analyze or
        transform.
      </>,
      <>
        <strong className="text-ink">Output indicator</strong>: a cue for format or
        label.
      </>,
      "Short prompts still work if each element is clear.",
      "Missing context is the main reason for vague output.",
    ],
    sections: [
      {
        title: "Why it matters",
        description:
          "The model does not read your mind. The prompt is the only signal it has. When you provide intent, context, and format, the model can align its response with your goal.",
      },
      {
        title: "Build a complete prompt",
        bullets: [
          "Start with a single sentence that names the goal.",
          "Add 1-2 facts about audience, scope, or constraints.",
          "Paste the input data or describe where it comes from.",
          "End with the output indicator that signals the format.",
        ],
      },
      {
        title: "Checklist before you run",
        bullets: [
          "Can a new reader understand the goal in 10 seconds?",
          "Is the audience or use case explicit?",
          "Did you define the output format?",
          "If data is missing, did you ask to flag unknowns?",
        ],
      },
    ],
    examples: [
      {
        label: "Prompt",
        content:
          "Classify the text into neutral, negative, or positive.\nText: I think the food was okay.\nSentiment:",
      },
      { label: "Response", content: "Neutral" },
    ],
    tip: "Add one concrete detail to remove guesswork: audience, scope, or format.",
    image: {
      src: "/step-1-write-prompt.png",
      alt: "Prompt editor with a clear instruction and input data",
      caption: "A prompt is a package of intent, context, and format cues.",
    },
  },
  {
    id: "lesson-2",
    label: "Lesson 2",
    title: "Clear and Specific Instructions",
    summary: (
      <>
        Vague prompts produce vague answers. Be explicit about the topic, audience,
        scope, and format so the model can match your expectations. Specificity is the
        fastest way to improve quality.
      </>
    ),
    focus: "Clarity",
    bullets: [
      "Use exact verbs: explain, list, compare, extract.",
      "Set scope: word count, time range, or key points.",
      "Add context: audience, goal, or examples.",
      "Name the format: bullets, table, JSON, or code.",
      "Specify tone: casual, professional, neutral.",
      "Ask for unknowns to be flagged.",
    ],
    sections: [
      {
        title: "Why it matters",
        description:
          "Specific prompts reduce ambiguity. When you say who the answer is for and how it should look, the model can focus on the right details instead of guessing.",
      },
      {
        title: "Make the prompt precise",
        bullets: [
          "Replace broad topics with a single focus.",
          "State the audience level: expert, beginner, student.",
          "Add constraints like length, tone, or perspective.",
          "Ask for a concrete structure so you can compare outputs.",
        ],
      },
      {
        title: "Common pitfalls",
        bullets: [
          "Leaving scope open so the output drifts.",
          "Asking for multiple tasks in one prompt.",
          "Using vague verbs like describe without context.",
        ],
      },
    ],
    examples: [
      {
        label: "Prompt",
        content:
          "Explain how human activities contribute to climate change in simple terms for a high-school student. Use 3 bullet points.",
      },
      {
        label: "Response",
        content:
          "- Burning fossil fuels adds heat-trapping gases to the air.\n- Deforestation reduces trees that absorb carbon dioxide.\n- Industrial processes release emissions that warm the planet.",
      },
    ],
    tip: "If output is generic, narrow the topic and state the audience clearly.",
  },
  {
    id: "lesson-3",
    label: "Lesson 3",
    title: "Few-Shot and Examples",
    summary: (
      <>
        Few-shot prompting teaches the model a pattern with one or two examples. It is
        useful when zero-shot results are inconsistent or poorly formatted. Keep
        examples short so you preserve tokens for the real task.
      </>
    ),
    focus: "Pattern learning",
    bullets: [
      "Show 1-2 input-output pairs before the real request.",
      "Keep formatting identical between examples and the task.",
      "Use few-shot for classification, extraction, or translation.",
      "Short examples are better than long explanations.",
      "Include both input and output labels.",
      "Stop adding examples once the pattern is learned.",
    ],
    sections: [
      {
        title: "When to use few-shot",
        bullets: [
          "When the model keeps changing the output format.",
          "When the task is specialized or domain specific.",
          "When you need consistent labels across runs.",
        ],
      },
      {
        title: "How to write examples",
        bullets: [
          "Mirror the exact format you want in the final answer.",
          "Use short examples that show the boundary cases.",
          "Avoid noisy or irrelevant details that confuse the pattern.",
        ],
      },
      {
        title: "Keep it efficient",
        description:
          "Few-shot prompts can grow fast. Use the smallest number of examples that produces reliable output. If the model gets it after two examples, stop there.",
      },
    ],
    examples: [
      {
        label: "Prompt",
        content:
          "Text: I love this product! - Sentiment: Positive\nText: That movie was terrible. - Sentiment: Negative\nNow classify:\nText: The weather is okay. - Sentiment:",
      },
      { label: "Response", content: "Neutral" },
    ],
    tip: "If a single example fails, add one more and tighten the format.",
    image: {
      src: "/file.svg",
      alt: "Document icon representing example patterns",
      caption: "Examples teach the model the shape and correctness of answers.",
    },
  },
  {
    id: "lesson-4",
    label: "Lesson 4",
    title: "Roles and Personas",
    summary: (
      <>
        Roles guide tone and expertise. Asking the model to act as a specific
        professional helps it choose vocabulary and depth. Pair the role with an
        audience to keep the answer grounded.
      </>
    ),
    focus: "Tone and expertise",
    bullets: [
      "Choose a role that matches the task and audience.",
      "State the audience to set vocabulary level.",
      "Keep role descriptions short and specific.",
      "Avoid conflicting roles in the same prompt.",
      "Use roles to control tone and perspective.",
      "Reinforce the role when refining the prompt.",
    ],
    sections: [
      {
        title: "Role plus audience",
        description:
          "Roles set expertise while the audience controls the clarity level. A professor speaking to a student is different from a professor speaking to peers.",
      },
      {
        title: "Make roles practical",
        bullets: [
          "Use real professions: analyst, teacher, product manager.",
          "Add constraints like length or format.",
          "If the tone drifts, restate the role in the revision.",
        ],
      },
      {
        title: "Pitfalls to avoid",
        bullets: [
          "Using overly broad roles like expert without context.",
          "Mixing roles that conflict, such as comedian and auditor.",
          "Assuming the role replaces context or format.",
        ],
      },
    ],
    examples: [
      {
        label: "Prompt",
        content:
          "As a nutritionist, explain the benefits of vitamin D to a patient in plain language.",
      },
      {
        label: "Response",
        content:
          "Vitamin D helps your body absorb calcium, which keeps bones strong. It also supports your immune system. We get it from sunlight and foods like fish and fortified milk.",
      },
    ],
    tip: "Roles are a fast way to set tone without long instructions.",
  },
  {
    id: "lesson-5",
    label: "Lesson 5",
    title: "Controlling Output Format",
    summary: (
      <>
        Formatting instructions reduce ambiguity. Ask for bullet points, tables,
        JSON, or code blocks so the output is structured and easy to review. The more
        specific the schema, the more consistent the result.
      </>
    ),
    focus: "Structure",
    bullets: [
      "Name the format clearly: bullets, table, JSON, code.",
      "Define columns or keys for consistent structure.",
      "Request concise output when comparing versions.",
      "Use labels for sections if the response is long.",
      "Add a rule like no extra commentary if needed.",
      "Test formats on small examples first.",
    ],
    sections: [
      {
        title: "Why format matters",
        description:
          "When outputs are structured, it is easier to compare versions and evaluate improvements. Formats also reduce accidental creativity or filler.",
      },
      {
        title: "Format patterns",
        bullets: [
          "Tables: best for comparisons and attributes.",
          "JSON: best for extraction and automation.",
          "Bullets: best for summaries and lists.",
          "Headings: best for long or multi-part answers.",
        ],
      },
      {
        title: "Make it strict",
        bullets: [
          "Name each column or JSON key.",
          "State how to handle missing data.",
          "Ask for short values so the output stays readable.",
        ],
      },
    ],
    examples: [
      {
        label: "Prompt",
        content:
          "List 3 common fruits and their colors in a Markdown table with columns Fruit and Color.",
      },
      {
        label: "Response",
        content:
          "| Fruit | Color |\n| --- | --- |\n| Apple | Red or green |\n| Banana | Yellow |\n| Grape | Purple or green |",
      },
    ],
    tip: "Format control makes feedback and version comparisons faster.",
    image: {
      src: "/step-2-feedback.png",
      alt: "Structured feedback cards showing a clear format",
      caption: "Clear formats make outputs easier to scan and compare.",
    },
  },
  {
    id: "lesson-6",
    label: "Lesson 6",
    title: "Step-by-Step and Reasoning",
    summary: (
      <>
        For complex tasks, ask the model to show steps or a brief rationale. This can
        improve accuracy and transparency. Keep steps short to avoid long, noisy
        output.
      </>
    ),
    focus: "Reasoning",
    bullets: [
      "Request steps for math, logic, or planning tasks.",
      "Ask for concise reasoning, not long essays.",
      "Use steps when the first answer seems uncertain.",
      "Set a limit on number of steps.",
      "Separate reasoning from the final answer if needed.",
      "Keep the steps focused on the task.",
    ],
    sections: [
      {
        title: "When to ask for steps",
        bullets: [
          "Calculations, multi-stage logic, or planning tasks.",
          "Audits where you must see the path to the answer.",
          "Situations where accuracy matters more than speed.",
        ],
      },
      {
        title: "Keep it clean",
        bullets: [
          "Ask for brief steps and a short final answer.",
          "Use a numbered list for clarity.",
          "If steps are too long, cap them at 3-5.",
        ],
      },
      {
        title: "Safety note",
        description:
          "Reasoning helps you evaluate correctness, but you should still verify critical facts. For high stakes tasks, ask for sources or external checks.",
      },
    ],
    examples: [
      {
        label: "Prompt",
        content: "Calculate 13 x 24 and explain each step briefly.",
      },
      {
        label: "Response",
        content: "13 x 20 = 260\n13 x 4 = 52\n260 + 52 = 312",
      },
    ],
    tip: "If the answer is short, add show steps for clarity.",
  },
  {
    id: "lesson-7",
    label: "Lesson 7",
    title: "Iteration and Refinement",
    summary: (
      <>
        Prompting is iterative. Use the first response to tighten constraints, clarify
        tone, or reduce scope. Compare versions to see exactly what improved and why.
      </>
    ),
    focus: "Iteration",
    bullets: [
      "Refine the prompt after each output.",
      "Add constraints or urgency to guide tone.",
      "Compare versions to build intuition.",
      "Adjust one variable at a time.",
      "Track which change produced the improvement.",
      "Do not chase perfection in one step.",
    ],
    sections: [
      {
        title: "A simple iteration loop",
        bullets: [
          "Run the prompt once.",
          "Note what is missing: context, format, or scope.",
          "Add one correction and rerun.",
          "Compare outputs side by side.",
        ],
      },
      {
        title: "How to refine",
        bullets: [
          "Tighten scope with fewer tasks per prompt.",
          "Add format constraints if output drifts.",
          "Add audience or tone to avoid generic responses.",
        ],
      },
      {
        title: "Use version history",
        description:
          "Save each run so you can restore, compare, and learn from the differences. The fastest learning comes from noticing what changed the output.",
      },
    ],
    examples: [
      {
        label: "Prompt (initial)",
        content: "Write a subject line for an email about a sale.",
      },
      { label: "Response (initial)", content: "Big Savings Inside!" },
      {
        label: "Prompt (refined)",
        content: "Write an urgent email subject line for a 50 percent off sale.",
      },
      {
        label: "Response (refined)",
        content: "Last chance: 50 percent off everything today only!",
      },
    ],
    tip: "Ask what the next version should include that this one missed.",
    image: {
      src: "/step-3-iterate.png",
      alt: "Prompt version history showing improvements",
      caption: "Iteration turns vague prompts into precise instructions.",
    },
  },
  {
    id: "lesson-8",
    label: "Lesson 8",
    title: "Advanced Patterns and Techniques",
    summary: (
      <>
        After the basics are steady, explore advanced patterns like interview prompts,
        role chains, or outline-first workflows. These patterns help with complex
        tasks, but they add complexity so use them carefully.
      </>
    ),
    focus: "Advanced patterns",
    bullets: [
      "Interview pattern: ask a series of related questions.",
      "Role chains: gather facts first, then rewrite for audience.",
      "Outline-first: request structure, then full answer.",
      "Tree of thought: explore multiple paths before choosing one.",
      "Split tasks across multiple prompts if needed.",
      "Use advanced patterns only when basics are not enough.",
    ],
    sections: [
      {
        title: "Interview pattern",
        description:
          "Use a sequence of short questions when the topic is complex. This keeps each response focused and reduces drift.",
      },
      {
        title: "Role chains",
        bullets: [
          "Step 1: ask for facts as an analyst.",
          "Step 2: rewrite for a beginner audience.",
          "Step 3: summarize in a strict format.",
        ],
      },
      {
        title: "Outline-first workflow",
        bullets: [
          "Request a short outline or plan.",
          "Confirm the structure is correct.",
          "Ask for the full response using that outline.",
        ],
      },
    ],
    examples: [
      {
        label: "Prompt",
        content:
          "First outline a 5-step plan to onboard a new team member. Then write the full plan in 150 words.",
      },
      {
        label: "Response",
        content:
          "Outline:\n1) Welcome and goals\n2) Tools and access\n3) Team context\n4) First task\n5) Feedback loop\n\nFull plan:\n(Condensed 150 word plan follows.)",
      },
    ],
    tip: "If the model rambles, split the task into stages.",
    image: {
      src: "/hero-illustration.png",
      alt: "Person collaborating with an AI assistant",
      caption: "Advanced patterns help structure complex work.",
    },
  },
  {
    id: "lesson-9",
    label: "Lesson 9",
    title: "Pitfalls: Hallucinations and Bias",
    summary: (
      <>
        Models can invent facts or reflect bias. Guard against this by asking for
        sources, flagging unknowns, and verifying critical details. Treat high stakes
        facts as provisional.
      </>
    ),
    focus: "Safety and accuracy",
    bullets: [
      "Ask for sources or citations when accuracy matters.",
      "Tell the model to mark unknowns explicitly.",
      "Verify facts using trusted references.",
      "Be careful with sensitive topics or biased framing.",
      "Do not assume the first answer is correct.",
      "Use neutral language to reduce bias.",
    ],
    sections: [
      {
        title: "Hallucination checks",
        bullets: [
          "Ask for sources and note if none are available.",
          "Ask for confidence or uncertainty when needed.",
          "Use follow-up prompts to verify facts.",
        ],
      },
      {
        title: "Bias checks",
        bullets: [
          "Ask for multiple perspectives when relevant.",
          "Avoid loaded language in the prompt.",
          "Clarify the audience so tone remains appropriate.",
        ],
      },
      {
        title: "When to pause",
        description:
          "If the response includes unexpected facts, pause and verify. For high impact decisions, always validate with authoritative sources.",
      },
    ],
    examples: [
      {
        label: "Prompt",
        content:
          "List the Nobel Prize winners in 2020 and provide sources. If unsure, mark the item as unknown.",
      },
      {
        label: "Response",
        content:
          "Physics: unknown (source needed)\nChemistry: unknown (source needed)\nLiterature: unknown (source needed)",
      },
    ],
    tip: "When stakes are high, confirm the answer before using it.",
  },
  {
    id: "lesson-10",
    label: "Lesson 10",
    title: "Best Practices and Next Steps",
    summary: (
      <>
        Prompting improves with repetition and small experiments. Use consistent
        terminology, test on small inputs, and keep a habit of review. Continue
        learning through examples and by reading what works.
      </>
    ),
    focus: "Habits",
    bullets: [
      "Iterate and test different wordings.",
      "Start small before scaling to complex inputs.",
      "Be explicit about ethics and safety boundaries.",
      "Reuse proven prompt patterns.",
      "Document what works for your team.",
      "Practice with real tasks, not toy examples only.",
    ],
    sections: [
      {
        title: "Daily habits",
        bullets: [
          "Keep a personal prompt library.",
          "Review output quality before reusing a prompt.",
          "Compare versions to see what improved the result.",
        ],
      },
      {
        title: "Team habits",
        bullets: [
          "Share templates and lessons learned.",
          "Standardize output formats for repeatable work.",
          "Document constraints and assumptions in prompts.",
        ],
      },
      {
        title: "Next steps",
        description:
          "Choose one prompt from your daily work and improve it using the rubric. Repeat the process for a week and track what changed. Practice is the shortest path to mastery.",
      },
    ],
    examples: [
      {
        label: "Prompt",
        content:
          "Rewrite this prompt to be clearer: Plan my weekend.",
      },
      {
        label: "Response",
        content:
          "Plan a 2-day weekend itinerary in New York City for someone who likes art museums and Italian food. Use a morning, afternoon, evening schedule.",
      },
    ],
    tip: "Make prompt reviews a habit: clarity, context, constraints, format.",
  },
];

const glossary = [
  {
    term: "Few-shot",
    definition: "Provide 1-2 examples to teach a pattern before the real task.",
  },
  {
    term: "Chain-of-thought",
    definition: "Ask for brief reasoning steps to improve transparency.",
  },
  {
    term: "Output indicator",
    definition: "A cue that signals the expected format or label.",
  },
  {
    term: "Hallucination",
    definition: "When a model invents facts or details.",
  },
];

export default function LearnPage() {
  return (
    <div className="space-y-10 pt-8 pb-16">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Learning course
        </p>
        <h1 className="text-3xl font-semibold text-ink">
          Prompt Engineering Strategies: Study Guide
        </h1>
        <p className="max-w-3xl text-sm text-muted">
          <strong className="text-ink">Prompt engineering</strong> is the practice of
          writing effective instructions for AI. It blends <em>clarity</em>,
          structure, and iteration so your intent matches the output. This course is
          beginner-first: short lessons, concrete examples, and clear next steps.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="card p-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Course format
          </p>
          <h2 className="text-xl font-semibold text-ink">10 lessons, 30-45 minutes</h2>
          <p className="text-sm text-muted">
            Each lesson focuses on one concept with a prompt and response example.
            Keep prompts short, add structure, and refine with each iteration.
          </p>
          <ul className="grid gap-2 text-sm text-muted md:grid-cols-2">
            <li className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
              One concept per lesson.
            </li>
            <li className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
              Prompt and response examples.
            </li>
            <li className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
              Clear checklists and practice tasks.
            </li>
            <li className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
              Built for beginners.
            </li>
          </ul>
        </div>
        <div className="card p-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Glossary
          </p>
          <ul className="space-y-2 text-sm text-muted">
            {glossary.map((item) => (
              <li key={item.term} className="flex gap-2">
                <span
                  className="font-semibold text-ink underline decoration-dotted"
                  title={item.definition}
                >
                  {item.term}
                </span>
                <span>{item.definition}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted">
            Hover terms for quick definitions. Keep language simple and concrete.
          </p>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-[260px_1fr]">
        <aside className="card h-fit p-4 md:sticky md:top-24">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Lessons
          </p>
          <ol className="mt-3 space-y-2 text-sm">
            {lessons.map((lesson) => (
              <li key={lesson.id}>
                <a
                  href={`#${lesson.id}`}
                  className="block rounded-xl border border-border bg-card-alt px-3 py-3 text-ink transition hover:border-brand hover:bg-white"
                >
                  <div className="text-[11px] font-semibold uppercase text-muted">
                    {lesson.label}
                  </div>
                  <div className="text-sm font-semibold">{lesson.title}</div>
                  <div className="text-xs text-muted">{lesson.focus}</div>
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-4 space-y-2 text-xs text-muted">
            <p className="font-semibold text-ink">Navigation tips</p>
            <p>Jump between lessons using the list.</p>
            <p>Each lesson ends with a practice task.</p>
            <p>Start at Lesson 1 for the best flow.</p>
          </div>
        </aside>

        <div className="space-y-8">
          {lessons.map((lesson) => (
            <LessonSection key={lesson.id} lesson={lesson} />
          ))}
        </div>
      </section>

      <section className="card p-6 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          Sources
        </p>
        <p className="text-sm text-muted">
          This course reflects guidance from widely used prompt engineering
          references. Use these sources for deeper reading and practice.
        </p>
        <ul className="grid gap-2 text-sm text-muted md:grid-cols-2">
          {[
            "OpenAI documentation on prompt design",
            "Google Cloud prompt engineering guides",
            "Learn Prompting open-source course",
            "DataCamp prompt engineering tutorials",
            "IBM Generative AI Prompt Engineering curriculum",
          ].map((source) => (
            <li key={source} className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
              <span>{source}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function LessonSection({ lesson }: { lesson: Lesson }) {
  return (
    <section id={lesson.id} className="scroll-mt-24">
      <div className="card p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-card-alt px-3 py-1 text-xs font-semibold text-ink">
            {lesson.label} - {lesson.focus}
          </span>
          <span className="text-xs text-muted">Beginner friendly</span>
        </div>

        {lesson.image && (
          <div className="overflow-hidden rounded-xl border border-border bg-card-alt">
            <div className="relative h-52 w-full overflow-hidden">
              <Image
                src={lesson.image.src}
                alt={lesson.image.alt}
                fill
                sizes="(max-width: 768px) 100vw, 900px"
                className="object-cover"
              />
            </div>
            <p className="px-4 py-2 text-xs text-muted">{lesson.image.caption}</p>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-ink">
            {lesson.label}: {lesson.title}
          </h2>
          <p className="text-sm text-muted">{lesson.summary}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card-alt p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Key ideas
            </p>
            <ul className="space-y-2 text-sm text-muted">
              {lesson.bullets.map((bullet, index) => (
                <li key={`${lesson.id}-bullet-${index}`} className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          {lesson.sections.map((section) => (
            <div
              key={`${lesson.id}-${section.title}`}
              className="rounded-xl border border-border bg-card-alt p-4 space-y-2"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {section.title}
              </p>
              {section.description && (
                <p className="text-sm text-muted">{section.description}</p>
              )}
              {section.bullets && (
                <ul className="space-y-2 text-sm text-muted">
                  {section.bullets.map((bullet, index) => (
                    <li
                      key={`${lesson.id}-${section.title}-${index}`}
                      className="flex gap-2"
                    >
                      <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {lesson.examples.map((example) => (
            <div key={`${lesson.id}-${example.label}`} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {example.label}
              </p>
              <pre className="rounded-xl border border-border bg-card-alt p-4 text-xs text-ink whitespace-pre-wrap font-mono">
                {example.content}
              </pre>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-border bg-card-alt p-4 text-sm text-ink">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Try this
          </p>
          <p className="mt-1">{lesson.tip}</p>
        </div>
      </div>
    </section>
  );
}
