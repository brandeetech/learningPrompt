-- Migration: Insert default templates
-- This migration inserts all default prompt templates into the templates table

-- Insert templates (using fixed UUIDs for consistency)
INSERT INTO templates (id, title, category, intent, content, why_it_works) VALUES
-- Summary templates
('550e8400-e29b-41d4-a716-446655440001', 'Tidy Summary', 'summary', 
 'Summarize with structure and transparency on unknowns.',
 'Summarize the following text for a business audience in 4 bullets + 1 risk. Include dates/regions if present; if unknown, say ''unknown''. Keep sentences under 18 words.

Text:
{{insert text}}',
 'Specifies audience, length, format, and how to handle unknowns—reduces drift and verbosity.'),

('550e8400-e29b-41d4-a716-446655440002', 'Executive Brief', 'summary',
 'Create a concise executive summary with key metrics.',
 'Create an executive summary of the following report for C-level executives. Include: 1) Main finding (one sentence), 2) Three key metrics with context, 3) One critical risk or opportunity, 4) Recommended action. Keep total length under 150 words.

Report:
{{insert report}}',
 'Structures output for decision-makers with clear metrics and actions, preventing information overload.'),

-- Analysis templates
('550e8400-e29b-41d4-a716-446655440003', 'Explain a Decision', 'analysis',
 'Analyze a decision with context and counterpoints.',
 'You are an analyst. Explain the decision on {{topic}} for {{audience}}. Provide: 1) 3 key factors, 2) trade-offs, 3) 1 counterpoint, 4) what data is missing. Use bullets.',
 'Breaks analysis into repeatable sections and asks for missing data, improving clarity and trust.'),

('550e8400-e29b-41d4-a716-446655440004', 'Root Cause Analysis', 'analysis',
 'Identify root causes with evidence and recommendations.',
 'Analyze the following problem and identify root causes. For each cause: 1) State the cause, 2) Provide evidence from the text, 3) Rate confidence (high/medium/low), 4) Suggest one preventive measure. If evidence is insufficient, state what data is needed.

Problem:
{{insert problem description}}',
 'Forces evidence-based analysis and surfaces data gaps, reducing speculation.'),

-- Compare templates
('550e8400-e29b-41d4-a716-446655440005', 'Compare Options', 'compare',
 'Compare two options with constraints.',
 'Compare {{option A}} vs {{option B}} for {{audience}}. Create a 4-row table: criteria, why it matters, option A note, option B note. End with a short recommendation and 1 risk.',
 'Forces a shared schema and keeps outputs scoped; makes trade-offs explicit instead of generic pros/cons.'),

('550e8400-e29b-41d4-a716-446655440006', 'Feature Comparison', 'compare',
 'Compare features across multiple options systematically.',
 'Compare {{option A}}, {{option B}}, and {{option C}} for {{use case}}. Create a comparison table with columns: Feature, Option A, Option B, Option C, Winner. Include only features relevant to {{use case}}. End with a recommendation based on {{priority}} (cost/performance/ease-of-use).

Use case: {{insert use case}}
Priority: {{insert priority}}',
 'Structures comparison with clear criteria and forces prioritization, making decisions easier.'),

-- Extract templates
('550e8400-e29b-41d4-a716-446655440007', 'Structured Extraction', 'extract',
 'Extract structured data safely.',
 'Extract the required fields from the text. Respond in JSON only with keys: title, date, audience, actions[]. If a field is missing, set its value to null and note it in unknowns[].

Text:
{{insert text}}',
 'Defines schema, handling of unknowns, and discourages hallucination with explicit nulls.'),

('550e8400-e29b-41d4-a716-446655440008', 'Contact Information Extraction', 'extract',
 'Extract contact details with validation flags.',
 'Extract contact information from the following text. Return JSON with structure: {name: string | null, email: string | null, phone: string | null, company: string | null, validation: {emailValid: boolean, phoneValid: boolean}}. If any field is missing or unclear, set to null. Mark validation flags as false if format is suspicious.

Text:
{{insert text}}',
 'Provides structured extraction with validation, reducing errors in data processing.'),

-- Critique templates
('550e8400-e29b-41d4-a716-446655440009', 'Critique and Improve', 'critique',
 'Critique content and propose concise fixes.',
 'Critique the following draft for clarity, completeness, and tone for {{audience}}. Return: 1) 3 issues, 2) 3 fixes, 3) a concise example rewrite (<=120 words). If context is missing, list the missing items first.

Draft:
{{insert draft}}',
 'Separates critique from rewrite and caps length; keeps focus on the audience and missing context.'),

('550e8400-e29b-41d4-a716-446655440010', 'Code Review', 'critique',
 'Review code with specific feedback and examples.',
 'Review the following code for {{language}} best practices. Provide: 1) Three specific issues with line references, 2) Why each issue matters, 3) Example fix for the most critical issue (5-10 lines). Focus on readability, maintainability, and potential bugs.

Code:
{{insert code}}',
 'Structures code review with actionable feedback and examples, making improvements clear.'),

-- Writing templates
('550e8400-e29b-41d4-a716-446655440011', 'Structured Writing Plan', 'writing',
 'Create a plan before writing.',
 'Before writing, create a plan for {{piece type}} for {{audience}}. Provide: 1) goal, 2) reader questions, 3) outline with bullet points, 4) voice/tone guide, 5) sources to verify. Keep it under 160 words.',
 'Front-loads structure and verification before drafting, reducing rewrites and hallucination.'),

('550e8400-e29b-41d4-a716-446655440012', 'Email Draft', 'writing',
 'Write a professional email with clear structure.',
 'Draft a {{tone}} email to {{recipient}} about {{topic}}. Include: 1) Clear subject line, 2) Opening context (1-2 sentences), 3) Main message (2-3 bullets), 4) Call to action, 5) Professional closing. Keep total length under 150 words.

Tone: {{insert tone (formal/casual/urgent)}}
Recipient: {{insert recipient}}
Topic: {{insert topic}}',
 'Structures email communication with clear sections, improving clarity and response rates.'),

('550e8400-e29b-41d4-a716-446655440013', 'Blog Post Outline', 'writing',
 'Create a structured blog post outline.',
 'Create an outline for a blog post titled "{{title}}" for {{audience}}. Include: 1) Hook (first paragraph idea), 2) Three main sections with 2-3 sub-points each, 3) Conclusion idea, 4) Call-to-action. Keep outline concise (under 200 words).

Title: {{insert title}}
Audience: {{insert audience}}',
 'Structures blog content before writing, ensuring logical flow and completeness.'),

('550e8400-e29b-41d4-a716-446655440014', 'Technical Documentation', 'writing',
 'Write clear technical documentation.',
 'Write technical documentation for {{feature}} for {{audience}} (beginner/intermediate/advanced). Include: 1) Overview (what it does), 2) Prerequisites, 3) Step-by-step instructions, 4) Common issues and solutions, 5) Examples. Use clear headings and code blocks where needed.

Feature: {{insert feature}}
Audience: {{insert audience}}',
 'Structures technical docs with clear sections, improving usability and reducing support questions.')

ON CONFLICT (id) DO NOTHING;
