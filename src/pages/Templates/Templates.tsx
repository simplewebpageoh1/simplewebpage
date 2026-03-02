// src/pages/Templates/Templates.tsx
// ✅ 템플릿 목록(유입/탐색용)
// - 업종(Industry) × 테마(Theme A/B/C)
// - 초기에는 Electrician만 노출 (추후 업종 추가 예정)

import Seo from "../../components/seo/Seo";
import styles from "./Templates.module.scss";
import { Link } from "react-router-dom";
import { PURCHASE_STEPS } from "../../data/templatePages/templatePages";
import { trackEvent } from "../../utils/analytics";

const ELECTRICIAN = {
  slug: "electrician",
  title: "Electrician (One Page)",
  desc: "One-page website template for electricians with 3 themes (A/B/C).",
  themes: [
    { id: "A", label: "A (Black&White)" },
    { id: "B", label: "B (Dark Mode)" },
    { id: "C", label: "C (Soft Pastel)" },
  ] as const,
};


const PLUMBING = {
  slug: "plumbing",
  title: "Plumbing (One Page)",
  desc: "One-page website template for plumbers. Theme B is available now (A/C coming soon).",
  themes: [
    { id: "A", label: "A (Coming soon)", disabled: true },
    { id: "B", label: "B (Available)", disabled: false },
    { id: "C", label: "C (Coming soon)", disabled: true },
  ] as const,
};


export default function Templates() {
  return (
    <div className={styles.page}>
      <Seo
        title="Templates | Simple One-Page Websites"
        description="Browse one-page website templates by industry and theme."
        path="/templates"
      />

      <section className="section">
        <div className="container">
          <h1 className={styles.title}>Templates</h1>
          <p className={styles.subtitle}>
            One-time price: <strong>$129 CAD</strong>. Choose an industry and then pick a
            theme (A/B/C).
          </p>

          {/* ✅ 섹션 1: 템플릿(업종) + 테마(ABC) */}
          <div className={styles.sectionSoft}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Available</h2>
              <p className={styles.sectionSub}>
                Preview Theme A/B/C, then buy. (More industries will be added.)
              </p>
            </div>

            <div className={styles.grid}>
              <div className={styles.card}>
                <h3 className={styles.cardTitle}>{ELECTRICIAN.title}</h3>
                <p className={styles.cardDesc}>{ELECTRICIAN.desc}</p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                  {ELECTRICIAN.themes.map((t) => (
                    <Link
                      key={t.id}
                      className={styles.action}
                      to={`/demo/electrician/${t.id.toLowerCase()}`}
                      onClick={() =>
                        trackEvent("template_preview", {
                          industry: ELECTRICIAN.slug,
                          theme: t.id,
                          location: "templates_list",
                        })
                      }
                    >
                      Preview {t.label}
                    </Link>
                  ))}

                  <Link
                    className={`${styles.action} ${styles.buyAction}`}
                    to={`/checkout?template=${ELECTRICIAN.slug}&theme=A`}
                    onClick={() =>
                      trackEvent("template_buy_intent", {
                        industry: ELECTRICIAN.slug,
                        location: "templates_list",
                      })
                    }
                  >
                    Buy ($129)
                  </Link>
                </div>

                <div style={{ marginTop: 10, opacity: 0.9, lineHeight: 1.5 }}>
                  Tip: Use the <b>Desktop</b>/<b>Mobile</b> buttons on the demo page to
                  check both versions.
                </div>
              </div>

              <div className={styles.card}>
                <h3 className={styles.cardTitle}>{PLUMBING.title}</h3>
                <p className={styles.cardDesc}>{PLUMBING.desc}</p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
                  {PLUMBING.themes.map((t) =>
                    t.disabled ? (
                      <span
                        key={t.id}
                        className={`${styles.action} ${styles.disabledAction}`}
                        aria-disabled="true"
                      >
                        Preview {t.label}
                      </span>
                    ) : (
                      <Link
                        key={t.id}
                        className={styles.action}
                        to={`/demo/plumbing/${t.id.toLowerCase()}`}
                        onClick={() =>
                          trackEvent("template_preview", {
                            industry: PLUMBING.slug,
                            theme: t.id,
                            location: "templates_list",
                          })
                        }
                      >
                        Preview {t.label}
                      </Link>
                    ),
                  )}
                  <Link
                    className={`${styles.action} ${styles.buyAction}`}
                    to={`/checkout?template=${PLUMBING.slug}&theme=B`}
                    onClick={() =>
                      trackEvent("template_buy_intent", {
                        industry: PLUMBING.slug,
                        location: "templates_list",
                      })
                    }
                  >
                    Buy ($129)
                  </Link>
                </div>

                <div style={{ marginTop: 10, opacity: 0.9, lineHeight: 1.5 }}>
                  Theme A/C will be added later. You can preview <b>B</b> now.
                </div>
              </div>

            </div>
          </div>

          {/* ✅ 섹션 2: 다른 업종 안내 */}
          <div className={styles.sectionSoftAlt}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Need a different industry?</h2>
              <p className={styles.sectionSub}>
                We&apos;ll add more industries over time. If you need one now, contact us.
              </p>
            </div>

            <div className={styles.moreCard}>
              <p className={styles.p}>
                Tell us your industry and we&apos;ll recommend the best version.
              </p>

              <div className={styles.pills}>
                {[
                  "Cleaning",
                  "Handyman",
                  "Plumbing",
                  "Painting",
                  "HVAC",
                  "Landscaping",
                  "Roofing",
                  "Flooring",
                  "Moving",
                  "Personal Trainer",
                ].map((x) => (
                  <span key={x} className={styles.pill}>
                    {x}
                  </span>
                ))}
              </div>

              <div className={styles.moreActions}>
                <Link
                  className={`${styles.action} ${styles.buyAction}`}
                  to="/contact?from=nav"
                  onClick={() => {
                    try {
                      localStorage.removeItem("demoOrderDraft:v1");
                      sessionStorage.removeItem("orderFlow:fromDemo");
                    } catch {
                      // ignore
                    }
                  }}
                >
                  Ask about your industry
                </Link>
                <Link
                  className={styles.action}
                  to="/contact?from=nav"
                  onClick={() => {
                    try {
                      localStorage.removeItem("demoOrderDraft:v1");
                      sessionStorage.removeItem("orderFlow:fromDemo");
                    } catch {
                      // ignore
                    }
                  }}
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>

          {/* ✅ 섹션 3: 진행 순서 */}
          <div className={styles.sectionSoft}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>How it works</h2>
              <p className={styles.sectionSub}>Simple steps from purchase to going live.</p>
            </div>

            <div className={styles.howCard}>
              <div className={styles.steps}>
                {PURCHASE_STEPS.map((s) => (
                  <div key={s.title} className={styles.step}>
                    <h3 className={styles.h3}>{s.title}</h3>
                    <p className={styles.p}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
