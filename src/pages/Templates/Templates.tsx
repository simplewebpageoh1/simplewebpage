import Seo from "../../components/seo/Seo";
import styles from "./Templates.module.scss";
import { Link } from "react-router-dom";
import { PURCHASE_STEPS } from "../../data/templatePages/templatePages";
import { trackEvent } from "../../utils/analytics";
import electricianHero from "../../assets/electrician/hero-light.png";
import plumbingHero from "../../assets/plumbing/hero.png";
import { ThemeId } from "../../lib/theme";

type ThemeMeta = {
  id: ThemeId;
  label: string;
  cardTone: "mono" | "dark" | "soft";
  titleTop: string;
  titleBottom: string;
};

type IndustryMeta = {
  slug: "electrician" | "plumbing";
  title: string;
  image: string;
  landingTo: string;
  themes: ThemeMeta[];
};

const INDUSTRIES: IndustryMeta[] = [
  {
    slug: "electrician",
    title: "Electrician",
    image: electricianHero,
    landingTo: "/templates/electrician",
    themes: [
      { id: "A", label: "Black & White", titleTop: "Black", titleBottom: "& White", cardTone: "mono" },
      { id: "B", label: "Dark Premium", titleTop: "Dark", titleBottom: "Premium", cardTone: "dark" },
      { id: "C", label: "Soft Clean", titleTop: "Soft", titleBottom: "Clean", cardTone: "soft" },
    ],
  },
  {
    slug: "plumbing",
    title: "Plumbing",
    image: plumbingHero,
    landingTo: "/templates/plumbing",
    themes: [
      { id: "A", label: "Black & White", titleTop: "Black", titleBottom: "& White", cardTone: "mono" },
      { id: "B", label: "Dark Premium", titleTop: "Dark", titleBottom: "Premium", cardTone: "dark" },
      { id: "C", label: "Soft Clean", titleTop: "Soft", titleBottom: "Clean", cardTone: "soft" },
    ],
  },
];

function ThemePreviewCard({ industry, theme }: { industry: IndustryMeta; theme: ThemeMeta }) {
  return (
    <Link
      className={`${styles.themeCard} ${styles[theme.cardTone]}`}
      to={`/demo/${industry.slug}/${theme.id.toLowerCase()}`}
      onClick={() =>
        trackEvent("template_preview", {
          industry: industry.slug,
          theme: theme.id,
          theme_name: theme.label,
          location: "templates_thumb",
        })
      }
    >
      <div
        className={styles.themeThumb}
        aria-hidden="true"
        style={{ ["--thumb-image" as string]: `url(${industry.image})` }}
      >
        <div className={styles.thumbPill}>Theme {theme.id}</div>
        <div className={`${styles.thumbTitleWrap} ${styles[`title${theme.id}`]}`}>
          <strong>
            <span className={styles.titleTop}>{theme.titleTop}</span>
            <span className={styles.titleBottom}>{theme.titleBottom}</span>
          </strong>
        </div>
        <div className={styles.thumbSwatches} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </Link>
  );
}

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
            One-time price: <strong>$129 CAD</strong>. Choose an industry and then pick a theme (A/B/C).
          </p>

          <div className={styles.sectionSoft}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>One Page Website Available</h2>
            </div>

            <div className={styles.grid}>
              {INDUSTRIES.map((industry) => (
                <div key={industry.slug} className={styles.card}>
                  <div className={styles.cardTop}>
                    <h3 className={styles.cardTitle}>{industry.title}</h3>
                    <Link
                      className={`${styles.action} ${styles.buyAction}`}
                      to={industry.landingTo}
                      onClick={() =>
                        trackEvent("template_buy_intent", {
                          industry: industry.slug,
                          location: "templates_list",
                        })
                      }
                    >
                      Buy ($129)
                    </Link>
                  </div>

                  <div className={styles.themeGrid}>
                    {industry.themes.map((theme) => (
                      <ThemePreviewCard
                        key={`${industry.slug}-${theme.id}`}
                        industry={industry}
                        theme={theme}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                <Link className={`${styles.action} ${styles.buyAction}`} to="/contact?from=nav">
                  Ask about your industry
                </Link>
                <Link className={styles.action} to="/contact?from=nav">
                  Contact us
                </Link>
              </div>
            </div>
          </div>

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
