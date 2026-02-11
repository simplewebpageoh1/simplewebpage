// src/pages/ThankYou/ThankYou.tsx
// ✅ 폼 제출 성공 후 보여줄 안내 페이지
// - 문의(Contact) 또는 구매 후 제출(Intake) 둘 다 여기로 올 수 있음
// - 다음 단계(Setup Form 링크)를 함께 제공해서 운영 효율을 높인다.

import { Link, useLocation } from "react-router-dom";
import Seo from "../../components/seo/Seo";

export default function ThankYou() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // ✅ 가능하면 template 값을 유지해서 Setup Form으로 넘긴다
  const template = params.get("template") ?? "";
  const paid = params.get("paid") ?? ""; // optional flag

  const intakeUrl = template ? `/intake?template=${template}` : "/intake";

  const headline = paid === "1" ? "Order confirmed 🎉" : "Message received ✅";

  const pageTitle = paid === "1" ? "Order Confirmed | SimpleWebPage" : "Thank You | SimpleWebPage";

  const intro =
    paid === "1"
      ? "Check your email for a payment receipt. Next, please fill out the setup form below to start building your site."
      : "Thanks — we received your message. If you already paid via Stripe, check your email for a receipt. Next, please fill out the setup form below to start building your site.";

  return (
    <>
      <Seo
        title={pageTitle}
        description="Thanks — we received your submission. Next, please fill out the setup form."
        path="/thank-you"
      />
      <main style={{ padding: 48 }}>
      <div className="container">
        <h1>{headline}</h1>
        <p style={{ marginTop: 12, opacity: 0.9, lineHeight: 1.6 }}>{intro}</p>

        <div style={{ marginTop: 12, padding: 14, borderRadius: 14, border: "1px solid rgba(0,0,0,.08)", background: "rgba(0,0,0,.03)", lineHeight: 1.65 }}>
          <strong>What happens next?</strong>
          <ul style={{ margin: "8px 0 0 18px" }}>
            <li>We’ll review your information within <strong>24 hours</strong>.</li>
            <li>Your site will be <strong>deployed and live within 24–48 hours</strong> after review.</li>
            <li>You’ll receive an email once your site is live.</li>
          </ul>
          <div style={{ marginTop: 8, opacity: 0.9 }}>
            Please check your email for updates (including your receipt if paid).
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
          <Link to={intakeUrl} style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,.18)", textDecoration: "none" }}>
            Open Setup Form
          </Link>
          <a href="/Domain-Hosting-Guide.pdf" target="_blank" rel="noreferrer" style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,.18)", textDecoration: "none" }}>
            Open Domain & Hosting Guide (PDF)
          </a>
          <Link to="/templates" style={{ padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,.18)", textDecoration: "none" }}>
            View Templates
          </Link>
        </div>

        <div style={{ marginTop: 24, opacity: 0.9 }}>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </main>
    </>
  );
}