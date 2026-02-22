import { Link, NavLink } from "react-router-dom";
import styles from "./TopBar.module.scss";

export default function TopBar({
  theme,
  preview,
  setPreview,
}: {
  theme: "A" | "B" | "C";
  preview: "desktop" | "mobile";
  setPreview: (v: "desktop" | "mobile") => void;
}) {
  const buyHref = `/checkout?template=electrician&theme=${theme}`;
  const contactHref = `/contact?template=electrician&theme=${theme}`;

  return (
    <>
      <div className={styles.wrap}>
        <div className={`container ${styles.inner}`}>
          <Link className={styles.brand} to="/templates">
            SimpleWebpageOH • Electrician
          </Link>

          <div className={styles.right}>
            {/* Row 1: ABC + Contact (mobile: this becomes the 2nd row under brand) */}
            <div className={styles.rowTabs}>
              <div className={styles.tabs}>
                {(["A", "B", "C"] as const).map((v) => (
                  <NavLink
                    key={v}
                    to={`/demo/electrician/${v.toLowerCase()}`}
                    className={({ isActive }) =>
                      `${styles.tab} ${isActive ? styles.active : ""}`
                    }
                  >
                    {v}
                  </NavLink>
                ))}
              </div>

              <Link className={`btn btnSecondary ${styles.btn}`} to={contactHref}>
                Contact
              </Link>
            </div>

            {/* Row 2: Desktop/Mobile preview + Buy (desktop/tablet only) */}
            <div className={styles.rowActions}>
              <div className={styles.viewBtns}>
                <button
                  type="button"
                  className={`btn btnSecondary ${styles.btn}`}
                  onClick={() => setPreview("desktop")}
                  aria-pressed={preview === "desktop"}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  className={`btn btnSecondary ${styles.btn}`}
                  onClick={() => setPreview("mobile")}
                  aria-pressed={preview === "mobile"}
                >
                  Mobile
                </button>
              </div>

              <a className={`btn btnPrimary ${styles.btn} ${styles.topBuy}`} href={buyHref}>
                Buy $129
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Mobile: move Buy to bottom sticky bar */}
      <div className={styles.mobileBuyBar}>
        <div className={`container ${styles.mobileBuyInner}`}>
          <a className={`btn btnPrimary ${styles.mobileBuyBtn}`} href={buyHref}>
            Buy $129
          </a>
        </div>
      </div>
    </>
  );
}
