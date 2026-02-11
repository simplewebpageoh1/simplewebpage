// src/pages/Policies/Refund.tsx
// ✅ 환불 정책 페이지 (분쟁/오해 감소)

import Seo from "../../components/seo/Seo";
import styles from "./Policies.module.scss";

export default function Refund() {
  return (
    <main className={styles.page}>
      <Seo
        title="Refund Policy | One-Page Templates"
        description="Refund policy for one-page website template purchases."
        path="/refund"
      />

      <div className="container">
        <h1 className={styles.title}>Refund Policy</h1>
        <p className={styles.muted}>Last updated: Feb 9, 2026</p>

        <div className={styles.card}>
          <h2>Summary</h2>
          <ul>
            <li>Refunds are available if work has not started.</li>
            <li>Once customization work begins, refunds are not available.</li>
            <li>If you have questions, contact us as soon as possible.</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>When a refund is possible</h2>
          <p>
            If you request a refund before we start customization (before we begin editing the template based on your
            submitted details), we can provide a full refund.
          </p>
        </div>

        <div className={styles.card}>
          <h2>When a refund is not possible</h2>
          <p>
            Once we start customization work (for example: applying your business info, editing sections, or preparing a
            preview), refunds are not available.
          </p>
        </div>

        <p className={styles.small}>
          Note: Optional add-ons (copywriting, domain connection, additional revisions) are quoted/confirmed separately
          after purchase.
        </p>
      </div>
    </main>
  );
}
