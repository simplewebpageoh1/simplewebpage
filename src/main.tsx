// src/main.tsx
// ✅ React 앱 시작점(Entry point)
// index.html의 root에 App을 렌더링한다.

import "./styles/global.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";

// ✅ (선택) Analytics 초기화
// - GA4 측정 ID를 .env에 넣으면 자동으로 활성화됩니다.
// - 예: VITE_GA4_ID=G-XXXXXXXXXX
import { initAnalytics } from "./utils/analytics";

initAnalytics();



ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* ✅ BrowserRouter가 있어야 React Router가 작동한다 */}
    <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
  </React.StrictMode>
);
