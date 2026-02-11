// src/data/templatePages/commonFaq.ts
// ✅ 템플릿 상세 페이지에서 공통으로 재사용하는 FAQ (분쟁/오해 최소화)
// 필요하면 업종별 파일에서 추가 FAQ를 더 붙여서 사용하세요.

import type { FaqItem } from "./types";

export const COMMON_FAQ: FaqItem[] = [
  {
    q: "How fast will my preview be ready?",
    a: "After you complete the setup form, your preview is usually ready within 48 hours.",
  },
  {
    q: "Do you connect my domain for me?",
    a: "The $99 template includes a domain & hosting guide PDF. Domain connection is available as an optional add-on.",
  },
  {
    q: "What’s included in the $99 price?",
    a: "A simple one-page layout, mobile-friendly design, and basic SEO title & description. Custom copywriting and additional revisions are optional add-ons.",
  },
];
