// src/router/AppRouter.tsx
// ✅ 라우팅 구성(99불 원페이지 템플릿 판매용)
// - 유입용(SEO) 페이지: /templates/:slug
// - 데모(미리보기) 페이지: /demo/:slug (한 페이지 스크롤 체험)

import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/layout/Layout";

import Home from "../pages/Home/Home";
import Contact from "../pages/Contact/Contact";
import ThankYou from "../pages/ThankYou/ThankYou";
import Intake from "../pages/Intake/Intake";
import CheckoutRedirect from "../pages/CheckoutRedirect/CheckoutRedirect";
import Templates from "../pages/Templates/Templates";
import TemplateLanding from "../pages/TemplateLanding/TemplateLanding";
import DemoOnePage from "../pages/DemoOnePage/DemoOnePage";
import Refund from "../pages/Policies/Refund";
import Terms from "../pages/Policies/Terms";
import Privacy from "../pages/Policies/Privacy";
import HowItWorks from "../pages/HowItWorks/HowItWorks";

export default function AppRouter() {
  return (
    <Routes>
      {/* ✅ 메인 사이트(판매 랜딩) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />

        {/* ✅ 유입용 템플릿 목록/상세(SEO) */}
        <Route path="/templates" element={<Templates />} />
        <Route path="/templates/:slug" element={<TemplateLanding />} />

        <Route path="/contact" element={<Contact />} />
        <Route path="/checkout" element={<CheckoutRedirect />} />
        <Route path="/intake" element={<Intake />} />
        <Route path="/thank-you" element={<ThankYou />} />

      {/* ✅ 정책 페이지(분쟁/오해 감소) */}
      <Route path="/refund" element={<Refund />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      </Route>

      {/* ✅ 데모(미리보기): Layout 없이 보여줘도 OK */}
      <Route path="/demo/:slug" element={<DemoOnePage />} />

      {/* ✅ 그 외 주소는 홈으로 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
