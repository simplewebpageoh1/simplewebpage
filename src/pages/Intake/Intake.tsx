// src/pages/Intake/Intake.tsx
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Seo from "../../components/seo/Seo";
import { fullThemeLabel, normalizeTheme, templateLabel } from "../../lib/theme";
import styles from "./Intake.module.scss";

type AddonKey =
  | "google_business"
  | "review_request"
  | "copy_refinement"
  | "domain_connection"
  | "extra_revisions";

const ADDON_LABELS: Record<AddonKey, string> = {
  google_business: "Google Business Profile setup (+$79)",
  review_request: "Review request message setup (+$39)",
  copy_refinement: "Copy refinement (+$49)",
  domain_connection: "Domain connection — done for you (+$49)",
  extra_revisions: "Additional revisions / small changes (+$39)",
};

function parseAddons(raw: string): AddonKey[] {
  const list = (raw || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const allow: AddonKey[] = [
    "google_business",
    "review_request",
    "copy_refinement",
    "domain_connection",
    "extra_revisions",
  ];

  const set = new Set<AddonKey>();
  for (const a of list) {
    if (allow.includes(a as AddonKey)) set.add(a as AddonKey);
  }
  return [...set];
}

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
}

async function submitToNetlifyForms(formData: Record<string, string>) {
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode(formData),
  });
  if (!res.ok) throw new Error("Netlify form submit failed");
}

export default function Intake() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  const templateFromQuery = params.get("template") ?? "";
  const theme = normalizeTheme(params.get("theme"));
  const addonsRaw = params.get("addons") ?? "";

  const INDUSTRY_OPTIONS = ["electrician", "plumbing", "roofing", "cleaning", "handyman"] as const;
  type IndustryOption = (typeof INDUSTRY_OPTIONS)[number];

  const template = useMemo<IndustryOption>(() => {
    return INDUSTRY_OPTIONS.includes(templateFromQuery as any)
      ? (templateFromQuery as IndustryOption)
      : "electrician";
  }, [templateFromQuery]);



  // ✅ checkout에서 넘어온 addons만 "읽기 전용"으로 표시
  const addonsList = useMemo(() => parseAddons(addonsRaw), [addonsRaw]);
  const addonsSet = useMemo(() => new Set(addonsList), [addonsList]);

  const hasGoogleBusiness = addonsSet.has("google_business");
  const hasReviewRequest = addonsSet.has("review_request");
  const hasCopyRefinement = addonsSet.has("copy_refinement");
  const hasDomainConnection = addonsSet.has("domain_connection");
  const hasExtraRevisions = addonsSet.has("extra_revisions");

  const addonsDisplay = useMemo(() => {
    if (!addonsList.length) return "None";
    return addonsList.map((k) => ADDON_LABELS[k]).join(" | ");
  }, [addonsList]);

  // ----- form fields
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [services, setServices] = useState("");
  const [about, setAbout] = useState("");
  const [logoLink, setLogoLink] = useState("");
  const [notes, setNotes] = useState("");
  const [layoutOrderRequest, setLayoutOrderRequest] = useState("");

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const netlifyFormData: Record<string, string> = {
        "form-name": "intake",

        template,
        theme,
        addons: addonsList.join(","),

        businessName,
        contactName,
        email,
        phone,
        services,
        about,
        logoLink,
        notes,
        layoutOrderRequest,

        // ✅ 체크아웃에서 결제된 addons 상태(읽기 전용 표시값)도 저장
        addon_google_business: hasGoogleBusiness ? "yes" : "no",
        addon_review_request: hasReviewRequest ? "yes" : "no",
        addon_copy_refinement: hasCopyRefinement ? "yes" : "no",
        addon_domain_connection: hasDomainConnection ? "yes" : "no",
        addon_extra_revisions: hasExtraRevisions ? "yes" : "no",

        addonsDisplay,
      };

      await submitToNetlifyForms(netlifyFormData);

      // ✅ Intake 제출 후 ThankYou로 이동
      // paid=1은 유지하되 from=intake를 붙여서 ThankYou가 Intake로 다시 리다이렉트 하지 않게 함
      const qs = new URLSearchParams();
      if (template) qs.set("template", template);
      if (theme) qs.set("theme", theme);
      if (addonsList.length) qs.set("addons", addonsList.join(","));
      qs.set("paid", "1");
      qs.set("from", "intake");

      navigate(`/thank-you?${qs.toString()}`);
    } catch (err) {
      console.error(err);
      alert("Submit failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Setup Form | SimpleWebPageOH"
        description="Tell us what to put on your one-page website."
        path="/intake"
      />

      <main className={styles.page}>
        <div className="container">
          <h1 className={styles.title}>Setup Form</h1>

          <div className={styles.summary}>
            <div>
              <strong>Template:</strong> {templateLabel(template) || "—"}
            </div>
            <div>
              <strong>Theme:</strong> {fullThemeLabel(theme) || "—"}
            </div>
            <div>
              <strong>Add-ons (paid):</strong> {addonsDisplay}
            </div>
          </div>

          {/* ✅ Netlify가 폼을 “인식”하도록 */}
          <form
            className={styles.form}
            name="intake"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="form-name" value="intake" />
            <p style={{ display: "none" }}>
              <label>
                Don’t fill this out if you're human: <input name="bot-field" />
              </label>
            </p>

            {/* 쿼리 전달값도 hidden으로 남겨두면 Netlify record 보기 편함 */}
            <input type="hidden" name="template" value={template} />
            <input type="hidden" name="theme" value={theme} />
            <input type="hidden" name="addons" value={addonsList.join(",")} />
            <input type="hidden" name="addonsDisplay" value={addonsDisplay} />

            <div className={styles.row2}>
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
                Contact name
                <input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  placeholder="Your name"
                />
              </label>
            </div>

            <div className={styles.row2}>
              <label className={styles.label}>
                Email
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="e.g., young@simplewebpageoh.com"
                />
              </label>

              <label className={styles.label}>
                Phone
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., (403) 000-0000"
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
                placeholder={
                  "Example:\n- Panel upgrades\n- Lighting\n- EV charger installs"
                }
              />
            </label>

            {/* ✅ Add-ons (읽기 전용 표시만) */}
            <div className={styles.addonsBlock}>
              <div className={styles.addonsTitle}>Add-ons (paid)</div>
              <p className={styles.addonsHint}>
                These are selected at checkout. (Read-only for now)
              </p>

              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  name="addon_google_business"
                  checked={hasGoogleBusiness}
                  readOnly
                  disabled
                />
                <span>{ADDON_LABELS.google_business}</span>
              </label>

              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  name="addon_review_request"
                  checked={hasReviewRequest}
                  readOnly
                  disabled
                />
                <span>{ADDON_LABELS.review_request}</span>
              </label>

              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  name="addon_copy_refinement"
                  checked={hasCopyRefinement}
                  readOnly
                  disabled
                />
                <span>{ADDON_LABELS.copy_refinement}</span>
              </label>

              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  name="addon_domain_connection"
                  checked={hasDomainConnection}
                  readOnly
                  disabled
                />
                <span>{ADDON_LABELS.domain_connection}</span>
              </label>

              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  name="addon_extra_revisions"
                  checked={hasExtraRevisions}
                  readOnly
                  disabled
                />
                <span>{ADDON_LABELS.extra_revisions}</span>
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

            <button
              className={styles.submit}
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}