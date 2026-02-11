// src/components/seo/Seo.tsx
// ✅ SEO 기본 설정(각 페이지별 title/description/OG 태그)
// - 표시되는 텍스트는 영어로 유지
// - baseUrl은 실제 배포 도메인으로 바꾸면 좋음

import { Helmet } from "react-helmet-async";

type SeoProps = {
  title: string;
  description: string;
  path?: string; // 예: "/templates"
  imagePath?: string; // 예: "/og-default.svg"
};

// ✅ 배포 도메인 (Netlify/Vercel에서 환경변수로 덮어쓰기 가능)
// - .env: VITE_SITE_URL=https://simplewebpageoh.com
const BASE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://simplewebpageoh.com";

export default function Seo({
  title,
  description,
  path = "/",
  imagePath = "/og-default.svg",
}: SeoProps) {
  const url = `${BASE_URL}${path}`;
  const imageUrl = `${BASE_URL}${imagePath}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      <link rel="canonical" href={url} />
    </Helmet>
  );
}
