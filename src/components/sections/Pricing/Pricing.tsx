// src/components/sections/Pricing/Pricing.tsx

import { Link } from "react-router-dom";
import styles from "./Pricing.module.scss";
import { trackEvent } from "../../../utils/analytics";

export default function Pricing() {
  return (
    <section className={styles.pricing}>
      <div className="container">
        <h2 className={styles.title}>One-Time Price</h2>
        <p className={styles.subtitle}>
          One-time $129 for a one-page website. No subscriptions.
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.planName}>One-Page Website</div>
            <div className={styles.price}>$129 CAD</div>

            <ul className={styles.list}>
              <li>Choose an industry + theme A/B/C</li>
              <li>Looks great on mobile & desktop</li>
              <li>SEO title &amp; description setup</li>
              <li>Preview link included</li>
              <li>1 round of small text edits</li>
              <li>Domain &amp; hosting guide</li>
            </ul>

            <p className={styles.note} style={{ marginTop: 10 }}>
              <strong>Not included:</strong> Major layout changes, logo design, full copywriting.
            </p>

            <div className={styles.btnRow}>
              <Link
                to="/templates"
                className={styles.primaryBtn}
                onClick={() =>
                  trackEvent("cta_view_templates", {
                    location: "pricing",
                  })
                }
              >
                Preview
              </Link>
              <Link
                to="/templates"
                className={styles.secondaryBtn}
                onClick={() => {
                  trackEvent("cta_choose_template", {
                    location: "pricing",
                    method: "templates",
                  });
                }}
              >
                Choose Template
              </Link>
            </div>

            <div className={styles.buyHint}>
              Template-based one-page setup • 24–48h delivery • 1 revision included
            </div>

            <p className={styles.finePrint}>
              Optional add-ons can be selected at checkout.
            </p>
          </div>
        </div>

        <div className={styles.disclaimerBox}>
          <h3 className={styles.disclaimerTitle}>What’s included</h3>
          <ul className={styles.disclaimerList}>
            <li>1-page website setup (template-based)</li>
            <li>Mobile optimized</li>
            <li>Your phone/email + service areas + services added</li>
            <li>Basic SEO (title/description)</li>
          </ul>

          <h3 className={styles.disclaimerTitle}>Timeline &amp; revisions</h3>
          <ul className={styles.disclaimerList}>
            <li>Delivery: <b>24–48 hours</b> after intake submitted</li>
            <li><b>1 revision round</b> included</li>
            <li>Add-ons available (extra pages, custom features)</li>
          </ul>

          <div className={styles.disclaimerFine}>
            By clicking “Choose Template”, you agree this is a <b>template-based setup service</b>, not a fully custom build.
          </div>
        </div>

        <div className={styles.commonRow}>
          <div className={styles.commonCard}>
            <div className={styles.commonTitle}>Optional add-ons</div>
            <ul className={styles.commonList}>
              <li>
                <strong>Google Business Profile setup (+$79)</strong>
                <br />
                Profile setup and basic optimization. Verification by owner required.
              </li>
              <li>
                <strong>Review request message setup (+$39)</strong>
                <br />
                Simple message template to help you collect more Google reviews.
              </li>
              <li>Copy refinement (+$49)</li>
              <li>Domain connection — done for you (+$49)</li>
              <li>Additional revisions / small changes (+$39)</li>
            </ul>
            <p className={styles.stripeNote}>
              Secure checkout powered by Stripe. Credit cards accepted.
            </p>
          </div>

          <div className={styles.commonCard}>
            <div className={styles.commonTitle}>Quick FAQ</div>

            <details className={styles.faqItem}>
              <summary>How long does setup take?</summary>
              <p>Most websites are ready within 24–48 hours after we receive your intake form.</p>
            </details>

            <details className={styles.faqItem}>
              <summary>Do I need technical skills?</summary>
              <p>No. We build and publish your website for you. You only provide your business details.</p>
            </details>

            <details className={styles.faqItem}>
              <summary>Can you connect my domain?</summary>
              <p>Yes. You can follow our guide, or we can handle it for you for +$49.</p>
            </details>

            <p className={styles.note} style={{ marginTop: 12 }}>
              Tip: Preview a demo first. Setup starts immediately after checkout.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
