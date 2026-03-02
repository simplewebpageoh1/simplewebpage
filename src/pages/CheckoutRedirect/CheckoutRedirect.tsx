import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../../components/seo/Seo";
import { normalizeTheme, themeLabel } from "../../lib/theme";

function titleCase(s: string) {
  return s
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

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
    const t = template ? titleCase(template) : "Template";
    return `You are ordering the ${t} — ${themeLabel(theme)}`;
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
    <main style={{ padding: 48 }}>
      <Seo title="Checkout" description="Secure checkout." path="/checkout" />
      <div className="container">
        <h1>Checkout</h1>
        <p style={{ marginTop: 12, lineHeight: 1.6, opacity: 0.9 }}>
          <strong>{label}</strong>
          <br />
          One-time base price: <b>${basePrice} CAD</b>.
        </p>

        <div
          style={{
            marginTop: 16,
            padding: 14,
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,.08)",
            background: "rgba(0,0,0,.03)",
            lineHeight: 1.65,
          }}
        >
          After payment, you&apos;ll fill out a short setup form (Intake) so we can build
          your site.
        </div>

        <div style={{ marginTop: 22 }}>
          <h2 style={{ margin: 0, fontSize: 18 }}>Optional add-ons</h2>
          <p style={{ marginTop: 6, opacity: 0.85, lineHeight: 1.5 }}>
            Add-ons are optional. If selected, they will be included in the checkout total.
          </p>

          <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
            {ADDONS.map((a) => (
              <label
                key={a.key}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: 12,
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,.10)",
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={selected[a.key]}
                  onChange={(e) =>
                    setSelected((s) => ({ ...s, [a.key]: e.target.checked }))
                  }
                  style={{ marginTop: 4 }}
                />
                <div>
                  <div style={{ fontWeight: 800 }}>
                    {a.title} (+${a.priceCad})
                  </div>
                  <div style={{ marginTop: 4, opacity: 0.85, lineHeight: 1.45 }}>
                    {a.desc}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div
            style={{
              marginTop: 14,
              paddingTop: 14,
              borderTop: "1px solid rgba(0,0,0,.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ fontWeight: 900, fontSize: 18 }}>Total: ${total} CAD</div>
            <button
              type="button"
              onClick={startCheckout}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "12px 18px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Continue to secure payment
            </button>
          </div>

          {error && (
            <div
              role="alert"
              style={{
                marginTop: 12,
                padding: 12,
                borderRadius: 12,
                border: "1px solid rgba(220,38,38,.25)",
                background: "rgba(220,38,38,.06)",
                lineHeight: 1.5,
              }}
            >
              <strong>Payment error:</strong> {error}
              <div style={{ marginTop: 8 }}>
                If you prefer, you can <Link to={contactTo}>contact us</Link>.
              </div>
            </div>
          )}
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to={template ? `/demo/${template}` : "/templates"}>← Back</Link>
          <Link to={contactTo}>Contact instead</Link>
        </div>

        <div style={{ marginTop: 18, opacity: 0.8, lineHeight: 1.5 }}>
          Note: taxes are handled in Stripe depending on your tax settings.
        </div>
      </div>
    </main>
  );
}
