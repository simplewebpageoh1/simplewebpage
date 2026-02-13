import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Seo from "../../components/seo/Seo";

export default function ThankYou() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const plan = (params.get("plan") ?? "").toLowerCase();
  const from = params.get("from") ?? "";

  const stripeBasic = import.meta.env.VITE_STRIPE_PAYMENT_LINK_BASIC as
    | string
    | undefined;
  const stripePlus = import.meta.env.VITE_STRIPE_PAYMENT_LINK_PLUS as
    | string
    | undefined;

  const template = params.get("template") ?? "";
  const paid = params.get("paid") ?? "";
  const source = params.get("source") ?? "";

  const baseIntakeUrl = template ? `/intake?template=${template}` : "/intake";
  const intakeUrl = source
    ? `${baseIntakeUrl}${baseIntakeUrl.includes("?") ? "&" : "?"}source=${encodeURIComponent(source)}`
    : baseIntakeUrl;

  const isPaid = paid === "1" || source === "stripe";

  useEffect(() => {
    if (!isPaid) return;
    const t = setTimeout(() => {
      window.location.href = intakeUrl;
    }, 2500);
    return () => clearTimeout(t);
  }, [isPaid, intakeUrl]);

  const headline = isPaid ? "Order confirmed 🎉" : "Message received ✅";
  const pageTitle = isPaid
    ? "Order Confirmed | SimpleWebPage"
    : "Thank You | SimpleWebPage";

  let intro = "";
  if (isPaid) {
    intro =
      "Payment received. Next, please fill out the setup form below to start building your site.";
  } else if (from === "contact") {
    intro =
      "Thanks — we received your details. Next step: complete payment below to start your build.";
  } else {
    intro = "Thanks — we received your message. We’ll reply within 24 hours.";
  }

  const showPaymentCard =
    from === "contact" && !isPaid && (plan === "basic" || plan === "plus");
  const showSetupButton = !(from === "contact" && !isPaid);

  return (
    <>
      <Seo
        title={pageTitle}
        description="Thanks — we received your submission. Next, please follow the steps on this page."
        path="/thank-you"
      />
      <main style={{ padding: 48 }}>
        <div className="container">
          <h1>{headline}</h1>
          <p style={{ marginTop: 12, opacity: 0.9, lineHeight: 1.6 }}>
            {intro}
          </p>

          {showPaymentCard && (
            <div
              style={{
                marginTop: 20,
                padding: 18,
                borderRadius: 14,
                border: "1px solid rgba(0,0,0,.1)",
                background: "#fff",
              }}
            >
              <h3>Step 2: Complete Payment</h3>
              <p style={{ marginTop: 8 }}>
                To start building your website, please complete your payment
                below.
              </p>

              {plan === "basic" && stripeBasic && (
                <a
                  href={stripeBasic}
                  style={{
                    display: "inline-block",
                    marginTop: 12,
                    padding: "10px 16px",
                    background: "#111",
                    color: "#fff",
                    borderRadius: 10,
                    textDecoration: "none",
                  }}
                >
                  Pay $99 — Basic
                </a>
              )}

              {plan === "plus" && stripePlus && (
                <a
                  href={stripePlus}
                  style={{
                    display: "inline-block",
                    marginTop: 12,
                    padding: "10px 16px",
                    background: "#111",
                    color: "#fff",
                    borderRadius: 10,
                    textDecoration: "none",
                  }}
                >
                  Pay $129 — Plus
                </a>
              )}

              {/* Stripe 링크가 없으면 운영자가 바로 알아차리게 */}
              {(plan === "basic" && !stripeBasic) ||
              (plan === "plus" && !stripePlus) ? (
                <p style={{ marginTop: 10, opacity: 0.8 }}>
                  Payment link is not configured yet. Please contact us.
                </p>
              ) : null}
            </div>
          )}

          <div
            style={{
              marginTop: 12,
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
                We’ll review your information within <strong>24 hours</strong>.
              </li>
              <li>
                Your site will <strong>go live within 24–48 hours</strong> after
                review.
              </li>
              <li>You’ll receive an email once your site is live.</li>
            </ul>
            <div style={{ marginTop: 8, opacity: 0.9 }}>
              Please check your email for updates.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              marginTop: 18,
            }}
          >
            {showSetupButton && (
              <Link
                to={intakeUrl}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,.18)",
                  textDecoration: "none",
                }}
              >
                Open Setup Form
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
