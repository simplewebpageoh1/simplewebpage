// src/utils/analytics.ts
// ✅ (선택) Analytics 유틸
// - GA4(gTag) 방식으로 "방문→템플릿→구매 클릭" 같은 흐름을 측정하기 위함
// - .env에 VITE_GA4_ID가 없으면 아무 것도 실행하지 않습니다.

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

export function initAnalytics() {
  // ✅ ID가 없으면 비활성
  if (!GA4_ID) return;
  if (typeof window === "undefined") return;

  // ✅ gtag 스크립트 로드
  ensureScript(`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`);

  // ✅ dataLayer/gtag 초기화
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer!.push(args);
  };

  // ✅ 기본 설정(자동 page_view는 SPA에서 중복될 수 있어 false)
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID, {
    send_page_view: false,
  });
}

export function trackPageView(pathname: string) {
  if (!GA4_ID || !window.gtag) return;
  window.gtag("event", "page_view", {
    page_path: pathname,
  });
}

export function trackEvent(name: string, params?: Record<string, any>) {
  if (!GA4_ID || !window.gtag) return;
  window.gtag("event", name, params || {});
}
