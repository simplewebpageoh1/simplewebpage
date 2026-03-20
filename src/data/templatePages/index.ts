// src/data/templatePages/index.ts

export * from "./types";
export * from "./purchaseSteps";

import { HANDYMAN_PAGE } from "./pages/handyman";
import { CLEANING_PAGE } from "./pages/cleaning";
import { ELECTRICIAN_PAGE } from "./pages/electrician";
import { PLUMBING_PAGE } from "./pages/plumbing";
import { BASIC_PAGE } from "./pages/basic";

import type { TemplateSeoPage } from "./types";

export const TEMPLATE_PAGES: TemplateSeoPage[] = [
  HANDYMAN_PAGE,
  CLEANING_PAGE,
  ELECTRICIAN_PAGE,
  PLUMBING_PAGE,
  BASIC_PAGE,
];
