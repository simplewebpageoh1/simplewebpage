// src/pages/Templates/Templates.tsx
// ✅ 템플릿 목록(유입/탐색용)
// - One-page 템플릿만 집중
// - 섹션별 옅은 회색 배경으로 구분을 명확하게

import Seo from "../../components/seo/Seo";
import styles from "./Templates.module.scss";
import { Link } from "react-router-dom";
import { PURCHASE_STEPS } from "../../data/templatePages/templatePages";
import { trackEvent } from "../../utils/analytics";

const ITEMS = [
  { slug: "handyman", title: "Handyman (One Page)", desc: "Simple template for local handyman services in Canada." },
  { slug: "cleaning", title: "Cleaning (One Page)", desc: "Simple template for residential / commercial cleaning services." },
  { slug: "electrician", title: "Electrician (One Page)", desc: "Professional template for electricians with clear service messaging." },
];

export default function Templates() {
  return (
    <div className={styles.page}>
      <Seo
        title="Templates | Simple One-Page Websites"
        description="Browse simple one-page website templates for small businesses in Canada."
        path="/templates"
      />

      <section className="section">
        <div className="container">
          <h1 className={styles.title}>Templates</h1>
          <p className={styles.subtitle}>
            SEO-friendly one-page templates designed for small service businesses in Canada.
            One-time price: <strong>$99 CAD</strong>. Includes a domain/hosting guide PDF.
          </p>

          {/* ✅ 섹션 1: 템플릿 카드 */}
          <div className={styles.sectionSoft}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Available templates</h2>
              <p className={styles.sectionSub}>Pick one to see details, preview the demo, or buy.</p>
            </div>

            <div className={styles.grid}>
              {ITEMS.map((t) => (
                <div key={t.slug} className={styles.card}>
                  <h3 className={styles.cardTitle}>{t.title}</h3>
                  <p className={styles.cardDesc}>{t.desc}</p>

                  <div className={styles.cardActions}>
                    <Link className={styles.action} to={`/templates/${t.slug}`}>Details</Link>
                    <Link
                      className={styles.action}
                      to={`/demo/${t.slug}`}
                      onClick={() => trackEvent("template_preview", { slug: t.slug, location: "templates_list" })}
                    >
                      Preview
                    </Link>
                    <Link
                      className={`${styles.action} ${styles.buyAction}`}
                      to={`/contact?template=${t.slug}`}
                      onClick={() => trackEvent("template_buy_intent", { slug: t.slug, location: "templates_list" })}
                    >
                      Buy
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* ✅ 섹션 1.5: 고객용(최종) 미리보기 링크
              - Preview(/demo)는 옵션바가 있어서 '샘플 느낌'이 날 수 있음
              - mode=client는 최종 고객 사이트에 가까운 버전(혼란 예방) */}
          <div className={styles.sectionSoftAlt}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Client-version previews</h2>
              <p className={styles.sectionSub}>
                Want to see what the final website looks like? These links hide the demo controls.
              </p>
            </div>

            <div className={styles.clientGrid}>
              {ITEMS.map((t) => (
                <a key={t.slug} className={styles.clientLink} href={`/demo/${t.slug}?mode=client`}>
                  {t.title} → View final-style preview
                </a>
              ))}
            </div>
          </div>

          {/* ✅ 섹션 2: 다른 업종 안내 */}
          <div className={styles.sectionSoftAlt}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Need a different industry?</h2>
              <p className={styles.sectionSub}>
                We can adapt this one-page layout for many other trades and services in Canada.
              </p>
            </div>

            <div className={styles.moreCard}>
              <p className={styles.p}>
                Tell us your industry and we&apos;ll recommend the best version.
              </p>

              <div className={styles.pills}>
                {[
                  "Plumbing","Painting","HVAC","Landscaping","Roofing",
                  "Flooring","Moving","Personal Trainer","Tutor","Beauty / Salon",
                ].map((x) => (
                  <span key={x} className={styles.pill}>{x}</span>
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
