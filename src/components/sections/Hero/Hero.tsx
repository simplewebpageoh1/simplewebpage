// src/components/sections/Hero/Hero.tsx
// ✅ Hero 섹션 (SCSS module 적용)

import { Link } from "react-router-dom";
import styles from "./Hero.module.scss";

type HeroProps = {
  title: string;
  subtitle: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
};

export default function Hero({
  title,
  subtitle,
  primaryCtaText = "Get a Free Quote",
  primaryCtaLink = "/contact",
  secondaryCtaText = "View Templates",
  secondaryCtaLink = "/templates",
}: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className="container">
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>

        <div className={styles.actions}>
          <Link to={primaryCtaLink} className={styles.primaryBtn}>
            {primaryCtaText}
          </Link>

          <Link to={secondaryCtaLink} className={styles.secondaryBtn}>
            {secondaryCtaText}
          </Link>
        </div>
      </div>
    </section>
  );
}
