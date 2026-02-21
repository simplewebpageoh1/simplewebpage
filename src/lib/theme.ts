// src/lib/theme.ts
// ✅ Single source of truth for theme labels (A/B/C)
// Keep wording consistent across Templates / Demo / Contact / Intake.

export type ThemeId = "A" | "B" | "C";

export const THEME_LABELS: Record<ThemeId, string> = {
  A: "Theme A (Black&White)",
  B: "Theme B (Dark Mode)",
  C: "Theme C (Soft Pastel)",
};

export function normalizeTheme(v: string | null | undefined): ThemeId {
  const t = (v ?? "A").toUpperCase();
  if (t === "B" || t === "C") return t;
  return "A";
}

export function themeLabel(v: string | null | undefined): string {
  const t = normalizeTheme(v);
  return THEME_LABELS[t];
}
