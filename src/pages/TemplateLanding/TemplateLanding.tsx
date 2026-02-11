// src/pages/TemplateLanding/TemplateLanding.tsx
// ✅ 유입(SEO) 목적의 템플릿 소개 페이지(/templates/:slug)
// - 섹션별 옅은 회색 배경으로 구분을 명확하게

import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import Seo from "../../components/seo/Seo";
import styles from "./TemplateLanding.module.scss";
import { TEMPLATE_PAGES, PURCHASE_STEPS } from "../../data/templatePages/templatePages";

export default function TemplateLanding() {
  const { slug } = useParams();
  const page = useMemo(() => TEMPLATE_PAGES.find((p) => p.slug === slug), [slug]);
  if (!page) return null;

  return (
    <div className={styles.page}>
      <Seo title={page.title} description={page.description} path={`/templates/${page.slug}`} />

      <section className="section">
        <div className="container">
          <h1 className={styles.title}>{page.heading}</h1>
          <p className={styles.subtitle}>{page.subheading}</p>

          {/* ✅ 상단 핵심 정보 */}
          <div className={styles.sectionSoft}>
            <div className={styles.trustRow}>
              <span className={styles.trustBadge}>Fast response</span>
              <span className={styles.trustText}>Simple, clear, and mobile-friendly.</span>
            </div>

            <div className={styles.badges}>
              <span className={styles.badge}>One-time price: $99 CAD</span>
              <span className={styles.badge}>No monthly builder fees</span>
              <span className={styles.badge}>Includes PDF guide</span>
            </div>

            <div className={styles.ctaRow}>
              <Link className={styles.primaryBtn} to={`/contact?template=${page.slug}`}>
                Buy / Get Started
              </Link>
              <Link className={styles.secondaryBtn} to={`/demo/${page.slug}`}>
                Preview Demo
              </Link>
              <a className={styles.ghostBtn} href="/Domain-Hosting-Guide.pdf" target="_blank" rel="noreferrer">
                Domain & Hosting Guide (PDF)
              </a>
            </div>
          </div>

          {/* ✅ Service area + Steps */}
          <div className={styles.sectionSoftAlt}>
            <div className={styles.card}>
              <h2 className={styles.h2}>Service area example</h2>
              <p className={styles.p}>
                Example: <strong>{page.demo.serviceAreaLine}</strong>. You can replace cities and areas anytime.
              </p>
            </div>

            <div className={styles.card}>
              <h2 className={styles.h2}>How it works (3 steps)</h2>
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

          {/* ✅ SEO lines + Who/Problem/Why + FAQ */}
          <div className={styles.sectionSoft}>
            <div className={styles.card}>
              <h2 className={styles.h2}>Quick SEO Overview</h2>
              <div className={styles.seoLines}>
                {page.seoLines.map((line) => (
                  <p key={line} className={styles.p}>{line}</p>
                ))}
              </div>
            </div>

            <div className={styles.grid3}>
              <div className={styles.card}>
                <h2 className={styles.h2}>Who is this for?</h2>
                <p className={styles.p}>{page.whoFor}</p>
              </div>

              <div className={styles.card}>
                <h2 className={styles.h2}>What problem does it solve fast?</h2>
                <p className={styles.p}>{page.solvesFast}</p>
              </div>

              <div className={styles.card}>
                <h2 className={styles.h2}>Why you don’t need a complex website</h2>
                <p className={styles.p}>{page.whyNotComplex}</p>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.h2}>FAQ</h2>
              <div className={styles.faq}>
                {page.faq.map((item) => (
                  <div key={item.q} className={styles.faqItem}>
                    <p className={styles.q}>Q. {item.q}</p>
                    <p className={styles.a}>A. {item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.backRow}>
            <Link className={styles.textLink} to="/templates">← Back to templates</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
