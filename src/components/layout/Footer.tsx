// src/components/layout/Footer.tsx
// ✅ 모든 페이지 하단에 고정으로 보여줄 푸터

import styles from "./Footer.module.scss";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.row}>
          <div>
            <strong>simplewebpage</strong>
            <div className={styles.muted}>Simple websites for small businesses</div>

            {/* ✅ 분쟁/오해 감소: 정책 페이지 링크 */}
            <div className={styles.links}>
              <Link className={styles.link} to="/refund">Refund Policy</Link>
              <Link className={styles.link} to="/terms">Terms</Link>
              <Link className={styles.link} to="/privacy">Privacy</Link>
              <Link className={styles.link} to="/how-it-works">How it works</Link>
            </div>
          </div>

          <div className={styles.muted}>© {year} simplewebpage. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
}
