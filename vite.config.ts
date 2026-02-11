import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// vite.config.ts
// ✅ Netlify 배포를 염두에 둔 기본 설정
export default defineConfig({
  plugins: [react()],
});
