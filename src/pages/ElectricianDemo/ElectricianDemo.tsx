import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import Accordion from "../../components/ui/Accordion";
import ElectricianSiteLayout from "../../components/electrician/ElectricianSiteLayout";
import TopBar from "../../components/electrician/TopBar/TopBar";
import styles from "./ElectricianDemo.module.scss";

const content = {
  businessName: "Sample Electric",
  city: "Calgary",
  heroTag: "Licensed • Insured • Fast response",
  heroTitleA: "Reliable",
  heroTitleB: "Electrical Service",
  heroSubtitle:
    "Residential and small commercial work. Clear quotes, clean finishes, and on-time service.",
  serviceArea: "Calgary + surrounding area",
  phone: "(403) 555-0100",
  email: "info@simplewebpageoh.com",
  badges: [
    { title: "Same-week booking", desc: "Most jobs scheduled within 2–5 days." },
    { title: "Clear pricing", desc: "Upfront quote before work starts." },
    { title: "Clean work", desc: "Respectful, tidy, and safe." },
  ],
  services: [
    { title: "Troubleshooting", desc: "Find & fix electrical issues safely." },
    { title: "Panel upgrades", desc: "Service upgrades and breaker replacements." },
    { title: "Lighting", desc: "Indoor/outdoor lighting installs." },
    { title: "EV chargers", desc: "Home EV charger installation." },
    { title: "Renovations", desc: "Basement, kitchen, and additions." },
    { title: "Commercial", desc: "Small shops, offices, and maintenance." },
  ],
  aboutTitle: "Local, straightforward, and professional.",
  aboutBody:
    "We focus on clean installs, clear communication, and fast turnaround.\n\nThis is a sample demo to show layout and style for electricians.",
  faq: [
    { q: "Do you provide free quotes?", a: "Yes — tell us what you need and we’ll confirm next steps." },
    { q: "Are you licensed and insured?", a: "Yes. Always ask for proof if needed." },
    { q: "How soon can you come?", a: "Typically within the week depending on job size." },
    { q: "Do you do permits?", a: "For work that requires it, yes." },
  ],
};

function normalizeTheme(v: string | undefined): "A" | "B" | "C" {
  const x = (v ?? "a").toUpperCase();
  if (x === "A" || x === "B" || x === "C") return x;
  return "A";
}

export default function ElectricianDemo() {
  const { variant } = useParams();
  const theme = useMemo(() => normalizeTheme(variant), [variant]);
  const [preview, setPreview] = useState<"desktop" | "mobile">("desktop");

  const heroImg = useMemo(() => {
    // Use provided images. Theme B uses the same image but the overlay/contrast is handled by CSS tokens.
    return new URL("../../assets/electrician/hero-light.png", import.meta.url).toString();
  }, []);

  const aboutImg = useMemo(
    () => new URL("../../assets/electrician/about.png", import.meta.url).toString(),
    []
  );

  return (
    <ElectricianSiteLayout theme={theme}>
      <Helmet>
        <title>{content.businessName} — {theme === "A" ? "Black & White" : theme === "B" ? "Dark Premium" : "Soft Clean"}</title>
      </Helmet>

      <TopBar theme={theme} preview={preview} setPreview={setPreview} />

      <div
        className={
          preview === "mobile" ? styles.previewMobileFrame : styles.previewDesktop
        }
      >
        {/* HERO */}
        <section className={`${styles.heroWrap} ${styles["hero" + theme]}`}>
          <div className="container">
            <div
              className={styles.heroPanel}
              style={{ ["--hero-bg" as any]: `url(${heroImg})` } as any}
            >
              <div className={styles.heroContent}>
                <div className={styles.heroLeft}>
                  <div className="smallTag">{content.heroTag}</div>
                  <h1 className={styles.heroTitle}>
                    <span>{theme === "B" ? "Your Trusted" : content.heroTitleA}</span>
                    <br />
                    <span className={styles.heroAccent}>
                      {theme === "B"
                        ? `${content.city} Electricians`
                        : content.heroTitleB}
                    </span>
                  </h1>

                  <p className={`p ${styles.heroSub}`}>{content.heroSubtitle}</p>

                  <div className={styles.heroMeta}>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Service area</span>
                      <span className={styles.metaValue}>{content.serviceArea}</span>
                    </div>
                    <div className={styles.metaRow}>
                      <span className={styles.metaLabel}>Phone</span>
                      <a
                        className={styles.metaValue}
                        href={`tel:${content.phone.replace(/[^0-9+]/g, "")}`}
                      >
                        {content.phone}
                      </a>
                    </div>
                  </div>

                  <div className={styles.heroCtas}>
                    <a className="btn btnPrimary" href="#contact">
                      {theme === "B" ? "Get a Free Quote" : "Request a Quote"}
                    </a>
                    <a className="btn btnSecondary" href="#services">
                      View Services
                    </a>
                  </div>

                  <div className={styles.badgeRow}>
                    {content.badges.map((b) => (
                      <div key={b.title} className={`card ${styles.badge}`}>
                        <div className={styles.badgeTitle}>{b.title}</div>
                        <div className={styles.badgeDesc}>{b.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section
          id="services"
          className={`section ${theme === "B" ? "" : "sectionAlt"} ${styles.servicesWrap} ${styles["services" + theme]}`}
          style={{ ["--hero-bg" as any]: `url(${heroImg})` } as any}
        >
          <div className="container">
            <div className={styles.sectionHead}>
              <div className={styles.kicker} />
              <div>
                <h2 className="h2">Services</h2>
                <p className="p">What we offer — simple and clear.</p>
              </div>
            </div>

            <div className={styles.servicesGrid}>
              {content.services.map((s) => (
                <div key={s.title} className={`card ${styles.serviceCard}`}>
                  <div className={styles.serviceTitle}>{s.title}</div>
                  <div className={styles.serviceDesc}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className={`section ${styles.aboutWrap} ${styles["about" + theme]}`}>
          <div className="container">
            <div
              className={styles.aboutPanel}
              style={{ ["--about-bg" as any]: `url(${aboutImg})` } as any}
            >
              <div className={styles.aboutInner}>
                <div className={styles.sectionHead}>
                  <div className={styles.kicker} />
                  <div>
                    <h2 className="h2">About</h2>
                    <p className="p">{content.aboutTitle}</p>
                  </div>
                </div>

                <div className={`card ${styles.aboutCard}`}>
                  {content.aboutBody.split("\n").map((line, i) => (
                    <p key={i} className="p" style={{ marginTop: i === 0 ? 0 : 12 }}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section">
          <div className="container">
            <div className={styles.sectionHead}>
              <div className={styles.kicker} />
              <div>
                <h2 className="h2">FAQ</h2>
                <p className="p">Quick answers to common questions.</p>
              </div>
            </div>

            <Accordion items={content.faq.map((x) => ({ title: x.q, body: x.a }))} />
          </div>
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className={`section sectionAlt ${styles.contactWrap} ${styles["contact" + theme]}`}
          style={{ ["--hero-bg" as any]: `url(${heroImg})` } as any}
        >
          <div className="container">
            <div className={styles.sectionHead}>
              <div className={styles.kicker} />
              <div>
                <h2 className="h2">Contact</h2>
                <p className="p">Fast response and clear next steps.</p>
              </div>
            </div>

            <div className={`card ${styles.contactCard}`}>
              <div className={styles.contactRow}>
                <div className={styles.contactLabel}>Phone</div>
                <a
                  className={styles.contactValue}
                  href={`tel:${content.phone.replace(/[^0-9+]/g, "")}`}
                >
                  {content.phone}
                </a>
              </div>
              <div className={styles.contactRow}>
                <div className={styles.contactLabel}>Service area</div>
                <div className={styles.contactValue}>{content.serviceArea}</div>
              </div>
              <div className={styles.contactRow}>
                <div className={styles.contactLabel}>Email</div>
                <a className={styles.contactValue} href={`mailto:${content.email}`}>
                  {content.email}
                </a>
              </div>

              <div className={styles.ctaLine}>
                Want this website for your business? <b>One-time price: $129 CAD.</b>
              </div>

              <div className={styles.contactActions}>
                <a
                  className="btn btnPrimary"
                  href={`/checkout?template=electrician&theme=${theme}`}
                >
                  Buy / Get Started
                </a>
                <a className="btn btnSecondary" href="/templates">
                  View templates
                </a>
              </div>
            </div>

            <div className={styles.footer}>
              © {new Date().getFullYear()} {content.businessName}
            </div>
          </div>
        </section>
      </div>
    </ElectricianSiteLayout>
  );
}
