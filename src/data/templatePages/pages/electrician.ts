// src/data/templatePages/pages/electrician.ts
// ✅ electrician 템플릿 데이터 (SEO + Demo)
// - 새 업종 추가 시 이 파일을 복사해서 수정하면 됨

import type { TemplateSeoPage } from "../types";
import { COMMON_FAQ } from "../commonFaq";

export const ELECTRICIAN_PAGE: TemplateSeoPage = {
    slug: "electrician",
    title: "Electrician Website Template | Simple One Page Site",
    description:
      "Simple electrician website template for small businesses in Canada. Fast setup, no monthly fees.",
    heading: "Electrician Website Template (One Page)",
    subheading:
      "A professional one-page website for electricians — built to highlight services, licensing, and quick contact.",
    seoLines: [
      "This template is designed for electricians in Canada who need a clean, professional one-page website.",
      "No monthly builder fees — host on Netlify and keep full ownership of your site.",
      "Highlight services, service area, and contact information so customers can reach you fast.",
      "Most customers just want confidence, clear services, and a direct way to call or request a quote.",
      "A simple one-page website can be more effective than a complex multi-page site for local trades.",
      "Fast loading and mobile-friendly layout to support customers searching on their phones.",
    ],
    whoFor:
      "Best for independent electricians and small electrical companies who want a modern website without ongoing platform fees.",
    solvesFast:
      "You can publish quickly with a ready-made structure that looks professional and builds trust.",
    whyNotComplex:
      "Complex sites take more time, cost more, and are harder to update. For local electrical work, one clear page is usually enough.",
    // ✅ 섹션 순서
    layoutOrder: ["hero", "services", "about", "whyOnePage", "contact"],
    faq: COMMON_FAQ,
    demo: {
      brand: "SAMPLE ELECTRIC",
      subtitle: "Residential · Commercial · Service Calls",
      phoneDisplay: "403-000-0000",
      phoneTel: "4030000000",
      serviceAreaLine: "Serving Calgary, Cochrane, Chestermere and nearby areas",
      services: [
        { title: "Panel Upgrades", description: "Safe upgrades with clean labeling and tidy work." },
        { title: "Lighting", description: "Pot lights, fixtures, switches, and dimmers." },
        { title: "Troubleshooting", description: "Fast diagnosis and clear solutions." },
        { title: "EV Charger", description: "Home EV charger install with proper permits." },
        { title: "Renovations", description: "Basements, kitchens, additions, and new circuits." },
      ],
    },
  };
