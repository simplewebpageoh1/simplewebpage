// src/pages/Home/Home.tsx
// ✅ Home 페이지(판매 랜딩)
// - 목표: 129불 원페이지 템플릿 판매 컨셉에 맞게 문구/CTA 정리
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
        title="Launch Your Website in 24–48 Hours — $129 One-Time"
        description="One-page websites for local service businesses in Canada. One-time $129. No subscriptions. Ready in 24–48 hours."
        path="/"
      />
      <Hero
        title="Launch Your Website in 24–48 Hours — $129 One-Time"
        subtitle={`One payment. No monthly fees.
Send your details—we build and publish it for you.`}
        primaryCtaText="Templates"
        primaryCtaLink="/templates"
        secondaryCtaText="Contact"
        // ✅ Home에서 바로 Contact로 갈 때는 '새 문의'로 처리
        secondaryCtaLink="/contact?from=nav"
      />

      <Services
        heading="What You Get"
        items={[
          {
            title: "One-Page Website",
            description:
              "We build a clean one-page site that works great on phones and desktops.",
          },
          {
            title: "Fast Turnaround",
            description:
              "After checkout, fill a short form. You get a preview link in 24–48 hours.",
          },
          {
            title: "1 Round of Edits",
            description:
              "One round of small text changes before we finalize.",
          },
          {
            title: "Google Basics",
            description:
              "We set your page title & description so Google can understand your site.",
          },
          {
            title: "You Own It",
            description:
              "No monthly website builder fees. You keep the site and only pay for your domain.",
          },
        ]}
      />

      <Compare />

      <Pricing />

      <ContactCTA
        title="Need more than a simple website?"
        subtitle="We also build custom websites. Contact us for a quote."
        ctaText="Custom Website Inquiry"
        ctaLink="/contact?from=custom"
      />

      <ContactCTA
        title="Ready to launch?"
        subtitle="Pick a template, preview it, and checkout when you’re ready — $129 one-time."
        ctaLink="/contact?from=nav"
      />
    </>
  );
}
