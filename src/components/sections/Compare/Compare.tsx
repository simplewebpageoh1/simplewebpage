// src/components/sections/Compare/Compare.tsx
// ✅ Compare 섹션
// - 99불 원페이지 템플릿 컨셉에 맞게 문구 수정

import styles from "./Compare.module.scss";

type CompareProps = {
  title?: string;
  subtitle?: string;
};

export default function Compare({
  title = "Who This Is For",
  subtitle = "Simple one-page websites that look professional and work on mobile.",
}: CompareProps) {
  return (
    <section className={styles.compare}>
      <div className="container">
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.box}>
          <h3>Perfect for small businesses who want:</h3>
          <ul>
            <li>A clean, modern one-page website</li>
            <li>No monthly website builder fees</li>
            <li>A simple setup process (intake + preview)</li>
            <li>Clear contact path for customers</li>
          </ul>

          <div className={styles.grid}>
            <div className={styles.box}>
              <h3>
                Website builder platforms{" "}
                <span style={{ fontWeight: "normal" }}>
                  (Wix, GoDaddy, Squarespace, Weebly, Shopify, WordPress.com, Webflow)
                </span>
              </h3>
              <ul>
                <li>Monthly subscription</li>
                <li>DIY setup & maintenance</li>
                <li>Can become slow or bloated over time</li>
              </ul>
            </div>

            <div className={styles.box}>
              <h3>SimpleWebPage (Built for You)</h3>
              <ul>
                <li>One-time price (from $99 CAD)</li>
                <li>Fast loading and mobile-friendly</li>
                <li>Includes domain & hosting guide PDF</li>
              </ul>
            </div>
          </div>

          <p className={styles.note}>
            <strong>Not ideal for:</strong> large online stores or complex web apps.
          </p>
        </div>
      </div>
    </section>
  );
}
