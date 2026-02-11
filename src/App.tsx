// src/App.tsx
// ✅ 앱의 최상위 컴포넌트
// 여기서는 Router만 불러와서 화면을 구성한다.

import AppRouter from "./router/AppRouter";
import ScrollManager from "./components/scroll/ScrollManager";

export default function App() {
  return (
    <>
      {/* ✅ 라우트 이동 시 스크롤 처리
          - 템플릿 진입: 항상 최상단
          - /templates(목록) 복귀: 이전 스크롤 위치 복원 */}
      <ScrollManager />
      {/* ✅ URL에 따라 페이지가 바뀌도록 라우터 렌더링 */}
      <AppRouter />
    </>
  );
}
