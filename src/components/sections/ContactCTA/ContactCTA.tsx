
// src/components/sections/ContactCTA/ContactCTA.tsx
// ✅ ContactCTA 섹션 (링크를 props로 받아서 어디서든 재사용 가능)

import { Link } from "react-router-dom";
import styles from "./ContactCTA.module.scss";

type ContactCTAProps = {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string; // ✅ 추가: 버튼이 이동할 링크
};

export default function ContactCTA({
  title = "Ready to launch your website?",
  subtitle = "Send your details and we’ll reply within 24 hours.",
  ctaText = "Get a Free Quote",
  ctaLink = "/contact", // ✅ 기본값은 /contact
}: ContactCTAProps) {
  return (
    <section className={styles.cta}>
      <div className="container">
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        <Link to={ctaLink} className={styles.btn}>
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
