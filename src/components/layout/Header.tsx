// src/components/layout/Header.tsx
// ✅ 모든 페이지 상단에 고정으로 보여줄 헤더(네비게이션)

import { Link, NavLink, useLocation } from "react-router-dom";
import styles from "./Header.module.scss";

export default function Header() {
  const location = useLocation();
  const isContact = location.pathname === "/contact";
  // ✅ Contact 페이지에서 이미 query(template/plan/...)가 있는 경우, Buy를 눌러도 URL을 리셋하지 않도록 현재 search를 유지
  const buyTo = isContact ? `/contact${location.search}` : "/contact?from=nav";

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
            to={buyTo}
            className={styles.cta}
            onClick={() => {
              // ✅ "Contact 페이지에서 Buy 재클릭"은 아무것도 초기화하지 않음 (query 유지)
              if (isContact) return;
              // ✅ nav에서 Buy로 Contact로 갈 때, 과거 데모 선택값 자동 채움 혼란 방지
              try {
                localStorage.removeItem("demoOrderDraft:v1");
                sessionStorage.removeItem("orderFlow:fromDemo");
              } catch {
                // ignore
              }
            }}
          >Buy</NavLink>
        </nav>
      </div>
    </header>
  );
}
