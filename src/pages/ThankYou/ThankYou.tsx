import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Seo from "../../components/seo/Seo";

export default function ThankYou() {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const template = params.get("template") ?? "";
  const theme = (params.get("theme") ?? "A").toUpperCase();
  const addons = params.get("addons") ?? "";

  const paid = (params.get("paid") ?? "").toLowerCase();
  const isPaid = paid === "1" || paid === "true" || paid === "yes";

  const from = (params.get("from") ?? "").toLowerCase();
  const isFromContact = from === "contact";

  const checkoutUrl = useMemo(() => {
    const u = new URL("/checkout", window.location.origin);
    if (template) u.searchParams.set("template", template);
    if (theme) u.searchParams.set("theme", theme);
    // Contact is lead-only: Add-ons are selected in Checkout
    return u.pathname + u.search;
  }, [template, theme]);

  const intakeUrl = useMemo(() => {
    const u = new URL("/intake", window.location.origin);
    if (template) u.searchParams.set("template", template);
    if (theme) u.searchParams.set("theme", theme);
    if (addons) u.searchParams.set("addons", addons);
    return u.pathname + u.search;
  }, [template, theme, addons]);

  useEffect(() => {
    if (!isPaid) return;
    const t = window.setTimeout(() => {
      window.location.href = intakeUrl;
    }, 2500);
    return () => window.clearTimeout(t);
  }, [isPaid, intakeUrl]);

  const pageTitle = isPaid ? "Order Confirmed | SimpleWebPageOH" : "Thank You | SimpleWebPageOH";
  const headline = isPaid ? "Order confirmed 🎉" : "Message received ✅";
  const intro = isPaid
    ? "Payment received. Next, please fill out the setup form to start building your site."
    : "Thanks for reaching out. We’ll reply within 24 hours.";

  return (
    <>
      <Seo
        title={pageTitle}
        description="Thanks — next steps for your website order."
        path="/thank-you"
      />

      <main style={{ padding: 48 }}>
        <div className="container">
          <h1>{headline}</h1>
          <p style={{ marginTop: 12, opacity: 0.9, lineHeight: 1.6 }}>{intro}</p>

          {!isPaid && !isFromContact && (
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
              If you haven&apos;t paid yet, please go to checkout from the Templates page.
            </div>
          )}

          {!isPaid && isFromContact && template && theme && (
            <div style={{ marginTop: 14 }}>
              <Link
                to={checkoutUrl}
                style={{
                  display: "inline-block",
                  padding: "8px 12px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.18)",
                  textDecoration: "none",
                  opacity: 0.92,
                }}
              >
                Or continue to secure checkout
              </Link>
            </div>
          )}

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
            <strong>What happens next?</strong>
            <ul style={{ margin: "8px 0 0 18px" }}>
              <li>
                {isPaid
                  ? "Complete the setup (Intake) form so we can build your site."
                  : "Preview templates and complete checkout to start."}
              </li>
              <li>We’ll review your information within <strong>24 hours</strong>.</li>
              <li>Your site will <strong>go live within 24–48 hours</strong> after review.</li>
              <li>You’ll receive an email once your site is live.</li>
            </ul>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 18 }}>
            {isPaid && (
              <Link
                to={intakeUrl}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.18)",
                  textDecoration: "none",
                }}
              >
                <strong>Open Setup Form</strong>
              </Link>
            )}

            <a
              href="/Domain-Hosting-Guide.pdf"
              target="_blank"
              rel="noreferrer"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,.18)",
                textDecoration: "none",
              }}
            >
              Open Domain &amp; Hosting Guide (PDF)
            </a>

            <Link
              to="/templates"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,.18)",
                textDecoration: "none",
              }}
            >
              View Templates
            </Link>
          </div>

          <div style={{ marginTop: 24, opacity: 0.9 }}>
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}
