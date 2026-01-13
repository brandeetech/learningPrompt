# Design System

Centralized design tokens for AskRight. All colors, typography, spacing, and design decisions are defined here.

## Usage

### Import Design Tokens

```typescript
import { colors, typography, spacing, shadows } from "@/lib/design";

// Use colors
const primaryColor = colors.brand.primary; // "#1E3A8A"

// Use typography
const fontSize = typography.fontSize.lg; // "1.125rem"

// Use spacing
const padding = spacing.lg; // "1.5rem"
```

### In CSS/Tailwind

The design tokens are automatically available as CSS variables and Tailwind classes:

```tsx
// Using Tailwind classes
<div className="bg-brand text-white p-lg rounded-xl shadow-card">
  Content
</div>

// Using CSS variables
<div style={{ backgroundColor: "var(--brand)", padding: "var(--spacing-lg)" }}>
  Content
</div>
```

## Design Tokens

### Colors

- **Brand**: Primary (#1E3A8A), Secondary (#22C55E), Accent (#F59E0B)
- **Text**: Ink (#0F172A), Muted (#475569)
- **Background**: Base (#F9FAFB), Card (#FFFFFF), Card Alt (#F3F6FB)
- **Semantic**: Success, Warning, Error, Info
- **Evaluation**: Strong (≥80), Good (60-79), Weak (<60)

### Typography

- **Fonts**: Inter (UI), JetBrains Mono (code/prompts)
- **Sizes**: xs (12px) to 4xl (36px)
- **Weights**: Normal (400), Medium (500), Semibold (600), Bold (700)

### Spacing

- **Scale**: xs (4px) to 3xl (64px)
- **Common**: sm (8px), md (16px), lg (24px), xl (32px)

### Border Radius

- **Scale**: sm (4px) to 2xl (24px)
- **Special**: full (9999px) for pills/buttons

### Shadows

- **Levels**: sm, md, lg, xl
- **Special**: card (default card shadow)

## Design Principles

1. **Visual Direction**: Clean, minimal, educational
2. **UI Principles**: One primary action per screen, always show context
3. **Feedback Order**: What happened → Why → How to improve → Optional rewrite
4. **Motion**: Minimal and purposeful

## File Structure

```
src/lib/design/
├── theme.ts      # All design tokens
├── index.ts      # Exports
└── README.md     # This file
```

## Updating the Design System

All design changes should be made in `theme.ts`. The CSS variables in `globals.css` should reference these values to maintain consistency.
