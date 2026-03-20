import { Link, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import Seo from "../../components/seo/Seo";
import { fullThemeLabel, normalizeTheme, templateLabel } from "../../lib/theme";
import styles from "./ThankYou.module.scss";

export default function ThankYou() {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const template = params.get("template") ?? "";
  const theme = normalizeTheme(params.get("theme"));
  const addons = params.get("addons") ?? "";

  const paid = (params.get("paid") ?? "").toLowerCase();
  const isPaid = paid === "1" || paid === "true" || paid === "yes";

  const from = (params.get("from") ?? "").toLowerCase();
  const isFromContact = from === "contact";
  const isFromIntake = from === "intake";

  const checkoutUrl = useMemo(() => {
    const u = new URL("/checkout", window.location.origin);
    if (template) u.searchParams.set("template", template);
    if (theme) u.searchParams.set("theme", theme);
    return u.pathname + u.search;
  }, [template, theme]);

  const intakeUrl = useMemo(() => {
    const u = new URL("/intake", window.location.origin);
    if (template) u.searchParams.set("template", template);
    if (theme) u.searchParams.set("theme", theme);
    if (addons) u.searchParams.set("addons", addons);
    return u.pathname + u.search;
  }, [template, theme, addons]);



  const selectionSummary = [
    template ? `Template: ${templateLabel(template)}` : "",
    theme ? `Theme: ${fullThemeLabel(theme)}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  // ✅ 결제 직후(Stripe success)일 때만 Intake로 자동 이동
  // ✅ Intake 제출 후 ThankYou로 온 경우(from=intake)는 자동 이동 금지 (루프 방지)
  useEffect(() => {
    if (!isPaid) return;
    if (isFromIntake) return;

    const t = window.setTimeout(() => {
      window.location.href = intakeUrl;
    }, 2000);

    return () => window.clearTimeout(t);
  }, [isPaid, isFromIntake, intakeUrl]);

  const pageTitle = isPaid
    ? "Order Confirmed | SimpleWebPageOH"
    : "Thank You | SimpleWebPageOH";

  const headline = isPaid
    ? isFromIntake
      ? "Setup form submitted ✅"
      : "Order confirmed 🎉"
    : "Message received ✅";

  const intro = isPaid
    ? isFromIntake
      ? "Thanks! We received your setup details. We’ll review and contact you within 24 hours."
      : "Payment received. Next, please fill out the setup form to start building your site."
    : "Thanks for reaching out. We’ll reply within 24 hours.";

  return (
    <>
      <Seo
        title={pageTitle}
        description="Thanks — next steps for your website order."
        path="/thank-you"
      />

      <main className={styles.page}>
        <div className="container">
          <h1 className={styles.title}>{headline}</h1>
          <p className={styles.intro}>
            {intro}
          </p>

          {selectionSummary && (
            <p className={styles.selection}>
              <strong>{selectionSummary}</strong>
            </p>
          )}

          {!isPaid && !isFromContact && (
            <div className={styles.notice}>
              If you haven&apos;t paid yet, please go to checkout from the
              Templates page.
            </div>
          )}

          {!isPaid && isFromContact && template && theme && (
            <div className={styles.inlineAction}>
              <Link to={checkoutUrl}>
                Or continue to secure checkout
              </Link>
            </div>
          )}

          <div className={styles.nextBox}>
            <strong>What happens next?</strong>
            <ul>
              <li>
                {isPaid
                  ? isFromIntake
                    ? "We’ll review your setup details and contact you by email."
                    : "Complete the setup (Intake) form so we can build your site."
                  : "Preview templates and complete checkout to start."}
              </li>
              <li>
                We’ll review your information within <strong>24 hours</strong>.
              </li>
              <li>
                Your site will <strong>go live within 24–48 hours</strong> after
                review.
              </li>
              <li>You’ll receive an email once your site is live.</li>
            </ul>
          </div>

          <div className={styles.actions}>
            {isPaid && (
              <Link to={intakeUrl} className={styles.btn}>
                <strong>Open Setup Form</strong>
              </Link>
            )}

            <a
              className={styles.btn}
              href="/Domain-Hosting-Guide.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Open Domain &amp; Hosting Guide (PDF)
            </a>

            <Link to="/templates" className={styles.btn}>
              View Templates
            </Link>
          </div>

          <div className={styles.backHome}>
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}
