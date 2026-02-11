// src/pages/Policies/Terms.tsx
// ✅ 이용약관(간단 버전) - 기본 $99 범위를 명확히

import Seo from "../../components/seo/Seo";
import styles from "./Policies.module.scss";

export default function Terms() {
  return (
    <main className={styles.page}>
      <Seo
        title="Terms & Conditions | One-Page Templates"
        description="Terms and conditions for one-page website template purchases."
        path="/terms"
      />

      <div className="container">
        <h1 className={styles.title}>Terms & Conditions</h1>
        <p className={styles.muted}>Last updated: Feb 9, 2026</p>

        <div className={styles.card}>
          <h2>What you get ($99 CAD)</h2>
          <ul>
            <li>One-page template customization using the details you submit.</li>
            <li>Mobile-friendly layout.</li>
            <li>Basic SEO title & description setup.</li>
            <li>Domain & hosting guide (PDF) and a simple setup form.</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>What’s not included</h2>
          <ul>
            <li>Custom copywriting (available as an add-on).</li>
            <li>Done-for-you domain connection (available as an add-on).</li>
            <li>Advanced SEO strategy, blog/content marketing, or multi-page websites.</li>
            <li>Unlimited revisions — small changes are limited to the included scope.</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Revisions</h2>
          <p>
            The base purchase is designed for fast launch. Small text updates are supported within the included scope.
            Additional revisions or custom changes can be added as a paid add-on.
          </p>
        </div>

        <div className={styles.card}>
          <h2>Timelines</h2>
          <p>
            Typical delivery is within 48 hours after we receive your completed setup form. Delays may occur if required
            information is missing.
          </p>
        </div>
      </div>
    </main>
  );
}
