// src/components/layout/Header.tsx
// ✅ 모든 페이지 상단에 고정으로 보여줄 헤더(네비게이션)

import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";
import { normalizeTheme } from "../../lib/theme";

export default function Header() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const isContact = location.pathname === "/contact";
  const contactTo = isContact ? `/contact${location.search}` : "/contact?from=nav";

  // ✅ If user came to Contact from a demo (template/theme selected), show a Buy button in header
  const selectedTemplate = params.get("template") ?? "";
  const themeRaw = params.get("theme");
  const selectedTheme = themeRaw ? normalizeTheme(themeRaw) : "";
  const addons = params.get("addons") ?? "";
  const checkoutTo =
    selectedTemplate && selectedTheme
      ? `/checkout?template=${encodeURIComponent(selectedTemplate)}&theme=${encodeURIComponent(
          selectedTheme,
        )}${addons ? `&addons=${encodeURIComponent(addons)}` : ""}`
      : "";


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
          {isContact && checkoutTo ? (
            <a href={checkoutTo} className={styles.buyCta}>
              Go to Checkout
            </a>
          ) : null}

          <NavLink
            to={contactTo}
            className={styles.cta}
            onClick={() => {
              // ✅ nav에서 Contact를 눌러 새 문의 흐름으로 시작할 때만 초기화
              try {
                localStorage.removeItem("demoOrderDraft:v1");
                sessionStorage.removeItem("orderFlow:fromDemo");
              } catch {
                // ignore
              }
            }}
          >
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
