// src/pages/HowItWorks/HowItWorks.tsx
// ✅ 고객 안내용 "작업 프로세스" 페이지
// - 결제 직전/직후 고객의 불안을 줄이는 용도(언제/무엇을/어떻게 하는지)
// - Templates 페이지의 How it works 섹션을 더 자세히 확장한 버전

import Seo from "../../components/seo/Seo";
import { PURCHASE_STEPS } from "../../data/templatePages";
import styles from "./HowItWorks.module.scss";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <main className={styles.page}>
      <Seo
        title="How it works | Simple One-Page Websites"
        description="Simple steps from purchase to going live. Typical timeline and revision policy."
        path="/how-it-works"
      />

      <div className="container">
        <h1 className={styles.title}>How it works</h1>
        <p className={styles.subtitle}>
          Clear steps from purchase to launch — so you know exactly what happens next.
        </p>

        <div className={styles.card}>
          <div className={styles.steps}>
            {PURCHASE_STEPS.map((s) => (
              <div key={s.title} className={styles.step}>
                <h2 className={styles.h2}>{s.title}</h2>
                <p className={styles.p}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.panel}>
            <h2 className={styles.h2}>Typical timeline</h2>
            <ul>
              <li>Build time: <strong>24–48 hours</strong> after you submit the intake form (business details).</li>
              <li>We’ll send a preview link for your review.</li>
              <li>After approval, we connect the domain and publish.</li>
            </ul>
          </div>

          <div className={styles.panel}>
            <h2 className={styles.h2}>Revisions</h2>
            <ul>
              <li><strong>1 revision</strong> is included.</li>
              <li>Additional small edits may be billed (e.g., $39) depending on scope.</li>
              <li>We’ll always confirm cost before any extra work.</li>
            </ul>
          </div>

          <div className={styles.panel}>
            <h2 className={styles.h2}>Optional add‑ons</h2>
            <ul>
              <li>Domain connection assistance: <strong>$49</strong></li>
              <li>Copy refinement: <strong>$49</strong></li>
              <li>Ongoing maintenance (optional): small updates + extra edits as needed</li>
            </ul>
          </div>
        </div>

        <div className={styles.actions}>
          <Link className={styles.primary} to="/templates">View templates</Link>
          <Link className={styles.secondary} to="/contact?from=nav">Contact</Link>
        </div>
      </div>
    </main>
  );
}
