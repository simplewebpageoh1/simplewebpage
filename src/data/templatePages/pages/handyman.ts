// src/data/templatePages/pages/handyman.ts
// ✅ handyman 템플릿 데이터 (SEO + Demo)
// - 새 업종 추가 시 이 파일을 복사해서 수정하면 됨

import type { TemplateSeoPage } from "../types";
import { COMMON_FAQ } from "../commonFaq";

export const HANDYMAN_PAGE: TemplateSeoPage = {
    slug: "handyman",
    title: "Handyman Website Template | Simple One Page Site",
    description:
      "Simple handyman website template for small businesses in Canada. Fast setup, no monthly fees.",
    heading: "Handyman Website Template (One Page)",
    subheading:
      "A clean one-page layout built for local handyman businesses in Canada — fast to launch and easy to maintain.",
    seoLines: [
      "This template is designed for small handyman businesses in Canada who want a professional one-page website.",
      "If you don’t want a monthly website builder fee, this is a simple alternative you can own.",
      "It helps you show services, service area, and contact details in one scroll — perfect for mobile customers.",
      "Most customers just want to know what you do, where you work, and how to reach you quickly.",
      "A simple one-page site can convert better than a complex multi-page website for local service businesses.",
      "Fast loading, clean sections, and clear call-to-action — built for quick decisions.",
    ],
    whoFor:
      "Ideal for solo handyman operators and small crews who need a simple, trustworthy website without hiring an agency.",
    solvesFast:
      "You can launch quickly with a ready-to-use structure: services, about, service area, and contact — no guessing.",
    whyNotComplex:
      "A complex website is harder to maintain and doesn’t necessarily bring more leads. For local handyman work, one clear page often performs better.",
    // ✅ 섹션 순서
    layoutOrder: ["hero", "whyOnePage", "about", "services", "contact"],
    faq: COMMON_FAQ,
    demo: {
      brand: "SAMPLE HANDYMAN",
      subtitle: "Repairs · Installations · Local",
      phoneDisplay: "403-000-0000",
      phoneTel: "4030000000",
      serviceAreaLine: "Serving Calgary, Airdrie, Okotoks and nearby areas",
      services: [
        { title: "Drywall & Patching", description: "Small repairs that disappear after paint." },
        { title: "Doors & Trim", description: "Hardware, alignment, squeaks, and finishing." },
        { title: "Assembly", description: "Furniture and fixtures assembled cleanly." },
        { title: "Mounting", description: "TVs, shelves, anchors installed safely." },
        { title: "Refresh Projects", description: "Small renovations with clear scope." },
      ],
    },
  };
