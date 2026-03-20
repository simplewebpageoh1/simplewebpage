// src/components/layout/Header.tsx

import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";
import { normalizeTheme } from "../../lib/theme";
import { HEADER_PRIMARY_CTA } from "../../config/ui";

export default function Header() {
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const isContact = location.pathname === "/contact";
  const isCheckout = location.pathname === "/checkout";
  const isIntake = location.pathname === "/intake";
  const isThankYou =
    location.pathname === "/thankyou" ||
    location.pathname === "/thank-you" ||
    location.pathname.startsWith("/thankyou/") ||
    location.pathname.startsWith("/thank-you/");

  const hideCheckoutUI = isCheckout || isThankYou || isIntake;
  const contactTo = isContact ? `/contact${location.search}` : "/contact?from=nav";

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
  const primaryCtaKind: "checkout" | "contact" =
    primaryIsCheckout && hasSelection ? "checkout" : "contact";

  function resetDraftForNewInquiry() {
    try {
      localStorage.removeItem("demoOrderDraft:v1");
      sessionStorage.removeItem("orderFlow:fromDemo");
    } catch {
      // ignore
    }
  }

  const contactLinkProps = {
    to: contactTo,
    onClick: !isContact ? resetDraftForNewInquiry : undefined,
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.brand}>
          SimpleWebPage
        </Link>

        <nav className={styles.nav}>
          <NavLink to="/" className={styles.link}>
            Home
          </NavLink>
          <NavLink to="/templates" className={styles.link}>
            Templates
          </NavLink>

          {hideCheckoutUI ? (
            <NavLink {...contactLinkProps} className={styles.link}>
              Contact
            </NavLink>
          ) : primaryCtaKind === "checkout" ? (
            <NavLink {...contactLinkProps} className={styles.link}>
              Contact
            </NavLink>
          ) : hasSelection ? (
            <a href={checkoutTo} className={styles.link}>
              Checkout
            </a>
          ) : null}

          {!hideCheckoutUI &&
            (primaryCtaKind === "checkout" ? (
              <a href={checkoutTo} className={styles.cta}>
                Checkout
              </a>
            ) : (
              <NavLink {...contactLinkProps} className={styles.cta}>
                Contact
              </NavLink>
            ))}
        </nav>
      </div>
    </header>
  );
}
