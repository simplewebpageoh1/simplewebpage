export type SiteMode = 'demo' | 'client';

/**
 * Site mode switch.
 *
 * - demo: shows "Preview content (sample)" label and includes preview-only sections.
 * - client: hides preview-only sections (e.g., Why One-Page?) so the delivered customer site
 *   doesn't look like a template/sales page.
 *
 * Set via env (Netlify/CI/local):
 *   VITE_SITE_MODE=demo   (default)
 *   VITE_SITE_MODE=client (customer delivery)
 */
export const SITE_MODE: SiteMode = (() => {
  const raw = (import.meta.env.VITE_SITE_MODE as string | undefined)?.toLowerCase();
  return raw === 'client' ? 'client' : 'demo';
})();
