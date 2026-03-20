// src/pages/Contact/Contact.tsx
// ✅ 목표: Netlify Forms(기록) + SendGrid(이메일) 둘 다 성공시키기
// - 1) Netlify Forms: fetch("/") with x-www-form-urlencoded  (Dashboard 기록)
// - 2) Email notify: fetch("/.netlify/functions/send-contact") (관리자 메일 알림)
// - 이메일이 실패해도, Netlify 기록이 남으면 "문의는 접수됨"으로 처리(리드 유실 방지)

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import styles from "./Contact.module.scss";
import Seo from "../../components/seo/Seo";
import { normalizeTheme, fullThemeLabel, templateLabel, themeLabel } from "../../lib/theme";

type DemoOrderDraftV1 = {
  template?: string;
  updatedAt?: number;
};

type IndustryId =
  | "electrician"
  | "cleaning"
  | "handyman"
  | "plumbing"
  | "roofing"
  | "painting"
  | "landscaping"
  | "moving"
  | "personal_trainer"
  | "tutoring"
  | "beauty"
  | "other";

const INDUSTRY_OPTIONS: { id: IndustryId; label: string }[] = [
  { id: "electrician", label: "Electrician" },
  { id: "cleaning", label: "Cleaning" },
  { id: "handyman", label: "Handyman" },
  { id: "plumbing", label: "Plumbing" },
  { id: "roofing", label: "Roofing" },
  { id: "painting", label: "Painting" },
  { id: "landscaping", label: "Landscaping" },
  { id: "moving", label: "Moving" },
  { id: "personal_trainer", label: "Personal trainer" },
  { id: "tutoring", label: "Tutoring" },
  { id: "beauty", label: "Beauty / Salon" },
  { id: "other", label: "Other (type it)" },
];

function encode(data: Record<string, string>) {
  // ✅ application/x-www-form-urlencoded 형식으로 변환
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
}

async function submitToNetlifyForms(formData: Record<string, string>) {
  // ✅ Netlify Forms에 저장 (Dashboard 기록)
  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: encode(formData),
  });

  if (!res.ok) throw new Error("Netlify form submit failed");
}

async function notifyByEmail(payload: {
  name: string;
  email: string;
  message: string;
  theme?: string;
  template?: string;
  addons?: string[];
  industry?: string;
  industryId?: string;
  industryOther?: string;
  selectionSummary?: string;
  selectionJson?: any;
}) {
  // ✅ SendGrid 이메일 알림 (Netlify Function)
  const res = await fetch("/.netlify/functions/send-contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // send-contact가 { success: true } 를 준다는 전제
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data?.success) {
    const reason = data?.error || "Email notify failed";
    throw new Error(reason);
  }
}

export default function Contact() {
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);

  const from = params.get("from") ?? "";
  const templateFromQuery = params.get("template") ?? "";

  const themeFromQueryRaw = params.get("theme");
  const themeFromQuery = themeFromQueryRaw
    ? normalizeTheme(themeFromQueryRaw)
    : "";
  const themeLabelText = useMemo(
    () => themeLabel(themeFromQuery),
    [themeFromQuery],
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);

  const [draft, setDraft] = useState<DemoOrderDraftV1 | null>(null);

  const hasSelectionQuery = useMemo(() => {
    return Boolean(
      params.get("template") ||
      params.get("plan") ||
      params.get("color") ||
      params.get("font") ||
      params.get("customColor") ||
      params.get("industry"),
    );
  }, [location.search]);

  useEffect(() => {
    if (from === "nav" || from === "pricing" || from === "custom") {
      try {
        localStorage.removeItem("demoOrderDraft:v1");
        sessionStorage.removeItem("orderFlow:fromDemo");
      } catch {
        // ignore
      }
      setDraft(null);
    }

    // ✅ Custom inquiry: prefill message
    if (from === "custom") {
      setMessage((prev) =>
        prev?.trim()
          ? prev
          : "Hi, I’d like a quote for a custom website.\n\nBusiness name:\nIndustry:\nCity/Service area:\nPages needed (approx):\nAny examples/links:\nNotes:"
      );
    }

    const flowFlag = (() => {
      try {
        return sessionStorage.getItem("orderFlow:fromDemo") === "1";
      } catch {
        return false;
      }
    })();

    if (!hasSelectionQuery && !flowFlag) {
      setDraft(null);
    }

    try {
      const raw = localStorage.getItem("demoOrderDraft:v1");
      if (!raw) return;
      const parsed = JSON.parse(raw) as DemoOrderDraftV1;
      setDraft(parsed);
    } catch {
      // ignore
    }
  }, [from, hasSelectionQuery]);

  const selectedTemplate = templateFromQuery || draft?.template || "";

  const industryFromQuery = params.get("industry") ?? "";
  const initialIndustry = ((): IndustryId => {
    const t = (industryFromQuery || selectedTemplate || "").toLowerCase();
    const supported = INDUSTRY_OPTIONS.map((o) => o.id);
    if (supported.includes(t as any)) return t as IndustryId;
    return "other";
  })();

  const [industryId, setIndustryId] = useState<IndustryId>(initialIndustry);
  const [industryOther, setIndustryOther] = useState<string>("");
  const [industryTouched, setIndustryTouched] = useState(false);

  useEffect(() => {
    if (industryTouched) return;
    const t = (industryFromQuery || selectedTemplate || "").toLowerCase();
    const supported = INDUSTRY_OPTIONS.map((o) => o.id);
    if (supported.includes(t as any)) {
      setIndustryId(t as IndustryId);
      return;
    }
    setIndustryId("other");
  }, [industryTouched, industryFromQuery, selectedTemplate]);

  const industryLabel = useMemo(() => {
    if (industryId === "other")
      return industryOther.trim() ? industryOther.trim() : "Other";
    const found = INDUSTRY_OPTIONS.find((o) => o.id === industryId);
    return found ? found.label : industryId;
  }, [industryId, industryOther]);

  const selectionSummary = useMemo(() => {
    const parts: string[] = [];
    if (industryLabel) parts.push(`Industry: ${industryLabel}`);
    if (selectedTemplate) parts.push(`Template: ${templateLabel(selectedTemplate)}`);
    if (themeFromQuery) parts.push(`Theme: ${fullThemeLabel(themeFromQuery)}`);
    return parts.join(" | ");
  }, [industryLabel, selectedTemplate, themeFromQuery]);

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitting) return;
    setSubmitting(true);

    // ✅ Netlify Forms 저장용 payload
    const netlifyFormData: Record<string, string> = {
      "form-name": "contact",
      name,
      email,
      message,
      industryId,
      industryOther,
      industry: industryLabel,
      template: selectedTemplate,
      theme: themeFromQuery,
      selectionSummary,
      selectionJson: JSON.stringify(
        {
          industryId,
          industryOther,
          industry: industryLabel,
          template: selectedTemplate,
          theme: themeFromQuery,
        },
        null,
        0,
      ),
    };

    // ✅ Email 알림용 payload
    const emailPayload = {
      name,
      email,
      message,
      theme: themeFromQuery,
      template: selectedTemplate,
      addons: [],
      industry: industryLabel,
      industryId,
      industryOther,
      selectionSummary,
      selectionJson: {
        industryId,
        industryOther,
        industry: industryLabel,
        template: selectedTemplate,
        theme: themeFromQuery,
      },
    };

    try {
      // 1) Netlify Dashboard 기록은 "반드시" 남기기 (리드 유실 방지)
      await submitToNetlifyForms(netlifyFormData);

      // 2) 이메일은 실패해도 문의는 접수된 것으로 처리(옵션)
      try {
        await notifyByEmail(emailPayload);
      } catch (mailErr) {
        console.warn(
          "Email notify failed (but Netlify record saved):",
          mailErr,
        );
      }

      // 제출이 끝났으면 demo 초안 정리
      try {
        localStorage.removeItem("demoOrderDraft:v1");
        sessionStorage.removeItem("orderFlow:fromDemo");
      } catch {
        // ignore
      }

      const qs = new URLSearchParams();
      if (selectedTemplate) qs.set("template", selectedTemplate);
      if (themeFromQuery) qs.set("theme", themeFromQuery);
      qs.set("from", "contact");

      navigate(`/thank-you?${qs.toString()}`);
    } catch (err) {
      alert("Submission failed. Please try again in a moment.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Seo
        title="Contact | SimpleWebPage"
        description="Tell us about your business and we’ll reply within 24 hours."
        path="/contact"
      />

      <main
        className={styles.page}
        data-e-theme={
          templateFromQuery.toLowerCase() === "electrician"
            ? themeFromQuery
            : ""
        }
      >
        <div className="container">
          <h1 className={styles.title}>Contact</h1>

          <section className={styles.selectionCard} aria-label="Your selection">
            <div className={styles.selectionHeader}>
              <div>
                <div className={styles.selectionTitle}>Your selection</div>
                <div className={styles.selectionSub}>
                  If you came from a demo page, we’ll attach your selected
                  template details automatically.
                </div>
              </div>
              {selectionSummary ? (
                <span className={styles.pill}>Auto-filled</span>
              ) : (
                <span className={styles.pillMuted}>No selection</span>
              )}
            </div>

            <div className={styles.selectionGrid}>
              <div className={styles.selectionRow}>
                <div className={styles.selectionKey}>Industry</div>
                <div className={styles.selectionVal}>
                  <select
                    className={styles.selectSmall}
                    value={industryId}
                    onChange={(e) => {
                      const next = e.target.value as IndustryId;
                      setIndustryTouched(true);
                      setIndustryId(next);
                      if (next !== "other") setIndustryOther("");
                    }}
                  >
                    {INDUSTRY_OPTIONS.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {industryId === "other" && (
                <div className={styles.selectionRow}>
                  <div className={styles.selectionKey}>Other industry</div>
                  <div className={styles.selectionVal}>
                    <input
                      className={styles.inputSmall}
                      value={industryOther}
                      onChange={(e) => {
                        setIndustryTouched(true);
                        setIndustryOther(e.target.value);
                      }}
                      placeholder="e.g., plumbing, painting, roofing"
                    />
                  </div>
                </div>
              )}

              <div className={styles.selectionRow}>
                <div className={styles.selectionKey}>Template</div>
                <div className={styles.selectionVal}>
                  {selectedTemplate || "—"}
                </div>
              </div>

              <div className={styles.selectionRow}>
                <div className={styles.selectionKey}>Theme</div>
                <div className={styles.selectionVal}>
                  {themeLabelText || "—"}
                </div>
              </div>

              <div className={styles.selectionRow}>
                <div className={styles.selectionKey}>Base price</div>
                <div className={styles.selectionVal}>$129 CAD</div>
              </div>
            </div>
          </section>

          <p className={styles.desc}>
            Tell us about your business. We’ll reply within 24 hours.
          </p>

          <p className={styles.reassurance}>
            If you already paid via <strong>Stripe</strong>, a receipt will be
            emailed to you automatically.
            <br />
            After you submit this form, we’ll reply by email within 24 hours.
          </p>

          {/* ✅ Netlify가 폼을 “인식”하도록 속성은 유지 */}
          <form
            className={styles.form}
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
          >
            {/* ✅ Netlify 인식용 hidden input */}
            <input type="hidden" name="form-name" value="contact" />
            <p style={{ display: "none" }}>
              <label>
                Don’t fill this out if you're human: <input name="bot-field" />
              </label>
            </p>

            {/* 기록용 hidden들 */}
            <input type="hidden" name="industryId" value={industryId} />
            <input type="hidden" name="industryOther" value={industryOther} />
            <input type="hidden" name="industry" value={industryLabel} />
            <input type="hidden" name="template" value={selectedTemplate} />
            <input type="hidden" name="theme" value={themeFromQuery} />
            <input
              type="hidden"
              name="selectionSummary"
              value={selectionSummary}
            />
            <input
              type="hidden"
              name="selectionJson"
              value={JSON.stringify({
                industryId,
                industryOther,
                industry: industryLabel,
                template: selectedTemplate,
                theme: themeFromQuery,
              })}
            />

            <label className={styles.label}>
              Name
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </label>

            <label className={styles.label}>
              Email
              <input
                type="email"
                name="email"
                placeholder="info@simplewebpageoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className={styles.label}>
              Message
              <textarea
                name="message"
                placeholder="What type of business do you have?"
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </label>

            <div className={styles.noticeBox}>
              <p className={styles.noticeText}>
                We collect your information solely to provide a quote and build
                your website. We do not sell or share your data.
              </p>
              <label className={styles.checkRow}>
                <input
                  type="checkbox"
                  name="agree"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  required
                />
                <span>
                  I agree to the <Link to="/privacy">Privacy Policy</Link> and{" "}
                  <Link to="/terms">Terms</Link>.
                </span>
              </label>
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? "Sending..." : "Send"}
            </button>
          </form>

          <div className={styles.footer}>
            <Link to="/">← Back to Home</Link>
          </div>
        </div>
      </main>
    </>
  );
}
