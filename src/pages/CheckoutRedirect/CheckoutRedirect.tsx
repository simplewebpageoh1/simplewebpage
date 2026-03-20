import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../../components/seo/Seo";
import { fullThemeLabel, getDemoPath, normalizeTheme, templateLabel } from "../../lib/theme";
import styles from "./CheckoutRedirect.module.scss";

type AddonKey =
  | "google_business"
  | "review_request"
  | "copy_refinement"
  | "domain_connection"
  | "extra_revisions";

const ADDONS: Array<{
  key: AddonKey;
  title: string;
  priceCad: number;
  desc: string;
}> = [
  {
    key: "google_business",
    title: "Google Business Profile setup",
    priceCad: 79,
    desc: "Profile setup and basic optimization. Verification by owner required.",
  },
  {
    key: "review_request",
    title: "Review request message setup",
    priceCad: 39,
    desc: "Simple message template to help you collect more Google reviews.",
  },
  {
    key: "copy_refinement",
    title: "Copy refinement",
    priceCad: 49,
    desc: "We refine your wording to be clearer and more persuasive.",
  },
  {
    key: "domain_connection",
    title: "Domain connection — done for you",
    priceCad: 49,
    desc: "We connect your domain to your site for you.",
  },
  {
    key: "extra_revisions",
    title: "Additional revisions / small changes",
    priceCad: 39,
    desc: "A small bundle of extra edits after the first revision.",
  },
];

function parseAddonsCsv(csv: string): Set<AddonKey> {
  const out = new Set<AddonKey>();
  csv
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .forEach((s) => {
      if (
        s === "google_business" ||
        s === "review_request" ||
        s === "copy_refinement" ||
        s === "domain_connection" ||
        s === "extra_revisions"
      ) {
        out.add(s);
      }
    });
  return out;
}

export default function CheckoutRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const template = params.get("template") ?? "";
  const theme = normalizeTheme(params.get("theme"));
  const addonsCsvFromQuery = params.get("addons") ?? "";

  const label = useMemo(() => {
    const t = templateLabel(template);
    return `You are ordering the ${t} — ${fullThemeLabel(theme)}`;
  }, [template, theme]);

  const selectedFromQuery = useMemo(() => parseAddonsCsv(addonsCsvFromQuery), [addonsCsvFromQuery]);

  const [selected, setSelected] = useState<Record<AddonKey, boolean>>({
    google_business: selectedFromQuery.has("google_business"),
    review_request: selectedFromQuery.has("review_request"),
    copy_refinement: selectedFromQuery.has("copy_refinement"),
    domain_connection: selectedFromQuery.has("domain_connection"),
    extra_revisions: selectedFromQuery.has("extra_revisions"),
  });


  const addonsCsvCurrent = useMemo(() => {
    const addons = ADDONS.filter((a) => selected[a.key]).map((a) => a.key);
    return addons.join(",");
  }, [selected]);

  const contactTo = useMemo(() => {
    if (!template) return "/contact";
    const qs = new URLSearchParams();
    qs.set("template", template);
    qs.set("theme", theme);
    if (addonsCsvCurrent) qs.set("addons", addonsCsvCurrent);
    return `/contact?${qs.toString()}`;
  }, [template, theme, addonsCsvCurrent]);

  const basePrice = 129;
  const addonsTotal = useMemo(() => {
    return ADDONS.reduce((sum, a) => sum + (selected[a.key] ? a.priceCad : 0), 0);
  }, [selected]);

  const total = basePrice + addonsTotal;

  const [error, setError] = useState<string>("");

  // If template isn't provided, send user back to templates.
  useEffect(() => {
    if (!template) {
      navigate("/templates", { replace: true });
    }
  }, [template, navigate]);

  async function startCheckout() {
    setError("");
    const addons = ADDONS.filter((a) => selected[a.key]).map((a) => a.key);

    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ template, theme, addons }),
    });

    if (!res.ok) {
      // Stay on checkout and show a clear error (local dev / env var / function not running)
      try {
        const j = (await res.json()) as any;
        setError(j?.error || "Checkout session failed.");
      } catch {
        setError("Checkout session failed. Make sure Netlify Functions are running and STRIPE_SECRET_KEY is set.");
      }
      return;
    }

    const data = (await res.json()) as { url?: string };
    if (data.url) window.location.href = data.url;
    else setError("Stripe did not return a checkout URL.");
  }

  return (
    <main className={styles.page}>
      <Seo title="Checkout" description="Secure checkout." path="/checkout" />
      <div className="container">
        <h1 className={styles.title}>Checkout</h1>
        <p className={styles.lead}>
          <strong>{label}</strong>
          <br />
          One-time base price: <b>${basePrice} CAD</b>.
        </p>

        <div className={styles.noticeBox}>
          After payment, you&apos;ll fill out a short setup form (Intake) so we can build
          your site.
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Optional add-ons</h2>
          <p className={styles.sectionHint}>
            Add-ons are optional. If selected, they will be included in the checkout total.
          </p>

          <div className={styles.addonsGrid}>
            {ADDONS.map((a) => (
              <label key={a.key} className={styles.addonCard}>
                <input
                  type="checkbox"
                  checked={selected[a.key]}
                  onChange={(e) =>
                    setSelected((s) => ({ ...s, [a.key]: e.target.checked }))
                  }
                  className={styles.addonCheck}
                />
                <div>
                  <div className={styles.addonTitle}>
                    {a.title} (+${a.priceCad})
                  </div>
                  <div className={styles.addonDesc}>
                    {a.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className={styles.totalBar}>
            <div className={styles.total}>Total: ${total} CAD</div>
            <button
              type="button"
              onClick={startCheckout}
              className={styles.payBtn}
            >
              Continue to secure payment
            </button>
          </div>

          {error && (
            <div role="alert" className={styles.errorBox}>
              <strong>Payment error:</strong> {error}
              <div className={styles.errorHint}>
                If you prefer, you can <Link to={contactTo}>contact us</Link>.
              </div>
            </div>
          )}
        </section>

        <div className={styles.backRow}>
          <Link to={template ? getDemoPath(template, theme) : "/templates"}>← Back</Link>
          <Link to={contactTo}>Contact instead</Link>
        </div>

        <div className={styles.taxHint}>
          Note: taxes are handled in Stripe depending on your tax settings.
        </div>
      </div>
    </main>
  );
}
