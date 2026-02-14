// src/pages/Intake/Intake.tsx
// ✅ 구매 후 '사업 정보/문구' 제출 폼(Intake Form)
// - 목표: 판매 후 왕복 질문을 줄이고, 필요한 자료를 한 번에 받기
// - Netlify Forms를 사용(간단/무료/배포 후 바로 작동)
// - 파일 업로드는 Netlify Forms에서 제한적일 수 있어 "로고 링크" 방식 권장

import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Seo from "../../components/seo/Seo";
import styles from "./Intake.module.scss";

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default function Intake() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // ✅ 어떤 템플릿을 샀는지(가능하면 URL로 넘겨받기): /intake?template=handyman
  const template = params.get("template") ?? "";

  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [services, setServices] = useState("");
  const [about, setAbout] = useState("");
  const [logoLink, setLogoLink] = useState("");
  const [notes, setNotes] = useState("");

  // ✅ 고객이 선택할 스타일(색/글씨체) - 기본값: Black & White + Inter
  const [themeColor, setThemeColor] = useState("black");
  const [themeFont, setThemeFont] = useState("inter");

  // ✅ 섹션 순서 요청(선택)
  // 예: hero > services > about > why one-page? > contact
  const [layoutOrderRequest, setLayoutOrderRequest] = useState("");

  // ✅ Add-ons 선택(추가 요금)
  // - 체크박스를 선택해도 즉시 결제되지 않습니다.
  // - 제출 후 우리가 확인/견적 확정 후 진행합니다.
  const [addonCopywriting, setAddonCopywriting] = useState(false);
  const [addonDomainConnection, setAddonDomainConnection] = useState(false);
  const [addonExtraRevisions, setAddonExtraRevisions] = useState(false);
  const [addonGoogleBusiness, setAddonGoogleBusiness] = useState(false);
  const [addonReviewRequest, setAddonReviewRequest] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    const formData: Record<string, string> = {
      "form-name": "intake",
      template,
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

      // ✅ Add-ons 기록(문의/오해 감소)
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

      // ✅ 제출 후 안내 페이지로 이동(감사/다음 단계)
      navigate(template ? `/thank-you?template=${template}` : "/thank-you");
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
        <h1 className={styles.title}>Website Setup Form</h1>
        <p className={styles.desc}>
          Please submit your business details. We use this to customize your
          one-page template.
          <br />
          <strong>Typical turnaround:</strong> review within 24 hours → go live
          within 24–48 hours.
        </p>

        <div className={styles.selected}>
          <p className={styles.selectedLabel}>
            <strong>Selected template:</strong>{" "}
            {template ? template : "Not selected"}
          </p>
          <p className={styles.selectedHint}>
            If you purchased a specific template, use the link we provided (it
            will include the template name).
          </p>
        </div>

        {/* ✅ Netlify Forms 인식용 속성 유지 */}
        <form
          className={styles.form}
          name="intake"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="intake" />
          <input type="hidden" name="template" value={template} />

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
              placeholder="e.g., ABC Handyman"
            />
          </label>

          <label className={styles.label}>
            Tagline (short)
            <input
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g., Repairs · Installations · Local"
            />
          </label>

          <label className={styles.label}>
            Service area
            <input
              value={serviceArea}
              onChange={(e) => {
                const v = e.target.value;
                setServiceArea(v);
                // ✅ Local SEO draft: demo/preview에서 "in [Service Area]"를 자동 반영할 수 있게 저장
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
              placeholder={
                "Example:\n- Drywall patching\n- Door & trim repairs\n- TV mounting\n- Small renovations"
              }
            />
          </label>

          {/* ✅ Add-ons 선택 (추가 요금) */}
          <div className={styles.addonsBlock}>
            <div className={styles.addonsTitle}>
              Optional help (recommended for a smooth launch)
            </div>
            <p className={styles.addonsHint}>
              These are optional. We’ll confirm details before starting.
            </p>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                name="addonGoogleBusiness"
                checked={addonGoogleBusiness}
                onChange={(e) => setAddonGoogleBusiness(e.target.checked)}
              />
              <span>
                Google Business Profile setup (+$79) — profile setup + basic
                optimization
                <br />
                <strong>Verification is required by the business owner</strong>.
              </span>
            </label>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                name="addonReviewRequest"
                checked={addonReviewRequest}
                onChange={(e) => setAddonReviewRequest(e.target.checked)}
              />
              <span>
                Review request message setup (+$39) — simple message template to
                collect more Google reviews
              </span>
            </label>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                name="addonCopywriting"
                checked={addonCopywriting}
                onChange={(e) => setAddonCopywriting(e.target.checked)}
              />
              <span>
                Copy refinement (+$49) — professional wording for headlines,
                services, and your call-to-action
              </span>
            </label>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                name="addonDomainConnection"
                checked={addonDomainConnection}
                onChange={(e) => setAddonDomainConnection(e.target.checked)}
              />
              <span>
                Domain connection (+$49) — we handle DNS + SSL + Netlify setup
                for you.
                <br />
                <strong>DIY is free</strong> (guide included) — or{" "}
                <strong>we do it for $49</strong>.
              </span>
            </label>

            <label className={styles.checkRow}>
              <input
                type="checkbox"
                name="addonExtraRevisions"
                checked={addonExtraRevisions}
                onChange={(e) => setAddonExtraRevisions(e.target.checked)}
              />
              <span>Additional revisions or small custom changes (+$39)</span>
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
            Section order request (optional)
            <textarea
              value={layoutOrderRequest}
              onChange={(e) => setLayoutOrderRequest(e.target.value)}
              rows={3}
              placeholder="Example: hero > services > about > contact\nAvailable sections: hero, services, about, why one-page?, contact"
            />
            <small className={styles.hint}>
              If you want a different section order, write it here. (We will
              apply it when building your final site.)
            </small>
          </label>

          <label className={styles.label}>
            Logo link (optional)
            <input
              value={logoLink}
              onChange={(e) => setLogoLink(e.target.value)}
              placeholder="Google Drive / Dropbox / website link to your logo"
            />
          </label>

          <label className={styles.label}>
            Notes (optional)
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Any extra requests or notes. Small fixes are included after go-live; additional updates are available for a flat fee ($39)."
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>

        <div className={styles.help}>
          <p>
            Need help with domain setup? Open the guide:
            <a
              className={styles.pdfLink}
              href="/Domain-Hosting-Guide.pdf"
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              Domain & Hosting Guide (PDF)
            </a>
          </p>
          <p style={{ marginTop: 10, opacity: 0.85 }}>
            Small fixes are included after go-live. Additional updates are
            available for a flat fee (+$39).
          </p>
        </div>
      </div>
    </main>
  );
}
