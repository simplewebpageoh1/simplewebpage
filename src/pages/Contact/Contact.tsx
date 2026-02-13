// src/pages/Contact/Contact.tsx
// ✅ Netlify Forms를 SPA(React)에서 안정적으로 쓰는 방식
// - 폼 제출을 "페이지 이동(POST)" 대신 fetch로 보낸다.
// - 성공하면 React Router로 /thank-you 이동 => 404 문제 방지

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import styles from "./Contact.module.scss";
import Seo from "../../components/seo/Seo";

type DemoOrderDraftV1 = {
  template?: string;
  plan?: string;
  colorId?: string;
  customColor?: string;
  fontId?: string;
  updatedAt?: number;
};

// ✅ DemoOnePage의 COLOR_PRESETS와 동일하게 맞춤
// - Contact 요약 카드의 색상칩이 실제 선택 색과 항상 일치
const COLOR_PRESETS: Record<string, string> = {
  black: "#111111",
  orange: "#ff8a00",
  blue: "#2563eb",
  green: "#16a34a",
  purple: "#7c3aed",
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
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default function Contact() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ 어떤 데모에서 왔는지 query로 받기: /contact?template=roofing
  const params = new URLSearchParams(location.search);

  const from = params.get("from") ?? "";
  const templateFromQuery = params.get("template") ?? "";

  // ✅ 입력값 상태 관리 (초보자에게 가장 이해 쉬운 방식)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  // ✅ 개인정보 안내 동의(모바일/판매 신뢰도)
  const [agree, setAgree] = useState(false);
  const planFromQuery = params.get("plan") ?? "";

  // ✅ Demo에서 저장해둔 선택값(주문 초안) 읽기
  const [draft, setDraft] = useState<DemoOrderDraftV1 | null>(null);

  // ✅ Contact 자동 채움 규칙
  // - 데모/구매 흐름에서 왔을 때만(demoOrderDraft / session flag / query) 자동 채움
  // - nav에서 Contact를 눌렀다면 과거 선택값은 무시(혼란 방지)
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
    // nav/pricing에서 들어오면 이전 선택값을 초기화
    if (from === "nav" || from === "pricing") {
      try {
        localStorage.removeItem("demoOrderDraft:v1");
        sessionStorage.removeItem("orderFlow:fromDemo");
      } catch {
        // ignore
      }
      setDraft(null);
      return;
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
      return;
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

  // ✅ query가 있으면 query 우선, 없으면 draft fallback
  const selectedTemplate = templateFromQuery || draft?.template || "";
  const selectedPlan = planFromQuery || draft?.plan || "";
  const selectedColorId = params.get("color") || draft?.colorId || "";
  const selectedCustomColor =
    params.get("customColor") || draft?.customColor || "";
  const selectedFontId = params.get("font") || draft?.fontId || "";

  // ✅ 업종 선택(템플릿 3종 외에도 선택 가능)
  // - 기본값: demo에서 넘어온 template가 electrician/cleaning/handyman이면 그 값을 자동 선택
  // - query (?industry=plumbing 등)로도 직접 지정 가능
  const industryFromQuery = params.get("industry") ?? "";
  const initialIndustry = ((): IndustryId => {
    const t = (industryFromQuery || selectedTemplate || "").toLowerCase();
    const supported = INDUSTRY_OPTIONS.map((o) => o.id);
    if (supported.includes(t as any)) return t as IndustryId;
    // template가 3종이 아니면 other로 유도
    return selectedTemplate ? "other" : "other";
  })();

  const [industryId, setIndustryId] = useState<IndustryId>(initialIndustry);
  const [industryOther, setIndustryOther] = useState<string>("");
  const [industryTouched, setIndustryTouched] = useState(false);

  // ✅ draft가 늦게 로드되더라도, 사용자가 직접 바꾸지 않았다면 template 기반으로 업종을 자동 맞춤
  useEffect(() => {
    if (industryTouched) return;
    const t = (industryFromQuery || selectedTemplate || "").toLowerCase();
    const supported = INDUSTRY_OPTIONS.map((o) => o.id);
    if (supported.includes(t as any)) {
      setIndustryId(t as IndustryId);
      return;
    }
    // template가 지원 목록 밖이면 other 유지
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
    if (selectedTemplate) parts.push(`Template: ${selectedTemplate}`);
    if (selectedPlan) parts.push(`Plan: ${selectedPlan}`);
    if (selectedColorId)
      parts.push(
        `Color: ${selectedColorId}${selectedColorId === "custom" && selectedCustomColor ? ` (${selectedCustomColor})` : ""}`,
      );
    if (selectedFontId) parts.push(`Font: ${selectedFontId}`);
    return parts.join(" | ");
  }, [
    industryLabel,
    selectedTemplate,
    selectedPlan,
    selectedColorId,
    selectedCustomColor,
    selectedFontId,
  ]);

  const planPrice = useMemo(() => {
    const p = (selectedPlan || "").toLowerCase();
    if (p === "plus") return "$129";
    if (p === "basic") return "$99";
    return "";
  }, [selectedPlan]);

  const colorDisplay = useMemo(() => {
    if (!selectedColorId) return "";
    if (selectedColorId === "custom" && selectedCustomColor)
      return `${selectedCustomColor}`;
    return selectedColorId;
  }, [selectedColorId, selectedCustomColor]);

  const swatchColor = useMemo(() => {
    if (!selectedColorId) return "#111111";
    if (selectedColorId === "custom" && selectedCustomColor)
      return selectedCustomColor;
    return COLOR_PRESETS[selectedColorId] ?? "#111111";
  }, [selectedColorId, selectedCustomColor]);

  // ✅ 제출 중 중복 클릭 방지
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // ✅ 기본 폼 이동(POST) 막기

    if (submitting) return;
    setSubmitting(true);

    // ✅ Netlify Forms는 form-name이 꼭 필요
    const formData: Record<string, string> = {
      "form-name": "contact",
      name,
      email,
      message,
      industryId,
      industryOther,
      industry: industryLabel,
      template: selectedTemplate,
      plan: selectedPlan,
      colorId: selectedColorId,
      customColor: selectedCustomColor,
      fontId: selectedFontId,
      selectionSummary,
      // ✅ 필요하면 전체 JSON도 같이 보낼 수 있게 추가
      selectionJson: JSON.stringify(
        {
          industryId,
          industryOther,
          industry: industryLabel,
          template: selectedTemplate,
          plan: selectedPlan,
          colorId: selectedColorId,
          customColor: selectedCustomColor,
          fontId: selectedFontId,
        },
        null,
        0,
      ),
    };

    try {
      // ✅ Netlify Forms에 제출 (중요: path는 "/" 추천)
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(formData),
      });

      if (!res.ok) {
        // ✅ 서버가 2xx가 아니면 에러 처리
        throw new Error("Form submit failed");
      }

      // ✅ 성공하면 SPA 라우팅으로 감사 페이지 이동 (404 방지)
      // ✅ 제출이 끝났으면, 이전 주문 초안은 지워서 다음 일반 문의에 섞이지 않게
      try {
        localStorage.removeItem("demoOrderDraft:v1");
        sessionStorage.removeItem("orderFlow:fromDemo");
      } catch {
        // ignore
      }

      const qs = new URLSearchParams();

      if (selectedTemplate) qs.set("template", selectedTemplate);
      if (selectedPlan) qs.set("plan", selectedPlan);

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
      <main className={styles.page}>
        <div className="container">
          <h1 className={styles.title}>Contact</h1>
          <section className={styles.selectionCard} aria-label="Your selection">
            <div className={styles.selectionHeader}>
              <div>
                <div className={styles.selectionTitle}>Your selection</div>
                <div className={styles.selectionSub}>
                  If you came from a demo page, we’ll attach your selected
                  options automatically.
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
                <div className={styles.selectionKey}>Plan</div>
                <div className={styles.selectionVal}>
                  {selectedPlan ? (
                    <>
                      {selectedPlan}
                      {planPrice ? (
                        <span className={styles.mini}> ({planPrice})</span>
                      ) : null}
                    </>
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              <div className={styles.selectionRow}>
                <div className={styles.selectionKey}>Brand color</div>
                <div className={styles.selectionVal}>
                  {colorDisplay ? (
                    <>
                      <span
                        className={styles.swatch}
                        style={{ background: swatchColor }}
                        aria-hidden="true"
                      />
                      <span>{colorDisplay}</span>
                    </>
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              <div className={styles.selectionRow}>
                <div className={styles.selectionKey}>Font</div>
                <div className={styles.selectionVal}>
                  {selectedFontId || "—"}
                </div>
              </div>
            </div>

            {selectedPlan?.toLowerCase() === "basic" && (
              <div className={styles.selectionNote}>
                Custom color is a <strong>Plus</strong> feature.
              </div>
            )}
          </section>

          <p className={styles.desc}>
            Tell us about your business. We’ll reply within 24 hours.
          </p>
          <p className={styles.reassurance}>
            If you paid via <strong>Stripe</strong>, a receipt will be emailed
            to you automatically.
            <br />
            After you submit this form, we’ll confirm your order by email and
            start building your site.
          </p>

          <div className={styles.note}>
            <p>
              <strong>Plans:</strong> Basic (<strong>$99</strong>) vs Plus (
              <strong>$129</strong> — Custom Color included)
            </p>
            <p>
              Includes: one-page template setup + basic text replacement
              (business name, service area, contact) + a domain/hosting guide
              PDF.
              <a
                className={styles.pdfLink}
                href="/Domain-Hosting-Guide.pdf"
                target="_blank"
                rel="noreferrer"
              >
                {" "}
                Open PDF
              </a>
            </p>
          </div>

          {/* ✅ Netlify가 폼을 인식하도록 속성은 그대로 유지 */}
          <form
            className={styles.form}
            name="contact"
            method="POST"
            data-netlify="true"
            data-netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
          >
            {/* ✅ Netlify 인식용 hidden input (필수) */}
            <input type="hidden" name="form-name" value="contact" />
            {/* ✅ 스팸 방지용(권장) */}
            <p style={{ display: "none" }}>
              <label>
                Don’t fill this out if you're human: <input name="bot-field" />
              </label>
            </p>
            {/* ✅ 어떤 템플릿에서 왔는지 함께 저장 */}
            <input type="hidden" name="industryId" value={industryId} />
            <input type="hidden" name="industryOther" value={industryOther} />
            <input type="hidden" name="industry" value={industryLabel} />
            <input type="hidden" name="template" value={selectedTemplate} />
            <input type="hidden" name="plan" value={selectedPlan} />
            <input type="hidden" name="colorId" value={selectedColorId} />
            <input
              type="hidden"
              name="customColor"
              value={selectedCustomColor}
            />
            <input type="hidden" name="fontId" value={selectedFontId} />
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
                plan: selectedPlan,
                colorId: selectedColorId,
                customColor: selectedCustomColor,
                fontId: selectedFontId,
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

            {/* ✅ 개인정보 안내(결제/문의 직전 불안감 감소) */}
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
