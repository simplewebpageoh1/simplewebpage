// src/utils/analytics.ts
// ✅ GA4 utility
// - Loads only when VITE_GA4_ID exists
// - Skips localhost / 127.0.0.1 / *.local during development

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: any[]) => void;
  }
}

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;

function ensureScript(src: string) {
  if (document.querySelector(`script[src="${src}"]`)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function isBlockedHost(hostname: string) {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.endsWith(".local")
  );
}

export function initAnalytics() {
  if (!GA4_ID) return;
  if (typeof window === "undefined") return;
  if (isBlockedHost(window.location.hostname)) return;

  ensureScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer!.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, {
    send_page_view: false,
  });
}

export function trackPageView(pathWithSearch: string) {
  if (!GA4_ID || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: pathWithSearch,
  });
}

export function trackEvent(name: string, params?: Record<string, any>) {
  if (!GA4_ID || !window.gtag) return;
  window.gtag("event", name, params || {});
}
