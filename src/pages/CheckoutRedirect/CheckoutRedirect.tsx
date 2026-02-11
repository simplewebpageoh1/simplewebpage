import { useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Seo from "../../components/seo/Seo";

function titleCase(s: string) {
  return s
    .split(/[-_\s]+/g)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type PlanId = "basic" | "plus";

function getStripeLink(plan: PlanId) {
  const basic =
    (import.meta.env.VITE_STRIPE_PAYMENT_LINK_BASIC as string | undefined) ??
    (import.meta.env.VITE_STRIPE_PAYMENT_LINK as string | undefined);
  const plus = import.meta.env.VITE_STRIPE_PAYMENT_LINK_PLUS as string | undefined;
  return plan === "plus" ? plus : basic;
}

export default function CheckoutRedirect() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const plan = (params.get("plan") as PlanId | null) ?? "basic";
  const template = params.get("template") ?? "";

  const stripeLink = useMemo(() => getStripeLink(plan), [plan]);

  const label = useMemo(() => {
    const t = template ? titleCase(template) : "Template";
    const p = plan === "plus" ? "Plus" : "Basic";
    return `You are ordering the ${t} — ${p} plan`;
  }, [template, plan]);

  useEffect(() => {
    // If no stripe link is configured, fall back to contact.
    if (!stripeLink) {
      const q = new URLSearchParams();
      if (template) q.set("template", template);
      q.set("plan", plan);
      navigate(`/contact?${q.toString()}`, { replace: true });
      return;
    }

    const t = window.setTimeout(() => {
      window.location.href = stripeLink;
    }, 800);

    return () => window.clearTimeout(t);
  }, [stripeLink, navigate, template, plan]);

  return (
    <main style={{ padding: 48 }}>
      <Seo title="Redirecting to checkout" description="Redirecting to secure checkout." path="/checkout" />
      <div className="container">
        <h1>Redirecting to secure checkout…</h1>
        <p style={{ marginTop: 12, lineHeight: 1.6, opacity: 0.9 }}>
          <strong>{label}</strong>
          <br />
          You’ll receive an email receipt after payment.
        </p>

        <div style={{ marginTop: 16, padding: 14, borderRadius: 14, border: "1px solid rgba(0,0,0,.08)", background: "rgba(0,0,0,.03)", lineHeight: 1.65 }}>
          Next, you’ll fill out a short setup form to start building your site.
        </div>

        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to={template ? `/demo/${template}` : "/templates"}>
            ← Back
          </Link>
          <Link to="/contact">Contact instead</Link>
        </div>
      </div>
    </main>
  );
}
