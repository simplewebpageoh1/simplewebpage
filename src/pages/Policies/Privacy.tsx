// src/pages/Policies/Privacy.tsx
// ✅ 개인정보처리방침(간단 버전)
// - Contact/Intake 폼으로 이름/이메일/전화번호를 받는 순간, 개인정보 안내가 필요
// - PIPEDA(캐나다) 기준으로 "수집 목적/보관/삭제 요청"을 명확히

import Seo from "../../components/seo/Seo";
import styles from "./Policies.module.scss";

export default function Privacy() {
  return (
    <main className={styles.page}>
      <Seo
        title="Privacy Policy | One-Page Templates"
        description="Privacy policy for one-page website template purchases."
        path="/privacy"
      />

      <div className="container">
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.muted}>Last updated: Feb 11, 2026</p>

        <div className={styles.card}>
          <h2>What we collect</h2>
          <ul>
            <li>Your name, email, phone number</li>
            <li>Business details you submit (industry, services, service area, etc.)</li>
            <li>Optional files you share (logo/photos), if any</li>
          </ul>

          <h2>Why we collect it</h2>
          <p>
            We use your information only to respond to your message, provide a quote, and build / deliver your one-page website.
          </p>

          <h2>Sharing</h2>
          <p>
            We do <strong>not</strong> sell your data and do <strong>not</strong> share it with third parties, except services
            required to operate the website (e.g., form delivery / email) or when legally required.
          </p>

          <h2>Retention</h2>
          <p>
            We keep your information only as long as needed to complete the project and support reasonable follow‑ups.
          </p>

          <h2>Your choices</h2>
          <p>
            You can request access, correction, or deletion of your data by emailing: <strong>info@simplewebpageoh.com</strong>
          </p>

          <h2>Contact</h2>
          <p>
            If you have any questions about this policy, email: <strong>info@simplewebpageoh.com</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
