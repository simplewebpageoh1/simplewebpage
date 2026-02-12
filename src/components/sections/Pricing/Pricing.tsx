// src/components/sections/Pricing/Pricing.tsx
// ✅ 가격표 섹션(Basic/Plus)
// - Basic: presets only
// - Plus: custom brand color

import { Link } from "react-router-dom";
import styles from "./Pricing.module.scss";
import { trackEvent } from "../../../utils/analytics";

export default function Pricing() {
  // ✅ Stripe 결제 링크(선택)
  // - .env에 VITE_STRIPE_PAYMENT_LINK_BASIC(또는 구버전 VITE_STRIPE_PAYMENT_LINK)를 넣으면
  //   Buy 버튼이 Stripe 결제로 연결됩니다.
  // - 없으면 기본적으로 /contact로 이동(테스트/개발 단계)
  const stripeBasic =
    (import.meta.env.VITE_STRIPE_PAYMENT_LINK_BASIC as string | undefined) ??
    (import.meta.env.VITE_STRIPE_PAYMENT_LINK as string | undefined);
  const stripePlus = import.meta.env.VITE_STRIPE_PAYMENT_LINK_PLUS as
    | string
    | undefined;

  return (
    <section className={styles.pricing}>
      <div className="container">
        <h2 className={styles.title}>Pricing</h2>
        <p className={styles.subtitle}>
          One-time price for a fast one-page website. No monthly builder fees.
        </p>

        <div className={styles.grid}>
          {/* Basic */}
          <div className={styles.card}>
            <div className={styles.planName}>Basic</div>
            <div className={styles.price}>$99 CAD</div>

            <ul className={styles.list}>
              <li>One-page layout (single scroll)</li>
              <li>Mobile-friendly</li>
              <li>Template-based build</li>
              <li>SEO title &amp; description</li>
              <li>Netlify preview link</li>
              <li>1 round of small text edits</li>
              <li>Domain &amp; hosting guide PDF</li>
            </ul>

            <div className={styles.btnRow}>
              <Link
                to="/templates"
                className={styles.primaryBtn}
                onClick={() =>
                  trackEvent("cta_view_templates", {
                    location: "pricing",
                    plan: "basic",
                  })
                }
              >
                Preview Templates
              </Link>
              {stripeBasic ? (
                <a
                  href={stripeBasic}
                  className={styles.secondaryBtn}
                  onClick={() =>
                    trackEvent("cta_buy", {
                      location: "pricing",
                      plan: "basic",
                      method: "stripe_link",
                    })
                  }
                >
                  Buy Basic
                </a>
              ) : (
                <Link
                  to="/contact?from=pricing&plan=basic"
                  className={styles.secondaryBtn}
                  onClick={() => {
                    // ✅ Pricing에서 Buy를 누르면 과거 데모 선택값이 섞이지 않도록 초기화
                    try {
                      localStorage.removeItem("demoOrderDraft:v1");
                      sessionStorage.removeItem("orderFlow:fromDemo");
                    } catch {
                      // ignore
                    }
                    trackEvent("cta_buy", {
                      location: "pricing",
                      plan: "basic",
                      method: "contact",
                    });
                  }}
                >
                  Buy Basic
                </Link>
              )}
            </div>

            {/* ✅ 오해 방지: 기본 포함/미포함 범위 명확히 */}
            <p className={styles.finePrint}>
              Custom brand color is a Plus feature.
              <br />
              Optional add-ons (domain connection/copy refinement) are
              available.
            </p>
          </div>

          {/* Plus */}
          <div className={styles.card}>
            <div className={styles.planName}>Plus</div>
            <div className={styles.price}>$129 CAD</div>

            <ul className={styles.list}>
              <li>One-page layout (single scroll)</li>
              <li>Mobile-friendly</li>
              <li>Template-based build</li>
              <li>SEO title &amp; description</li>
              <li>Netlify preview link</li>
              <li>1 round of small text edits</li>
              <li>Domain &amp; hosting guide PDF</li>
              <li>
                <strong>Custom brand color</strong> (pick your own)
              </li>
              <li>Match your site color to your logo or business cards</li>
            </ul>

            <div className={styles.btnRow}>
              <Link
                to="/templates"
                className={styles.primaryBtn}
                onClick={() =>
                  trackEvent("cta_view_templates", {
                    location: "pricing",
                    plan: "plus",
                  })
                }
              >
                Preview Templates
              </Link>
              {stripePlus ? (
                <a
                  href={stripePlus}
                  className={styles.secondaryBtn}
                  onClick={() =>
                    trackEvent("cta_buy", {
                      location: "pricing",
                      plan: "plus",
                      method: "stripe_link",
                    })
                  }
                >
                  Buy Plus
                </a>
              ) : (
                <Link
                  to="/contact?from=pricing&plan=plus"
                  className={styles.secondaryBtn}
                  onClick={() => {
                    try {
                      localStorage.removeItem("demoOrderDraft:v1");
                      sessionStorage.removeItem("orderFlow:fromDemo");
                    } catch {
                      // ignore
                    }
                    trackEvent("cta_buy", {
                      location: "pricing",
                      plan: "plus",
                      method: "contact",
                    });
                  }}
                >
                  Buy Plus
                </Link>
              )}
            </div>

            <p className={styles.finePrint}>
              Perfect for matching your existing business cards or signage.
              Includes a one-on-one color consultation via email.
            </p>
          </div>
        </div>

        {/* ✅ 공통 섹션: 카드 밖으로 분리 (카드 높이 균형 + 시선 집중) */}
        <div className={styles.commonRow}>
          <div className={styles.commonCard}>
            <div className={styles.commonTitle}>Optional add-ons</div>
            <ul className={styles.commonList}>
              <li>Copy refinement (+$49)</li>
              <li>Domain connection — done for you (+$49)</li>
              <li>Additional revision (+$39)</li>
              <li>
                <strong>Google Business Profile setup (+$79)</strong>
                <br />
                Profile setup and basic optimization. Verification by owner
                required.
              </li>

              <li>
                <strong>Review request message setup (+$39)</strong>
                <br />
                Simple message template to help you collect more Google reviews.
              </li>
            </ul>
            <p className={styles.stripeNote}>
              Secure checkout powered by Stripe. Credit cards accepted.
            </p>
          </div>

          <div className={styles.commonCard}>
            <div className={styles.commonTitle}>Quick FAQ</div>

            <details className={styles.faqItem}>
              <summary>How long does setup take?</summary>
              <p>
                Most sites are ready within 24–48 hours after we receive your
                intake form.
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary>Do I need technical skills?</summary>
              <p>
                No. We build and publish your website for you. You only provide
                your business details.
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary>What is not included?</summary>
              <p>
                Major layout changes, logo design, and advanced custom features
                are not included.
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary>Do you offer refunds?</summary>
              <p>
                Refunds are available if work has not started. See our{" "}
                <a href="/refund">Refund Policy</a>.
              </p>
            </details>

            <details className={styles.faqItem}>
              <summary>Can you connect my domain?</summary>
              <p>Yes. Use our guide, or add domain setup for +$49.</p>
            </details>

            <p className={styles.note} style={{ marginTop: 12 }}>
              Tip: Preview a demo first. Setup starts immediately after
              checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
