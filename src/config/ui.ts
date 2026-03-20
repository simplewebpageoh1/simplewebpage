export type HeaderPrimaryCta = "checkout" | "contact";

/**
 * Header CTA mode (mobile + desktop).
 *
 * - checkout: Prefer showing a primary "Checkout" button when a selection exists.
 * - contact: Prefer showing a primary "Contact" button.
 *
 * Configure via env (Netlify/local):
 *   VITE_HEADER_PRIMARY_CTA=checkout
 *   VITE_HEADER_PRIMARY_CTA=contact
 */
export const HEADER_PRIMARY_CTA: HeaderPrimaryCta = (() => {
  const raw = (
    import.meta.env.VITE_HEADER_PRIMARY_CTA as string | undefined
  )?.toLowerCase();

  return raw === "contact" ? "contact" : "checkout";
})();
