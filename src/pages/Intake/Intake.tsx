// src/pages/Intake/Intake.tsx
// ✅ 구매 후 '사업 정보/문구' 제출 폼(Intake Form)
// - Netlify Forms 사용

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Seo from "../../components/seo/Seo";
import { normalizeTheme, themeLabel } from "../../lib/theme";
import styles from "./Intake.module.scss";

type AddonKey =
  | "google_business"
  | "review_request"
  | "copy_refinement"
  | "domain_connection"
  | "extra_revisions";

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

function parseAddons(csv: string): Set<AddonKey> {
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

export default function Intake() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);

  // URL params (from Stripe success_url)
  const template = params.get("template") ?? "";
  const theme = normalizeTheme(params.get("theme"));
  const addonsCsv = params.get("addons") ?? "";

  const addonsFromUrl = useMemo(() => parseAddons(addonsCsv), [addonsCsv]);

  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [services, setServices] = useState("");
  const [about, setAbout] = useState("");
  const [logoLink, setLogoLink] = useState("");
  const [notes, setNotes] = useState("");
  const [layoutOrderRequest, setLayoutOrderRequest] = useState("");

  // ✅ Add-ons (reflect what was paid)
  const [addonCopywriting, setAddonCopywriting] = useState(false);
  const [addonDomainConnection, setAddonDomainConnection] = useState(false);
  const [addonExtraRevisions, setAddonExtraRevisions] = useState(false);
  const [addonGoogleBusiness, setAddonGoogleBusiness] = useState(false);
  const [addonReviewRequest, setAddonReviewRequest] = useState(false);

  useEffect(() => {
    // ✅ Pre-check paid add-ons.
    // If the user already checked something (true), keep it.
    // If checkout URL says it was purchased, ensure it becomes checked.
    setAddonGoogleBusiness((v) => v || addonsFromUrl.has("google_business"));
    setAddonReviewRequest((v) => v || addonsFromUrl.has("review_request"));
    setAddonCopywriting((v) => v || addonsFromUrl.has("copy_refinement"));
    setAddonDomainConnection((v) => v || addonsFromUrl.has("domain_connection"));
    setAddonExtraRevisions((v) => v || addonsFromUrl.has("extra_revisions"));
  }, [addonsFromUrl]);

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const formData: Record<string, string> = {
      "form-name": "intake",
      template,
      theme,
      addons: addonsCsv,
      businessName,
      tagline,
      serviceArea,
      phone,
      email,
      services,
      about,
      logoLink,
      notes,
      layoutOrderRequest,

      addonCopywriting: addonCopywriting ? "yes" : "no",
      addonDomainConnection: addonDomainConnection ? "yes" : "no",
      addonExtraRevisions: addonExtraRevisions ? "yes" : "no",
      addonGoogleBusiness: addonGoogleBusiness ? "yes" : "no",
      addonReviewRequest: addonReviewRequest ? "yes" : "no",
    };

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(formData),
      });

      if (!res.ok) throw new Error("Intake submit failed");

      // 제출 후 Thank You로
      const ty = new URLSearchParams();
      ty.set("paid", "true");
      if (template) ty.set("template", template);
      ty.set("theme", theme);
      if (addonsCsv) ty.set("addons", addonsCsv);
      navigate(`/thank-you?${ty.toString()}`);
    } catch (err) {
      alert("Submission failed. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <Seo
        title="Website Setup Form | Submit Your Business Info"
        description="Submit your business info to set up your one-page website template."
        path="/intake"
      />

      <div className="container">
        <h1 className={styles.title}>Website setup form</h1>
        <p className={styles.subtitle}>
          Fill this out once — it helps us build your website faster.
        </p>

        <div className={styles.badgeRow}>
          {template ? (
            <span className={styles.badge}>
              Template: <strong>{template}</strong>
            </span>
          ) : null}
          <span className={styles.badge}>
            Theme: <strong>{themeLabel(theme)}</strong>
          </span>
        </div>

        {!template ? (
          <div className={styles.notice}>
            Missing template info. Please go back to Templates and start from checkout.
          </div>
        ) : null}

        <form
          name="intake"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="intake" />

          {/* honeypot */}
          <p style={{ display: "none" }}>
            <label>
              Don’t fill this out if you're human: <input name="bot-field" />
            </label>
          </p>

          <label className={styles.label}>
            Business name
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              placeholder="e.g., ABC Electric"
            />
          </label>

          <label className={styles.label}>
            Tagline (short)
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g., Licensed · Insured · Fast response"
            />
          </label>

          <label className={styles.label}>
            Service area
            <input
              value={serviceArea}
              onChange={(e) => {
                const v = e.target.value;
                setServiceArea(v);
                try {
                  localStorage.setItem("intake:serviceArea", v);
                } catch {
                  // ignore
                }
              }}
              required
              placeholder="e.g., Calgary, Airdrie, Okotoks"
            />
          </label>

          <div className={styles.row2}>
            <label className={styles.label}>
              Phone
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="e.g., 403-123-4567"
              />
            </label>

            <label className={styles.label}>
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g., info@simplewebpageoh.com"
              />
            </label>
          </div>

          <label className={styles.label}>
            Services (list)
            <textarea
              value={services}
              onChange={(e) => setServices(e.target.value)}
              required
              rows={6}
              placeholder={"Example:\n- Panel upgrades\n- Lighting\n- EV charger installs"}
            />
          </label>

          {/* Add-ons */}
          <div className={styles.addonsBlock}>
            <div className={styles.addonsTitle}>Add-ons</div>
            <p className={styles.addonsHint}>
              If you selected add-ons at checkout, they should already be checked here.
            </p>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                name="addonGoogleBusiness"
                checked={addonGoogleBusiness}
                onChange={(e) => setAddonGoogleBusiness(e.target.checked)}
              />
              <span>Google Business Profile setup (+$79)</span>
            </label>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                name="addonReviewRequest"
                checked={addonReviewRequest}
                onChange={(e) => setAddonReviewRequest(e.target.checked)}
              />
              <span>Review request message setup (+$39)</span>
            </label>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                name="addonCopywriting"
                checked={addonCopywriting}
                onChange={(e) => setAddonCopywriting(e.target.checked)}
              />
              <span>Copy refinement (+$49)</span>
            </label>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                name="addonDomainConnection"
                checked={addonDomainConnection}
                onChange={(e) => setAddonDomainConnection(e.target.checked)}
              />
              <span>Domain connection — done for you (+$49)</span>
            </label>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                name="addonExtraRevisions"
                checked={addonExtraRevisions}
                onChange={(e) => setAddonExtraRevisions(e.target.checked)}
              />
              <span>Additional revisions / small changes (+$39)</span>
            </label>
          </div>

          <label className={styles.label}>
            About (2–5 sentences)
            <textarea
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              rows={6}
              placeholder="Tell customers who you are and what you do."
            />
          </label>

          <label className={styles.label}>
            Logo link (optional)
            <input
              value={logoLink}
              onChange={(e) => setLogoLink(e.target.value)}
              placeholder="Paste a link to your logo (Google Drive/Dropbox/etc.)"
            />
          </label>

          <label className={styles.label}>
            Notes (optional)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Anything else we should know?"
            />
          </label>

          <label className={styles.label}>
            Layout order request (optional)
            <input
              value={layoutOrderRequest}
              onChange={(e) => setLayoutOrderRequest(e.target.value)}
              placeholder="e.g., hero > services > about > contact"
            />
          </label>

          <button className={styles.submit} type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </main>
  );
}
