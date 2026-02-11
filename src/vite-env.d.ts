/// <reference types="vite/client" />

// ✅ Vite 환경변수 타입 보강(선택)
interface ImportMetaEnv {
  // Optional: Stripe payment links
  readonly VITE_STRIPE_PAYMENT_LINK_BASIC?: string;
  readonly VITE_STRIPE_PAYMENT_LINK_PLUS?: string;
  // Backwards compatibility
  readonly VITE_STRIPE_PAYMENT_LINK?: string;
  readonly VITE_GA4_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
