// src/data/templatePages/types.ts
// ✅ 템플릿/데모 페이지에서 공통으로 쓰는 타입들

export type FaqItem = { q: string; a: string };

export type DemoContent = {
  brand: string;
  subtitle: string;
  phoneDisplay: string; // 예: "403-000-0000"
  phoneTel: string;     // 예: "4030000000"
  serviceAreaLine: string; // 예: "Serving Calgary, Airdrie, Okotoks"
  services: { title: string; description: string }[];
};

// ✅ 섹션 렌더링 순서용 ID
export type SectionId = "hero" | "services" | "about" | "whyOnePage" | "contact";

export type TemplateSeoPage = {
  slug: string; // 예: "handyman"
  title: string;        // <title>
  description: string;  // <meta name="description">
  heading: string;
  subheading: string;

  // Optional marketing blurbs used on TemplateLanding.
  // Some pages include these, others may omit.
  solvesFast?: string;
  whyNotComplex?: string;

  seoLines: string[];
  whoFor: string;
  solves?: string;
  whyOnePage?: string[];

  /**
   * ✅ 섹션 순서(옵션)
   * 예: ["hero", "services", "about", "whyOnePage", "contact"]
   */
  layoutOrder?: SectionId[];

  faq: FaqItem[];
  demo: DemoContent;
};
