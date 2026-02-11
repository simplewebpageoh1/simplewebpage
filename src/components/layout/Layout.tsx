// src/components/layout/Layout.tsx
// ✅ 공통 레이아웃 컴포넌트
// Header + (페이지 내용) + Footer 구조를 한 번에 적용한다.

import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  const location = useLocation();

  // ✅ Home(메인) 페이지에서만 body에 클래스 추가해서 헤더 Contact 버튼 색을 분리한다.
  useEffect(() => {
    const isHome = location.pathname === "/";
    document.body.classList.toggle("isHome", isHome);
    return () => {
      document.body.classList.remove("isHome");
    };
  }, [location.pathname]);

  return (
    <>
      <Header />
      {/* ✅ Outlet: Route 안에 들어가는 실제 페이지가 이 위치에 렌더링된다 */}
      <Outlet />
      <Footer />
    </>
  );
}
