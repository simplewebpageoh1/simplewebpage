// src/data/templatePages/index.ts
// ✅ 템플릿 데이터들을 한 곳에서 모아 export
// - 새 업종 추가 시: pages/*.ts 만들고 여기 배열에 추가

export * from "./types";
export * from "./purchaseSteps";

import { HANDYMAN_PAGE } from "./pages/handyman";
import { CLEANING_PAGE } from "./pages/cleaning";
import { ELECTRICIAN_PAGE } from "./pages/electrician";
import { BASIC_PAGE } from "./pages/basic";

import type { TemplateSeoPage } from "./types";

export const TEMPLATE_PAGES: TemplateSeoPage[] = [
  HANDYMAN_PAGE,
  CLEANING_PAGE,
  ELECTRICIAN_PAGE,
  BASIC_PAGE,
];
