// src/data/templatePages/pages/cleaning.ts
// ✅ cleaning 템플릿 데이터 (SEO + Demo)
// - 새 업종 추가 시 이 파일을 복사해서 수정하면 됨

import type { TemplateSeoPage } from "../types";
import { COMMON_FAQ } from "../commonFaq";

export const CLEANING_PAGE: TemplateSeoPage = {
    slug: "cleaning",
    title: "Cleaning Website Template | Simple One Page Site",
    description:
      "Simple cleaning website template for small businesses in Canada. Fast setup, no monthly fees.",
    heading: "Cleaning Website Template (One Page)",
    subheading:
      "A simple one-page website for cleaning services — clear packages, service areas, and an easy contact path.",
    seoLines: [
      "This template is designed for small cleaning businesses in Canada that need a simple website that works.",
      "No monthly builder fees — you can own the site and update it anytime.",
      "Show what you clean, your service area, and how to get a quote — in one page.",
      "Many cleaning customers are on mobile and decide fast, so clarity matters more than complexity.",
      "A one-page structure reduces confusion and makes it easy to contact you immediately.",
      "Fast loading, simple layout, and strong call-to-action for bookings or quote requests.",
    ],
    whoFor:
      "Perfect for residential or commercial cleaners (solo or small teams) who want a professional web presence quickly.",
    solvesFast:
      "You get a proven one-page layout that highlights services and makes booking/quote requests easy.",
    whyNotComplex:
      "Cleaning customers want quick answers and fast contact. One page keeps it simple and reduces friction.",
    // ✅ 섹션 순서
    layoutOrder: ["hero", "about", "services", "whyOnePage", "contact"],
    faq: COMMON_FAQ,
    demo: {
      brand: "SAMPLE CLEANING",
      subtitle: "Residential · Move-out · Office",
      phoneDisplay: "403-000-0000",
      phoneTel: "4030000000",
      serviceAreaLine: "Serving Calgary and surrounding communities",
      services: [
        { title: "Regular Cleaning", description: "Weekly / bi-weekly cleaning that keeps homes fresh." },
        { title: "Move-out Cleaning", description: "Deep clean for tenants, landlords, and realtors." },
        { title: "Office Cleaning", description: "Reliable cleaning for small offices and studios." },
        { title: "Deep Cleaning", description: "Kitchen, bathrooms, and high-touch areas detailed." },
        { title: "Add-ons", description: "Inside fridge, oven, windows (by request)." },
      ],
    },
  };
