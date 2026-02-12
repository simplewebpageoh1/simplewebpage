// src/pages/Home/Home.tsx
// ✅ Home 페이지(판매 랜딩)
// - 목표: 99불 원페이지 템플릿 판매 컨셉에 맞게 문구/CTA 정리
// - 레이아웃(섹션 구조)은 최대한 유지

import Hero from "../../components/sections/Hero/Hero";
import Services from "../../components/sections/Services/Services";
import Compare from "../../components/sections/Compare/Compare";
import ContactCTA from "../../components/sections/ContactCTA/ContactCTA";
import Pricing from "../../components/sections/Pricing/Pricing";
import { useEffect } from "react";
import Seo from "../../components/seo/Seo";

export default function Home() {
  // ✅ Home을 새로 방문했을 때, 이전 데모 선택값이 Contact에 남아있지 않도록 초기화
  // - 고객이 "그냥 Contact"를 눌렀을 때 과거 선택이 자동 적용되는 혼란을 방지
  useEffect(() => {
    try {
      localStorage.removeItem("demoOrderDraft:v1");
      sessionStorage.removeItem("orderFlow:fromDemo");
    } catch {
      // ignore
    }
  }, []);

  return (
    <>
      <Seo
        title="Professional Website Built for You in 48 Hours — Just $99"
        description="Simple one-page websites for local service businesses in Canada. One-time payment. No subscriptions. Live in 24–48 hours."
        path="/"
      />
      <Hero
  title="Professional Website Built for You in 48 Hours — Just $99"
  subtitle={`No tech stress. No monthly fees.
Send your details — we handle the build and publishing.`}
  primaryCtaText="View Templates"
  primaryCtaLink="/templates"
  secondaryCtaText="Get Started"
  secondaryCtaLink="/contact?from=nav"
/>


      <Services
        heading="What’s Included"
        items={[
          {
            title: "Template-based website build",
            description:
              "We build your site using our optimized one-page layout. Clean and mobile-friendly.",
          },
          {
            title: "Fast setup process",
            description:
              "After checkout, complete a short intake form. We generate your content and send a preview link.",
          },
          {
            title: "1 round of small text edits",
            description: "Includes one revision for minor text updates before final delivery.",
          },
          {
            title: "SEO basics included",
            description: "Title and description setup to improve visibility on Google.",
          },
          {
            title: "You own the site",
            description:
              "Stop paying monthly rent for your website. No builder fees — you only pay for your domain.",
          },
        ]}
      />

      <Compare />

      <Pricing />

      <ContactCTA
        title="Ready to launch a simple one-page website?"
        subtitle="Pick a template, preview it, and launch fast — starting at $99 CAD."
        ctaLink="/contact?from=nav"
      />
    </>
  );
}