// src/data/templatePages/pages/basic.ts
// ✅ Basic(베이스) 원페이지 - 블랙&화이트 기본 스타일
// - 템플릿 목록에는 노출하지 않지만, /demo/basic 테스트용으로 사용

import type { TemplateSeoPage } from "../types";
import { COMMON_FAQ } from "../commonFaq";

export const BASIC_PAGE: TemplateSeoPage = {
  slug: "basic",
  title: "Basic One-Page Website | Style Playground",
  description:
    "A simple black & white one-page base template. Use the style toolbar to preview colors and fonts.",
  heading: "Basic One-Page (Style Playground)",
  subheading:
    "A clean one-page base layout. Pick colors and fonts at the top to preview instantly.",
  seoLines: [
    "This page is a style playground for the one-page template system.",
    "Layout and content stay the same — only colors and fonts change.",
  ],
  whoFor:
    "Anyone who wants a clean one-page layout and prefers to choose a style (colors/fonts) quickly.",
  solvesFast:
    "You can preview multiple styles without changing the layout or rewriting the page structure.",
  whyNotComplex:
    "Keeping the layout consistent makes delivery faster and reduces revisions.",
  faq: COMMON_FAQ,
  demo: {
    brand: "BASIC ONE-PAGE",
    subtitle: "Simple · Clean · Fast",
    phoneDisplay: "403-000-0000",
    phoneTel: "4030000000",
    serviceAreaLine: "Serving Calgary and nearby areas",
    services: [
      { title: "Service 1", description: "Short, clear description of what you offer." },
      { title: "Service 2", description: "Another service line — keep it simple." },
      { title: "Service 3", description: "Customers scan, so clarity matters." },
      { title: "Service 4", description: "One-page works great for local services." },
      { title: "Service 5", description: "Fast contact and quick decisions." },
    ],
  },
};
