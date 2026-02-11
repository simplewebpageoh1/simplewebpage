# Template / Demo 구조 정리 (개발자용)

## 경로가 어디를 가리키나요?

- `/demo/:slug` (예: `/demo/handyman`, `/demo/electrician`)
  - 사용하는 컴포넌트: `src/pages/DemoOnePage/DemoOnePage.tsx`
  - 데이터: `src/data/templatePages/templatePages.ts` 의 `demo` 필드

- `/templates/:slug`
  - 템플릿 상세(판매/SEO) 페이지
  - 데이터: 동일하게 `templatePages.ts` 를 사용

즉, `/demo/handyman` 는 `src/templates/...` 폴더가 아니라,
**`DemoOnePage` + `TEMPLATE_PAGES` 데이터를 기반으로 렌더링됩니다.**

---

## 새 템플릿(업종) 추가하는 최소 순서

1) `src/data/templatePages/templatePages.ts` 에 새 항목 추가
   - `slug`: 예) `plumbing`
   - `heading`, `description`
   - `demo`: brand, subtitle, phone, services 등

2) Templates 목록에 자동으로 노출됩니다
   - `/templates`
   - `/templates/:slug`
   - `/demo/:slug`

3) 필요하면 이미지/아이콘만 추가

---

## 데모 디자인(배경 교차)

- `DemoOnePage` 는 섹션 배경을 `white / soft gray` 로 교차 적용합니다.
- 스타일 파일: `src/pages/DemoOnePage/DemoOnePage.module.scss`
