// src/components/layout/Header.tsx
// ✅ 모든 페이지 상단에 고정으로 보여줄 헤더(네비게이션)

import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";

function getBuyLabel(plan: string) {
  const p = (plan ?? "").toLowerCase();
  if (p === "plus") return "Buy ($129 CAD)";
  if (p === "basic") return "Buy ($99 CAD)";
  return "Buy";
}

export default function Header() {
  const location = useLocation();

  const isContact = location.pathname === "/contact";
  const isIntake = location.pathname === "/intake";
  const isThankYou = location.pathname === "/thank-you";

  const params = new URLSearchParams(location.search);
  const template = (params.get("template") ?? "").trim();
  const plan = (params.get("plan") ?? "").trim().toLowerCase();

  const hasSelection = !!template && (plan === "basic" || plan === "plus");

  // ✅ 기본 CTA: 문의(Contact)로 유도
  // - Contact 페이지에서 다시 눌러도 query를 리셋하지 않도록 현재 search 유지
  const contactTo = isContact ? `/contact${location.search}` : "/contact?from=nav";

  // ✅ 선택값이 있으면(특히 Contact/Intake/ThankYou) CTA를 결제(Buy)로 전환
  const checkoutTo = `/checkout${location.search}`;

  const inCheckoutContext = isContact || isIntake || isThankYou;

  const ctaLabel = hasSelection && inCheckoutContext ? getBuyLabel(plan) : "Contact";
  const ctaTo = hasSelection && inCheckoutContext ? checkoutTo : contactTo;

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* ✅ 브랜드/로고 영역 */}
        <Link to="/" className={styles.brand}>
          SimpleWebPage
        </Link>

        {/* ✅ 네비게이션 링크 */}
        <nav className={styles.nav}>
          <NavLink to="/" className={styles.link}>
            Home
          </NavLink>
          <NavLink to="/templates" className={styles.link}>
            Templates
          </NavLink>

          {/* ✅ CTA: 기본은 Contact, 선택값이 있으면 Contact/Intake에서 Buy로 표시 */}
          <NavLink
            to={ctaTo}
            className={styles.cta}
            onClick={() => {
              // ✅ Contact/Intake/ThankYou에서 선택값이 있는 상태(Buy 모드)면 초기화 금지
              if (hasSelection && inCheckoutContext) return;

              // ✅ nav에서 Contact를 눌러 새 문의 흐름으로 시작할 때만 초기화
              try {
                localStorage.removeItem("demoOrderDraft:v1");
                sessionStorage.removeItem("orderFlow:fromDemo");
              } catch {
                // ignore
              }
            }}
          >
            {ctaLabel}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
