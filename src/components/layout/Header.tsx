// src/components/layout/Header.tsx
// ✅ 모든 페이지 상단에 고정으로 보여줄 헤더(네비게이션)

import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";
import { normalizeTheme } from "../../lib/theme";
import { HEADER_PRIMARY_CTA } from "../../config/ui";

export default function Header() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const isContact = location.pathname === "/contact";
  const isCheckout = location.pathname === "/checkout";
  // ✅ ThankYou page can be /thankyou or /thank-you (legacy)
  const isThankYou =
    location.pathname === "/thankyou" ||
    location.pathname === "/thank-you" ||
    location.pathname.startsWith("/thankyou/") ||
    location.pathname.startsWith("/thank-you/");
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

  const hasSelection = Boolean(checkoutTo);
  const primaryIsCheckout = HEADER_PRIMARY_CTA === "checkout";

  // ✅ Option A: prevent duplicate "Contact" in nav.
  // If primary CTA is configured as Checkout but we DON'T have a selection,
  // the CTA falls back to Contact. In that case, we should not also show a
  // secondary Contact link.
  const primaryCtaKind: "checkout" | "contact" =
    primaryIsCheckout && hasSelection ? "checkout" : "contact";


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

          {/*
            ✅ CTA policy
            - Keep only ONE "primary" CTA in the header (better mobile UX).
            - When selection exists (template+theme), allow Checkout.
          */}

          {/* Secondary link (non-primary) */}
          {primaryCtaKind === "checkout" ? (
            <NavLink to={contactTo} className={styles.link}>
              Contact
            </NavLink>
          ) : hasSelection ? (
            <a href={checkoutTo} className={styles.link}>
              Checkout
            </a>
          ) : null}

          {/* Primary CTA (hide on Checkout + ThankYou pages) */}
          {!isCheckout && !isThankYou && (
          primaryCtaKind === "checkout" ? (
            <a href={checkoutTo} className={styles.cta}>
              Checkout
            </a>
          ) : (
            <NavLink
              to={contactTo}
              className={styles.cta}
              onClick={() => {
                // ✅ CTA Contact를 눌러 새 문의 흐름으로 시작할 때만 초기화
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
          )
          )}
        </nav>
      </div>
    </header>
  );
}
