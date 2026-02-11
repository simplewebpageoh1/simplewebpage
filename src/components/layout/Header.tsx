// src/components/layout/Header.tsx
// ✅ 모든 페이지 상단에 고정으로 보여줄 헤더(네비게이션)

import { Link, NavLink } from "react-router-dom";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        {/* ✅ 브랜드/로고 영역 */}
        <Link to="/" className={styles.brand}>
          SimpleWebPage
        </Link>

        {/* ✅ 네비게이션 링크 */}
        <nav className={styles.nav}>
          {/* ✅ NavLink는 현재 페이지일 때 active 스타일 주기 쉬움 (나중에 확장 가능) */}
          <NavLink to="/" className={styles.link}>
            Home
          </NavLink>
          <NavLink to="/templates" className={styles.link}>
            Templates
          </NavLink>

          {/* ✅ 문의로 유도하는 CTA 버튼 */}
          <NavLink
            to="/contact?from=nav"
            className={styles.cta}
            onClick={() => {
              // ✅ nav에서 Contact를 누르면, 과거 데모 선택값으로 자동 채워지는 혼란을 방지
              try {
                localStorage.removeItem("demoOrderDraft:v1");
                sessionStorage.removeItem("orderFlow:fromDemo");
              } catch {
                // ignore
              }
            }}
          >
            Contact
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
