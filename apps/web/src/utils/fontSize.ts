// utils/fontSize.ts
export const fluidFont = (min: string, preferred: string, max: string): React.CSSProperties => ({
  "--min": min,
  "--preferred": preferred,
  "--max": max,
} as React.CSSProperties);
