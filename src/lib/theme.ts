// src/lib/theme.ts
// ✅ Single source of truth for template/theme labels and routes.

export type ThemeId = "A" | "B" | "C";
export type TemplateId = "electrician" | "plumbing";

export const THEME_LABELS: Record<ThemeId, string> = {
  A: "Black & White",
  B: "Dark Premium",
  C: "Soft Clean",
};

export const THEME_SHORT_BADGES: Record<ThemeId, string> = {
  A: "Theme A",
  B: "Theme B",
  C: "Theme C",
};

export const TEMPLATE_LABELS: Record<TemplateId, string> = {
  electrician: "Electrician",
  plumbing: "Plumbing",
};

export function normalizeTheme(v: string | null | undefined): ThemeId {
  const t = (v ?? "A").toUpperCase();
  if (t === "B" || t === "C") return t;
  return "A";
}

export function themeLabel(v: string | null | undefined): string {
  return THEME_LABELS[normalizeTheme(v)];
}

export function themeBadge(v: string | null | undefined): string {
  return THEME_SHORT_BADGES[normalizeTheme(v)];
}

export function fullThemeLabel(v: string | null | undefined): string {
  const t = normalizeTheme(v);
  return `${themeBadge(t)} — ${themeLabel(t)}`;
}

export function templateLabel(v: string | null | undefined): string {
  const t = (v ?? "").toLowerCase() as TemplateId;
  return TEMPLATE_LABELS[t] ?? (v ? v.charAt(0).toUpperCase() + v.slice(1).replace(/[-_]/g, " ") : "Template");
}

export function getDemoPath(template: string | null | undefined, theme: string | null | undefined = "A"): string {
  const slug = (template ?? "").toLowerCase();
  const variant = normalizeTheme(theme).toLowerCase();

  if (slug === "electrician") return `/demo/electrician/${variant}`;
  if (slug === "plumbing") return `/demo/plumbing/${variant}`;
  return slug ? `/demo/${slug}` : "/templates";
}
