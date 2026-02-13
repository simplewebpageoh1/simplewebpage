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
        title="SimpleWebPage | One-page websites for local businesses in Canada"
        description="Simple one-page websites for local service businesses in Canada. One-time payment. No subscriptions. Live in 24–48 hours."
        path="/"
      />
      <Hero
        title="We build and get your website live — you don’t touch tech"
        subtitle="A simple one-page website for local service businesses in Canada. One-time payment. No subscriptions. Live in 24–48 hours."
        primaryCtaText="View Templates"
        primaryCtaLink="/templates"
        secondaryCtaText="Get Started"
        // ✅ Home에서 바로 Contact로 갈 때는 '새 문의'로 처리
        secondaryCtaLink="/contact?from=nav"
      />

      <Services
        heading="What You Get"
        items={[
          {
            title: "One-page website template",
            description: "A clean, mobile-friendly layout that looks professional.",
          },
          {
            title: "No monthly builder fees",
            description: "Host on Netlify and only pay for your domain (yearly). You own the site.",
          },
          {
            title: "Simple setup process",
            description: "After purchase, submit your details using the setup form and get a preview link.",
          },
        ]}
      />

      <Compare />

      <Pricing />

      <ContactCTA
        title="Ready to launch a simple one-page website?"
        subtitle="Pick a template, preview it, and launch fast — Basic $99 or Plus $129 (Custom Color included)."
        ctaLink="/contact?from=nav"
      />
    </>
  );
}