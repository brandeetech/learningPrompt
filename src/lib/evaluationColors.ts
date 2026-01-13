// Color utilities for evaluation scores

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-secondary'; // Green for good scores
  if (score >= 60) return 'text-accent'; // Amber for medium scores
  return 'text-red-600'; // Red for low scores
}

export function getScoreBgColor(score: number): string {
  if (score >= 80) return 'bg-secondary/10 border-secondary/30';
  if (score >= 60) return 'bg-accent/10 border-accent/30';
  return 'bg-red-50 border-red-200';
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Strong';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Weak';
}
