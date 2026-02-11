// src/components/scroll/ScrollManager.tsx
// ✅ 라우트 이동 시 스크롤 동작을 제어
// - 템플릿 목록(/templates): 이전 스크롤 위치 복원
// - 그 외 페이지: 항상 최상단으로 이동

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../../utils/analytics";

const KEY = "templatesScrollY";

export default function ScrollManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    // ✅ (선택) SPA 페이지뷰 추적(GA4)
    trackPageView(pathname);

    // ✅ 템플릿 목록 페이지는 복원
    if (pathname === "/templates") {
      const raw = sessionStorage.getItem(KEY);
      const y = raw ? Number(raw) : 0;

      // 렌더 후 스크롤 복원
      requestAnimationFrame(() => {
        window.scrollTo({ top: Number.isFinite(y) ? y : 0, left: 0, behavior: "auto" });
      });
      return;
    }

    // ✅ 템플릿(프리뷰) 포함: 진입 시 항상 최상단
    if (pathname.startsWith("/templates/")) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      });
      return;
    }

    // ✅ 일반 페이지도 최상단
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [pathname]);

  return null;
}
