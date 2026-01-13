Thanks! I'll now prepare a complete MVP plan for the "Askright" personal/educational prompt engineering app.

This will include brand and design specs, database architecture (Supabase), full feature breakdown (playground, prompt evaluations, version control, learning section, etc.), token/quota handling, and a landing page with a no-login magnet.

I'll assume it's built using Next.js (deployed on Vercel) and uses AI SDKs for LLMs like GPT, Claude, and Gemini. I'll get back to you shortly with the detailed implementation plan.


```markdown
# AskRight — Personal / Educational Prompt Engineering App (MVP Plan)

## 1. Product Definition

**AskRight** is a personal, educational platform that teaches professionals *how to ask better questions* to Large Language Models.

The product is **not** a prompt marketplace, nor a prompt observability tool.  
It is a **learning-by-doing environment** focused on:
- Understanding *what to ask*
- Learning *how to ask it clearly*
- Iterating prompts with feedback
- Building prompt intuition and structure

---

## 2. Product Positioning

### Target User
- Professionals, builders, analysts, marketers, consultants
- People using LLMs daily but **unsure why results vary**
- Users who want *clarity*, not hacks or "vibe prompting"

### What AskRight Is
- A **practice gym** for prompt engineering
- A **guided playground** with explanations
- A **private learning space**

### What AskRight Is Not
- Not a shared prompt hub
- Not enterprise observability
- Not agent orchestration

---

## 3. Brand Heart

### Vision
Help people think more clearly when working with AI.

### Mission
Teach users how to ask the right questions by combining practice, feedback, and structure.

### Values
- **Clarity over cleverness**
- **Learning over shortcuts**
- **Structure over vibes**
- **Ownership over dependency**

### Brand Personality
- Calm
- Thoughtful
- Precise
- Encouraging
- Slightly opinionated (anti-hype)

---

## 4. Brand & Design System

### Visual Direction
- Clean, minimal, educational
- No gradients, no flashy effects
- White space as a feature

### Color Palette
- **Primary:** Deep Blue (`#1E3A8A`) — trust, intelligence
- **Secondary:** Soft Green (`#22C55E`) — learning, growth
- **Accent:** Amber (`#F59E0B`) — highlights, CTA
- **Background:** Off-white (`#F9FAFB`)
- **Text:** Slate (`#0F172A`)

### Typography
- **Primary:** Inter
- **Code / Prompt Text:** JetBrains Mono
- Large line-height, readable defaults

### UI Principles
- One primary action per screen
- Always show context
- Never hide model choice
- Feedback is explicit and explainable

---

## 5. Core MVP Features

### 5.1 Prompt Playground
- Prompt input area
- Model selector: GPT / Claude / Gemini
- Run prompt and stream output
- Token usage displayed per run
- Save prompt (creates version 1)

### 5.2 Prompt Evaluation (LLM-based)
After each run:
- LLM evaluates the prompt itself
- Feedback includes:
  - What worked
  - What was unclear
  - What could be improved
- Optional rewritten version shown side-by-side

### 5.3 Improvement Suggestions
Static + LLM-generated:
- Clarity suggestions
- Missing constraints
- Better output formatting
- Scope reduction

### 5.4 Prompt Patterns & Templates
Curated templates:
- Writing
- Analysis
- Summarization
- Ideation
- Coding (basic)

Each template includes:
- Intent
- Example
- Why it works

### 5.5 Learning Section
Static content:
- Prompt fundamentals
- Common mistakes
- Pattern explanations
- External links
- Embedded videos (future)

### 5.6 Version Control (Basic)
- Each edit creates a new version
- View previous versions
- Restore older version
- No branching (MVP)

### 5.7 Token-Based Usage
- Free users start with limited tokens
- Tokens deducted per model usage
- Clear quota indicator
- Lock playground when exhausted

Upgrade options:
- Pro plan
- Or add own API key

---

## 6. Landing Page (Pre-Login Magnet)

### Goal
Show value in <30 seconds.

### Components
- Hero: "Learn how to ask AI the right way"
- Demo prompt box (no login)
- Pre-filled example prompt
- One-click "Try it"
- Limited output shown
- CTA: "Create free account to keep learning"

---

## 7. User Roles

### Free
- Limited tokens
- Access to playground
- Access to learning content
- No custom API keys

### Pro
- Higher / unlimited tokens
- Add own API keys
- Priority models
- Extended history

### Admin
- Manage templates
- Manage learning content
- View usage stats
- User management

---

## 8. Technical Architecture

### Frontend
- Next.js (App Router)
- Hosted on Vercel
- Tailwind CSS
- Server Actions where possible

### Backend
- Supabase
  - Auth
  - Postgres DB
  - Row Level Security

### AI Communication
- Vercel AI SDK
- Providers:
  - OpenAI (GPT)
  - Anthropic (Claude)
  - Google (Gemini)

---

## 9. Database Schema (Supabase)

### users
```

id (uuid, pk)
email
role (free | pro | admin)
tokens_remaining
created_at

```

### prompts
```

id (uuid, pk)
user_id (fk)
title
created_at

```

### prompt_versions
```

id (uuid, pk)
prompt_id (fk)
version_number
content
created_at

```

### templates
```

id (uuid, pk)
title
category
content
created_at

```

### usage_logs
```

id (uuid, pk)
user_id (fk)
model
tokens_used
created_at

```

### provider_keys
```

id (uuid, pk)
user_id (fk)
provider (openai | anthropic | google)
api_key_encrypted
created_at

```

---

## 10. Token & Model Logic

1. User selects model
2. System checks:
   - Has remaining tokens?
   - Has own API key?
3. Route request:
   - Own key → direct provider
   - Otherwise → platform key
4. Run model via AI SDK
5. Capture token usage
6. Deduct tokens
7. Log usage

---

## 11. Payment & Upgrade Flow

- Stripe Checkout
- Monthly Pro plan
- Webhook updates user role
- Token quota refreshed
- API key input unlocked

---

## 12. Implementation Roadmap

### Phase 1 — Foundation
- Next.js app
- Supabase auth + DB
- Playground MVP
- Single model (GPT)

### Phase 2 — Learning Layer
- Templates
- Prompt evaluation
- Suggestions engine
- Versioning

### Phase 3 — Monetization
- Token system
- Stripe integration
- Pro tier
- API key support

### Phase 4 — Polish
- Landing demo
- UX improvements
- Admin tools

---

## 13. Success Criteria (MVP)

- User understands *why* a prompt works
- User iterates prompts multiple times
- User runs out of tokens → upgrade intent
- Prompt quality visibly improves

---

## Final Note

AskRight is not about prompts.

It's about **thinking clearly with AI**.

The MVP must feel:
- Safe
- Educational
- Intentional
- Calm

If users leave saying *"I finally get why my prompts sucked"* — the product works.
```

```markdown
# AskRight — Next Steps & Strategic Notes

This document complements the MVP plan.  
It focuses on **what to do next**, **what to defer**, and **important decisions that will matter later** but should not block the MVP.

---

## 1. Immediate Next Steps (Next 2–4 Weeks)

### 1.1 Lock the Product Scope (Critical)
Before any build starts:
- Freeze **MVP features** exactly as defined
- Explicitly exclude:
  - Community features
  - Prompt sharing
  - Advanced analytics
  - Enterprise governance
- Document *non-goals* so scope creep is avoided

> Rule: If a feature doesn't directly help a user learn how to ask better questions, it's out.

---

### 1.2 Define the "Prompt Evaluation Rubric"
This is foundational.

Create a simple internal rubric that the LLM will use when evaluating prompts:
- Clarity of intent
- Context completeness
- Constraints defined
- Output format specified
- Scope control

This rubric should be:
- Human-readable
- Stored as static config
- Reused consistently across evaluations

Do **not** over-optimize this early.

---

### 1.3 Decide the Default Model Strategy
For MVP:
- Pick **one default model** (likely GPT)
- Expose others as optional
- Keep suggestions model-agnostic

Avoid:
- Model-specific prompting tricks
- Provider-specific language

You are teaching thinking, not APIs.

---

## 2. Product Decisions to Make Early (But Implement Later)

### 2.1 Prompt Scoring (Future)
Do **not** score prompts numerically in MVP.

Why:
- Scores feel authoritative but are fragile
- Early users need explanations, not grades

Future option:
- Soft labels (e.g. "Clear", "Unclear", "Overloaded")

---

### 2.2 Prompt Privacy & Trust
Even in a personal app:
- Be explicit: prompts are private
- No training on user prompts
- No sharing by default

This messaging builds early trust and sets up enterprise expansion.

---

### 2.3 Naming Evolution
Assume:
- AskRight = product name
- Company name may change later

Do not lock:
- Legal structure
- Brand architecture
- Parent brand yet

Let usage inform this.

---

## 3. UX Principles to Enforce (Non-Negotiable)

### 3.1 Always Show the Prompt
Never hide:
- The actual text sent to the model
- The model used
- Any system instructions

Transparency is part of the learning.

---

### 3.2 Explain Before Suggesting
Feedback order must be:
1. What the prompt did
2. Why the output happened
3. What could improve
4. Optional rewritten version

Never start with a rewrite.

---

### 3.3 Reduce Cognitive Load
Avoid:
- Too many toggles
- Advanced settings
- Power-user shortcuts

AskRight should feel calm and focused.

---

## 4. Content Strategy (Parallel Track)

Start preparing content **while building**:
- 10 core prompt patterns
- 10 common mistakes
- 5 "before vs after" examples
- 3 long-form essays:
  - Why prompts fail
  - Why structure matters
  - Why asking is a skill

This content becomes:
- Learning section
- Marketing material
- Enterprise credibility later

---

## 5. Metrics That Actually Matter (Early)

Ignore vanity metrics.

Track:
- Prompt iterations per user
- % of users who revise prompts
- Time between first and second prompt
- Token exhaustion rate
- Upgrade conversion after exhaustion

If users *iterate*, the product works.

---

## 6. Risks to Watch For

### 6.1 Becoming a "Rewrite Tool"
If users:
- Paste prompt
- Copy improved prompt
- Leave

You failed.

Counter:
- Force explanation visibility
- Encourage iteration
- Hide "copy" behind reflection

---

### 6.2 Over-Automation
Avoid:
- Auto-fixing prompts
- "One-click perfect prompt"

The product must teach friction.

---

## 7. What to Explicitly Defer (Do Not Build Yet)

- Multi-user collaboration
- Prompt marketplaces
- Agent builders
- Observability dashboards
- Security red-teaming
- Enterprise RBAC
- Prompt injection simulation

These belong to **Phase 2+**.

---

## 8. Path to Enterprise (High-Level)

The MVP should quietly prepare for:
- Prompt ownership
- Prompt auditability
- Prompt governance
- Prompt security

But **do not expose this yet**.

Learn first.
Control later.

---

## 9. One-Line Product Test

Ask this every week:

> "Does this help someone understand why their prompt worked or failed?"

If the answer is unclear, pause.

---

## Final Thought

AskRight should feel like:
- A notebook
- A teacher
- A mirror

Not:
- A toolbelt
- A dashboard
- A magic button

If users leave *thinking better*, the product is doing its job.
```
