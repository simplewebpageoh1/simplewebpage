// src/components/scroll/ScrollManager.tsx
// ✅ 라우트 이동 시 스크롤 동작 + SPA page_view 추적

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../../utils/analytics";

const KEY = "templatesScrollY";

export default function ScrollManager() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    trackPageView(`${pathname}${search}`);

    if (pathname === "/templates") {
      const raw = sessionStorage.getItem(KEY);
      const y = raw ? Number(raw) : 0;
      requestAnimationFrame(() => {
        window.scrollTo({ top: Number.isFinite(y) ? y : 0, left: 0, behavior: "auto" });
      });
      return;
    }

    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    });
  }, [pathname, search]);

  return null;
}
