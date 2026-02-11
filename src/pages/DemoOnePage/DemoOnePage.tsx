// src/pages/DemoOnePage/DemoOnePage.tsx
// ✅ 원페이지 데모(미리보기) 화면
// - /demo/:slug 경로에서 사용됨 (예: /demo/handyman)
// - Layout/글 구조는 유지하고, 상단 툴바에서 색/글씨체를 즉시 변경해서 볼 수 있게 함
// - 선택값은 localStorage에 저장되어 새로고침(F5)해도 유지됨(데모 전체 공통)

import { useMemo, useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import Seo from "../../components/seo/Seo";
import styles from "./DemoOnePage.module.scss";
import { TEMPLATE_PAGES } from "../../data/templatePages";
import type { SectionId } from "../../data/templatePages/types";

type ColorPreset = { id: "black" | "orange" | "blue" | "green" | "purple"; name: string; hex: string };
type FontPreset = { id: "inter" | "poppins" | "montserrat" | "merriweather" | "robotoslab"; name: string; family: string };

const COLOR_PRESETS: ColorPreset[] = [
  { id: "black", name: "Black", hex: "#111111" },
  { id: "orange", name: "Orange", hex: "#ff8a00" },
  { id: "blue", name: "Blue", hex: "#2563eb" },
  { id: "green", name: "Green", hex: "#16a34a" },
  { id: "purple", name: "Purple", hex: "#7c3aed" },
];

const FONT_PRESETS: FontPreset[] = [
  { id: "inter", name: "Inter", family: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" },
  { id: "poppins", name: "Poppins", family: "Poppins, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" },
  { id: "montserrat", name: "Montserrat", family: "Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" },
  { id: "merriweather", name: "Merriweather", family: "Merriweather, Georgia, 'Times New Roman', serif" },
  { id: "robotoslab", name: "Roboto Slab", family: "'Roboto Slab', Georgia, 'Times New Roman', serif" },
];

const STORAGE_KEY = "demoTheme:global:v1";

type PlanId = "basic" | "plus";
const BASIC_PRICE = 99;
const PLUS_PRICE = 129;

type PreviewMode = "desktop" | "mobile";

function safeLoad(): { colorId?: string; customColor?: string | null; fontId?: string; planId?: PlanId } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function safeSave(v: { colorId: string; customColor: string | null; fontId: string; planId: PlanId }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(v));
  } catch {
    // ignore
  }
}

function hexToRgb(hex: string) {
  const c = hex.replace("#", "");
  if (c.length !== 6) return null;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
  return { r, g, b };
}

function mixWithWhite(hex: string, whiteRatio: number) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#f5f6f8";
  const nr = Math.round(rgb.r * (1 - whiteRatio) + 255 * whiteRatio);
  const ng = Math.round(rgb.g * (1 - whiteRatio) + 255 * whiteRatio);
  const nb = Math.round(rgb.b * (1 - whiteRatio) + 255 * whiteRatio);
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

function getReadableTextColor(hexBg: string) {
  const rgb = hexToRgb(hexBg);
  if (!rgb) return "#ffffff";
  // relative luminance (simple)
  const lum = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
  return lum > 0.62 ? "#111111" : "#ffffff";
}

export default function DemoOnePage() {
  const { slug } = useParams();
  const location = useLocation();
  const uiMode = useMemo(() => (new URLSearchParams(location.search).get("mode") ?? "demo"), [location.search]);
  const isClientMode = uiMode === "client";


  const page = useMemo(() => TEMPLATE_PAGES.find((p) => p.slug === slug), [slug]);
  if (!page) return null;

  const d = page.demo;

  // ✅ Stripe 결제 링크 (있으면 바로 구매)
  // ✅ Stripe payment links (optional)
  // - If set, Buy will go to Stripe.
  // - If not set, Buy will go to /contact with selected options.
  const stripeLinkBasic = import.meta.env.VITE_STRIPE_PAYMENT_LINK_BASIC as string | undefined;
  const stripeLinkPlus = import.meta.env.VITE_STRIPE_PAYMENT_LINK_PLUS as string | undefined;

  // ✅ localStorage 값을 "처음 렌더"부터 반영하기 위해 lazy init 사용
  const [planId, setPlanId] = useState<PlanId>(() => safeLoad()?.planId ?? "basic");
  const [colorId, setColorId] = useState<string>(() => safeLoad()?.colorId ?? "black");
  const [customColor, setCustomColor] = useState<string | null>(() => safeLoad()?.customColor ?? null);
  const [fontId, setFontId] = useState<string>(() => safeLoad()?.fontId ?? "inter");

  // ✅ Colors/Fonts 패널: 필요할 때만 열어보기
  const [controlsOpen, setControlsOpen] = useState<boolean>(false);

  // ✅ Preview mode (desktop/mobile)
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");

  // ✅ "모바일" 기준(<=640px)
  // - Buy 하단 고정바, 옵션 패널 오버레이 등은 실제 화면 폭 기준으로 동작
  const [isMobileUi, setIsMobileUi] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 640px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const onChange = () => setIsMobileUi(mq.matches);
    onChange();
    // Safari 구버전 대응
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyMq = mq as any;
    if (anyMq.addEventListener) anyMq.addEventListener("change", onChange);
    else anyMq.addListener(onChange);
    return () => {
      if (anyMq.removeEventListener) anyMq.removeEventListener("change", onChange);
      else anyMq.removeListener(onChange);
    };
  }, []);

  // ✅ 옵션 패널이 열리면(모바일 UI) body 스크롤을 잠금
  // - 모바일에서 옵션 패널 내부가 먼저 스크롤되게 하기 위함
  useEffect(() => {
    if (typeof document === "undefined") return;
    const cls = "demo-controls-open";
    if (controlsOpen && isMobileUi) document.body.classList.add(cls);
    else document.body.classList.remove(cls);
    return () => document.body.classList.remove(cls);
  }, [controlsOpen, isMobileUi]);

  // ✅ Basic 사용자가 Custom color를 눌렀을 때 업셀링 메시지
  const [showPlusUpsell, setShowPlusUpsell] = useState(false);

  const serviceAreaFromIntake = useMemo(() => {
    try {
      return localStorage.getItem("intake:serviceArea") ?? "";
    } catch {
      return "";
    }
  }, []);

  const localSeoTitle = useMemo(() => {
    // ✅ 요청사항: Intake에서 Service Area를 입력하면
    // Cleaning 템플릿의 title/H1에 "Cleaning Services in [지역]" 반영
    if (page.slug !== "cleaning") return "";
    const area = serviceAreaFromIntake.trim();
    if (!area) return "";
    return `Cleaning Services in ${area}`;
  }, [page.slug, serviceAreaFromIntake]);

  const localServiceAreaLine = useMemo(() => {
    if (page.slug !== "cleaning") return d.serviceAreaLine;
    const area = serviceAreaFromIntake.trim();
    return area ? `Serving ${area}` : d.serviceAreaLine;
  }, [page.slug, serviceAreaFromIntake, d.serviceAreaLine]);

  // 변경 시 저장
  useEffect(() => {
    safeSave({ planId, colorId, customColor, fontId });
  }, [planId, colorId, customColor, fontId]);

  const stripeLink = planId === "plus" ? stripeLinkPlus : stripeLinkBasic;

  const checkoutHref = useMemo(() => {
    const params = new URLSearchParams();
    params.set("template", page.slug);
    params.set("plan", planId);
    return `/checkout?${params.toString()}`;
  }, [page.slug, planId]);

  const contactHref = (() => {
    const params = new URLSearchParams();
    params.set("template", page.slug);
    params.set("plan", planId);
    params.set("color", colorId);
    params.set("font", fontId);
    if (colorId === "custom" && customColor) params.set("customColor", customColor);
    return `/contact?${params.toString()}`;
  })();

  // ✅ persist the current selections so we can recover them later
  const persistOrderDraft = () => {
    try {
      const draft = {
        template: page.slug,
        plan: planId,
        colorId,
        customColor: customColor ?? "",
        fontId,
        updatedAt: Date.now(),
      };
      localStorage.setItem("demoOrderDraft:v1", JSON.stringify(draft));
      // ✅ Contact에서 '자동 채움'을 허용해야 하는 흐름(데모/구매)임을 표시
      // - nav의 Contact(일반 문의)와 구분해서 과거 선택값이 섞이는 문제를 방지
      sessionStorage.setItem("orderFlow:fromDemo", "1");
    } catch {
      // ignore
    }
  };

  // ✅ Basic에서는 custom color 사용 불가 → 상태를 자동으로 정리
  useEffect(() => {
    if (planId === "basic") {
      if (colorId === "custom") setColorId("black");
      if (customColor) setCustomColor(null);
    }
  }, [planId]);

  // 현재 선택 색상 계산
  const preset = COLOR_PRESETS.find((c) => c.id === (colorId as any)) ?? COLOR_PRESETS[0];
  const customAllowed = planId === "plus";
  const brand = customAllowed && colorId === "custom" && customColor ? customColor : preset.hex;

  // black 테마는 너무 회색/색감 섞이지 않게 기본 연회색 유지
  const bgSoft = preset.id === "black" && colorId !== "custom" ? "#f5f6f8" : mixWithWhite(brand, 0.88);
  // ✅ 섹션 배경(번갈아 적용): 선택 색상의 아주 연한 틴트
  // hero는 항상 흰색, 그 다음 섹션부터 tint / white / tint / ...
  const sectionTint = preset.id === "black" && colorId !== "custom" ? "#f0f1f3" : mixWithWhite(brand, 0.92);
  const brandText = getReadableTextColor(brand);

  const font = FONT_PRESETS.find((f) => f.id === (fontId as any)) ?? FONT_PRESETS[0];

  // ✅ CSS 변수로만 스타일을 바꿈(레이아웃은 그대로)
  const themeVars = {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    "--brand": brand,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    "--brand-text": brandText,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    "--bg-soft": bgSoft,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    "--font-main": font.family,
  } as React.CSSProperties;

  const price = planId === "plus" ? PLUS_PRICE : BASIC_PRICE;

  const seoTitle = localSeoTitle ? `${localSeoTitle} | One-Page Website` : `${page.heading} Demo | Preview`;

  // ✅ 섹션 순서
  const defaultLayoutOrder: SectionId[] = ["hero", "services", "about", "whyOnePage", "contact"];
  const rawOrder = (page.layoutOrder && page.layoutOrder.length ? page.layoutOrder : defaultLayoutOrder) as SectionId[];
  const layoutOrder: SectionId[] = (rawOrder.filter((id) =>
    ["hero", "services", "about", "whyOnePage", "contact"].includes(id)
  ) as SectionId[]);
  if (!layoutOrder.includes("hero")) layoutOrder.unshift("hero");

  return (
    <div className={styles.page}>
      <Seo title={seoTitle} description={page.description} path={`/demo/${page.slug}`} />

      {/* ✅ Top bar (화이트 헤더 느낌) */}
      <div className={styles.topBar}>
        <div className={`container ${styles.topInner}`}>
          <Link className={styles.back} to={`/templates/${page.slug}`}>
            ← Back to template details
          </Link>

          <div className={styles.topActions}>
            <button
              type="button"
              className={styles.customize}
              onClick={() => setControlsOpen((v) => !v)}
              aria-expanded={controlsOpen}
              aria-controls="demo-style-controls"
            >
              {controlsOpen ? "Hide options" : "Customize"}
            </button>

            {stripeLink ? (
              <Link className={`${styles.buy} ${styles.topBuy}`} to={checkoutHref} onClick={persistOrderDraft}>
                Buy (${price} CAD)
              </Link>
            ) : (
              <a className={`${styles.buy} ${styles.topBuy}`} href={contactHref} onClick={persistOrderDraft}>
                Buy (${price} CAD)
              </a>
            )}
          </div>
        </div>

        {/* ✅ Style toolbar (필요할 때만 펼쳐서 보기) */}
        <div
          id="demo-style-controls"
          className={`${styles.toolbarWrap} ${controlsOpen ? styles.open : ""}`}
          data-open={controlsOpen ? "1" : "0"}
        >
          <div className={`container ${styles.toolbar}`}>
          {/* Plan */}
          <div className={styles.group}>
            <div className={styles.groupTitle}>Plan</div>
            <div className={styles.btnRow}>
              <button
                type="button"
                className={`${styles.pill} ${planId === "basic" ? styles.active : ""}`}
                onClick={() => setPlanId("basic")}
              >
                Basic (${BASIC_PRICE})
              </button>
              <button
                type="button"
                className={`${styles.pill} ${planId === "plus" ? styles.active : ""}`}
                onClick={() => setPlanId("plus")}
              >
                Plus (${PLUS_PRICE} • Custom Color)
              </button>
            </div>
            <div className={styles.planNote}>
              Basic = presets only. Plus = <strong>Custom color</strong> (your brand).
            </div>
          </div>

          {/* View */}
          <div className={styles.group}>
            <div className={styles.groupTitle}>View</div>
            <div className={styles.btnRow}>
              <button
                type="button"
                className={`${styles.pill} ${previewMode === "desktop" ? styles.active : ""}`}
                onClick={() => setPreviewMode("desktop")}
              >
                Desktop
              </button>
              <button
                type="button"
                className={`${styles.pill} ${previewMode === "mobile" ? styles.active : ""}`}
                onClick={() => setPreviewMode("mobile")}
              >
                Mobile
              </button>
            </div>
          </div>

          {/* Colors */}
          <div className={styles.group}>
            <div className={styles.groupTitle}>Colors</div>

            <div className={styles.btnRow}>
              {/* ✅ Custom pill (항상 1개만) */}
              <button
                type="button"
                className={`${styles.pill} ${colorId === "custom" ? styles.active : ""}`}
                onClick={() => {
                  if (!customAllowed) {
                    setShowPlusUpsell(true);
                    window.setTimeout(() => setShowPlusUpsell(false), 2200);
                    return;
                  }
                  if (customColor) setColorId("custom");
                }}
                disabled={!customAllowed || !customColor}
                title={!customAllowed ? "Plus only" : customColor ? customColor : "Pick a custom color first"}
              >
                <span className={styles.swatch} style={{ background: customColor ?? "#111111" }} />
                Custom
              </button>

              {COLOR_PRESETS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`${styles.pill} ${colorId === c.id ? styles.active : ""}`}
                  onClick={() => {
                    setCustomColor(null);
                    setColorId(c.id);
                  }}
                >
                  <span className={styles.swatch} style={{ background: c.hex }} />
                  {c.name}
                </button>
              ))}
            </div>

            {/* ✅ 자유 컬러 선택(미리보기용) */}
            <label className={styles.colorPicker}>
              <span>Custom color</span>
              <input
                type="color"
                aria-label="Choose a custom brand color"
                value={customColor ?? "#111111"}
                disabled={!customAllowed}
                onClick={() => {
                  if (!customAllowed) {
                    setShowPlusUpsell(true);
                    window.setTimeout(() => setShowPlusUpsell(false), 2200);
                  }
                }}
                onChange={(e) => {
                  if (!customAllowed) return;
                  setCustomColor(e.target.value);
                  setColorId("custom");
                }}
              />
              {!customAllowed && <span className={styles.plusOnly}>Plus only</span>}
            </label>

            {showPlusUpsell && !customAllowed && (
              <div className={styles.upsellTip} role="status">
                This is a <strong>Plus</strong> feature. Upgrade to use your own brand color.
              </div>
            )}
          </div>

          {/* Fonts */}
          <div className={styles.group}>
            <div className={styles.groupTitle}>Fonts</div>
            <div className={styles.btnRow}>
              {FONT_PRESETS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`${styles.pill} ${fontId === f.id ? styles.active : ""}`}
                  onClick={() => setFontId(f.id)}
                >
                  {f.name}
                </button>
              ))}

              <button
                type="button"
                className={styles.reset}
                onClick={() => {
                  setPlanId("basic");
                  setColorId("black");
                  setCustomColor(null);
                  setFontId("inter");
                  try {
                    localStorage.removeItem(STORAGE_KEY);
                  } catch {
                    // ignore
                  }
                }}
              >
                Reset
              </button>
            </div>
          </div>
          </div>
        </div>
      </div>

      {/* ✅ Preview 영역에만 테마 적용 (상단 툴바/Back 링크는 영향 X) */}
      <div className={styles.preview} style={themeVars} data-mobile={isMobileUi ? "1" : "0"}>
        <div className={`${styles.viewport} ${previewMode === "mobile" ? styles.mobile : ""}`}>
          {(() => {
            const order: SectionId[] = Array.from(new Set(layoutOrder));
            // ✅ IMPORTANT: background must follow the *render order*.
            // Do NOT pre-compute backgrounds inside an object literal, because that would
            // run in a fixed order and break alternation when layoutOrder changes.
            let nonHeroIndex = 0;
            const bgFor = (id: SectionId) => {
              if (id === "hero") return "#ffffff";
              const bg = nonHeroIndex % 2 === 0 ? sectionTint : "#ffffff";
              nonHeroIndex += 1;
              return bg;
            };

            const renderSection = (id: SectionId, bg: string) => {
              switch (id) {
                case "hero":
                  return (
                <header className={styles.hero} id="home">
                  <div className="container">
                    <p className={styles.kicker}>Fast response</p>
                    <h1 className={styles.brand}>{localSeoTitle || d.brand}</h1>
                    <p className={styles.sub}>{d.subtitle}</p>

                    <div className={styles.metaRow}>
                      <span className={styles.meta}>{localServiceAreaLine}</span>
                      <a className={styles.phone} href={`tel:${d.phoneTel}`}>
                        {d.phoneDisplay}
                      </a>
                    </div>

                    <div className={styles.heroCtas}>
                      <a className={styles.primary} href="#contact">
                        Request a quote
                      </a>
                      <a className={styles.secondary} href="#services">
                        View services
                      </a>
                    </div>
                  </div>
                </header>
                  );

                case "services":
                  return (
                <section className={styles.section} id="services" style={{ backgroundColor: bg }}>
                  <div className="container">
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Services</h2>
                      <p className={styles.sectionSub}>What we offer — simple and clear.</p>
                    </div>

                    <div className={styles.grid}>
                      {d.services.map((s) => (
                        <div key={s.title} className={styles.card}>
                          <h3 className={styles.h3}>{s.title}</h3>
                          <p className={styles.p}>{s.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
                  );

                case "about":
                  return (
                <section className={styles.section} id="about" style={{ backgroundColor: bg }}>
                  <div className="container">
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>About</h2>
                      <p className={styles.sectionSub}>A short story that builds trust.</p>
                    </div>

                    <p className={styles.p}>
                      We are a small local business serving our community. We keep things simple: clear pricing, clean work,
                      and fast communication.
                    </p>
                    <p className={styles.p}>
                      This is a one-page template designed to help customers understand your service and contact you quickly.
                    </p>
                  </div>
                </section>
                  );

                case "whyOnePage":
                  return !isClientMode && page.seoLines?.length ? (
                  <section className={styles.section} id="why-one-page" style={{ backgroundColor: bg }}>
                    <div className="container">
                      <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Why One-Page?</h2>
                        <p className={styles.sectionSub}>Short reasons that help customers decide.</p>
                        <p className={styles.previewNote}>
                          Preview-only section. On your final website, this area will be replaced with client content (e.g.,
                          FAQ / Why choose us).
                        </p>
                      </div>
                      <ul className={styles.bullets}>
                        {page.seoLines.map((line) => (
                          <li key={line} className={styles.bulletItem}>
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                ) : null;

                case "contact":
                  return (
                <section className={styles.section} id="contact" style={{ backgroundColor: bg }}>
                  <div className="container">
                    <div className={styles.sectionHeader}>
                      <h2 className={styles.sectionTitle}>Contact</h2>
                      <p className={styles.sectionSub}>Fast response and clear next steps.</p>
                    </div>

                    <p className={styles.p}>Tell us what you need and we will reply fast.</p>

                    <div className={styles.contactBox}>
                      <div className={styles.contactRow}>
                        <span className={styles.label}>Phone</span>
                        <a className={styles.value} href={`tel:${d.phoneTel}`}>
                          {d.phoneDisplay}
                        </a>
                      </div>
                      <div className={styles.contactRow}>
                        <span className={styles.label}>Service area</span>
                        <span className={styles.value}>{localServiceAreaLine}</span>
                      </div>
                      <div className={styles.contactRow}>
                        <span className={styles.label}>Email</span>
                        <span className={styles.value}>info@simplewebpageoh.com</span>
                      </div>

                      <div className={styles.note}>
                        Want this website for your business? One-time price: <strong>${price} CAD</strong>.
                      </div>

                      {stripeLink ? (
                        <Link className={styles.buy2} to={checkoutHref} onClick={persistOrderDraft}>
                          Buy / Get Started
                        </Link>
                      ) : (
                        <a className={styles.buy2} href={contactHref} onClick={persistOrderDraft}>
                          Buy / Get Started
                        </a>
                      )}
                    </div>
                  </div>
                </section>
                  );

                default:
                  return null;
              }
            };

            return (
              <>
                {order.map((id) => renderSection(id, bgFor(id)))}

                <footer className={styles.footer}>
                  <div className="container">
                    <span>
                      © {new Date().getFullYear()} {d.brand}
                    </span>
                  </div>
                </footer>
              </>
            );
          })()}
        </div>
      </div>

      {/* ✅ Mobile Sticky Bottom Buy Bar (<=640px) */}
      <div className={styles.mobileBuyBar} aria-hidden={!isMobileUi}>
        <div className={styles.mobileBuyInner}>
          {stripeLink ? (
            <Link className={styles.mobileBuyBtn} to={checkoutHref} onClick={persistOrderDraft}>
              Buy (${price} CAD)
            </Link>
          ) : (
            <a className={styles.mobileBuyBtn} href={contactHref} onClick={persistOrderDraft}>
              Buy (${price} CAD)
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
