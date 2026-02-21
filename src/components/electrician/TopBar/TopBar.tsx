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
  return (
    <div className={styles.wrap}>
      <div className={`container ${styles.inner}`}>
        <Link className={styles.brand} to="/templates">
          SimpleWebpageOH • Electrician
        </Link>

        <div className={styles.right}>
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

          {/* Desktop / Mobile preview */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              type="button"
              className={`btn btnSecondary ${styles.buy}`}
              onClick={() => setPreview("desktop")}
              aria-pressed={preview === "desktop"}
            >
              Desktop
            </button>
            <button
              type="button"
              className={`btn btnSecondary ${styles.buy}`}
              onClick={() => setPreview("mobile")}
              aria-pressed={preview === "mobile"}
            >
              Mobile
            </button>
            <Link
              className={`btn btnSecondary ${styles.buy}`}
              to={`/contact?template=electrician&theme=${theme}`}
            >
              Contact
            </Link>
            
            <a
              className={`btn btnPrimary ${styles.buy}`}
              href={`/checkout?template=electrician&theme=${theme}`}
            >
              Buy ($129)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
