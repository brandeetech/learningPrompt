/**
 * AskRight Design System
 * 
 * Centralized design tokens for colors, typography, spacing, shadows, and more.
 * All design decisions should reference this file.
 */

// ============================================================================
// Colors
// ============================================================================

export const colors = {
  // Primary Brand Colors
  brand: {
    primary: "#1E3A8A",      // Deep Blue - trust, intelligence
    primaryStrong: "#162B69", // Darker blue for hover states
    secondary: "#22C55E",     // Soft Green - learning, growth
    accent: "#F59E0B",        // Amber - highlights, CTAs
  },

  // Text Colors
  text: {
    ink: "#0F172A",           // Primary text (slate)
    muted: "#475569",         // Secondary text (slate-600)
    disabled: "#94A3B8",      // Disabled text (slate-400)
  },

  // Background Colors
  background: {
    base: "#F9FAFB",          // Main background (slate-50)
    card: "#FFFFFF",          // Card background (white)
    cardAlt: "#F3F6FB",       // Alternate card background
    hover: "#F1F5F9",         // Hover state background
  },

  // Border Colors
  border: {
    default: "#E2E8F0",        // Default border (slate-200)
    strong: "#CBD5E1",        // Strong border (slate-300)
    muted: "#F1F5F9",         // Muted border (slate-100)
  },

  // Semantic Colors
  semantic: {
    success: "#22C55E",       // Green
    warning: "#F59E0B",      // Amber
    error: "#EF4444",         // Red
    info: "#3B82F6",         // Blue
  },

  // Evaluation Score Colors
  evaluation: {
    strong: "#22C55E",        // Green (≥80)
    good: "#F59E0B",          // Amber (60-79)
    weak: "#EF4444",          // Red (<60)
  },

  // Selection
  selection: {
    background: "#E0E7FF",     // Light indigo
    text: "#0F172A",          // Ink color
  },
} as const;

// ============================================================================
// Typography
// ============================================================================

export const typography = {
  // Font Families
  fonts: {
    sans: "Inter, system-ui, -apple-system, sans-serif",
    mono: "JetBrains Mono, 'Courier New', monospace",
  },

  // Font Sizes
  fontSize: {
    xs: "0.75rem",      // 12px
    sm: "0.875rem",     // 14px
    base: "1rem",      // 16px
    lg: "1.125rem",     // 18px
    xl: "1.25rem",      // 20px
    "2xl": "1.5rem",    // 24px
    "3xl": "1.875rem",  // 30px
    "4xl": "2.25rem",   // 36px
  },

  // Font Weights
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Letter Spacing
  letterSpacing: {
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em",
    wider: "0.05em",
    widest: "0.1em",
  },
} as const;

// ============================================================================
// Spacing
// ============================================================================

export const spacing = {
  xs: "0.25rem",   // 4px
  sm: "0.5rem",    // 8px
  md: "1rem",      // 16px
  lg: "1.5rem",    // 24px
  xl: "2rem",      // 32px
  "2xl": "3rem",   // 48px
  "3xl": "4rem",   // 64px
} as const;

// ============================================================================
// Border Radius
// ============================================================================

export const borderRadius = {
  none: "0",
  sm: "0.25rem",   // 4px
  md: "0.5rem",    // 8px
  lg: "0.75rem",   // 12px
  xl: "1rem",      // 16px
  "2xl": "1.5rem", // 24px
  full: "9999px",  // Fully rounded
} as const;

// ============================================================================
// Shadows
// ============================================================================

export const shadows = {
  sm: "0 1px 2px 0 rgba(15, 23, 42, 0.05)",
  md: "0 4px 6px -1px rgba(15, 23, 42, 0.1), 0 2px 4px -1px rgba(15, 23, 42, 0.06)",
  lg: "0 10px 15px -3px rgba(15, 23, 42, 0.1), 0 4px 6px -2px rgba(15, 23, 42, 0.05)",
  xl: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)",
  card: "0 20px 80px rgba(15, 23, 42, 0.08)",
  inner: "inset 0 2px 4px 0 rgba(15, 23, 42, 0.06)",
} as const;

// ============================================================================
// Layout
// ============================================================================

export const layout = {
  container: {
    maxWidth: "1100px",
    padding: "0 1.5rem",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const;

// ============================================================================
// Transitions
// ============================================================================

export const transitions = {
  fast: "150ms ease-in-out",
  normal: "200ms ease-in-out",
  slow: "300ms ease-in-out",
} as const;

// ============================================================================
// Z-Index
// ============================================================================

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;

// ============================================================================
// CSS Variables Export (for use in globals.css)
// ============================================================================

export const cssVariables = {
  // Colors
  "--bg": colors.background.base,
  "--fg": colors.text.ink,
  "--fg-muted": colors.text.muted,
  "--brand": colors.brand.primary,
  "--brand-strong": colors.brand.primaryStrong,
  "--brand-secondary": colors.brand.secondary,
  "--brand-accent": colors.brand.accent,
  "--card": colors.background.card,
  "--card-alt": colors.background.cardAlt,
  "--border": colors.border.default,
  "--shadow": shadows.card,

  // Fonts
  "--font-inter": typography.fonts.sans,
  "--font-jetbrains": typography.fonts.mono,
} as const;

// ============================================================================
// Tailwind Class Mappings
// ============================================================================

export const tailwindClasses = {
  // Background colors
  "bg-background": colors.background.base,
  "bg-card": colors.background.card,
  "bg-card-alt": colors.background.cardAlt,
  "bg-brand": colors.brand.primary,
  "bg-brand-strong": colors.brand.primaryStrong,
  "bg-secondary": colors.brand.secondary,
  "bg-accent": colors.brand.accent,

  // Text colors
  "text-ink": colors.text.ink,
  "text-muted": colors.text.muted,

  // Border colors
  "border-border": colors.border.default,
} as const;

// ============================================================================
// Design Principles
// ============================================================================

export const designPrinciples = {
  // Visual Direction
  visualDirection: "Clean, minimal, educational. No gradients, no flashy effects. White space as a feature.",

  // UI Principles
  uiPrinciples: [
    "One primary action per screen",
    "Always show context",
    "Never hide model choice",
    "Feedback is explicit and explainable",
  ],

  // Feedback Order (Non-negotiable)
  feedbackOrder: [
    "1. What the prompt did",
    "2. Why that output happened",
    "3. What could improve",
    "4. Optional rewritten version",
  ],

  // Motion
  motion: "Minimal and purposeful. Support learning (e.g., staged reveal of feedback rather than flashy transitions).",
} as const;

// ============================================================================
// Type Exports
// ============================================================================

export type ColorName = keyof typeof colors;
export type FontSize = keyof typeof typography.fontSize;
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
