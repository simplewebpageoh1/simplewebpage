import type { TemplateSeoPage } from "../types";
import { COMMON_FAQ } from "../commonFaq";

export const PLUMBING_PAGE: TemplateSeoPage = {
  slug: "plumbing",
  title: "Plumbing Website Template | Simple One Page Site",
  description:
    "Simple plumbing website template for small businesses in Canada. Fast setup, no monthly fees.",
  heading: "Plumbing Website Template (One Page)",
  subheading:
    "A professional one-page website for plumbers — built to show services, coverage area, and fast contact.",
  seoLines: [
    "This template is designed for plumbing businesses in Canada that need a clean, trustworthy one-page website.",
    "No monthly builder fees — host it simply and keep full ownership of your site.",
    "Show your services, service area, phone number, and contact path clearly so customers can reach you quickly.",
    "Many plumbing leads come from urgent or mobile searches, so clarity and speed matter more than complexity.",
    "A focused one-page site reduces friction and helps customers call or request a quote faster.",
    "Fast loading and mobile-friendly layout to support customers searching on their phones.",
  ],
  whoFor:
    "Best for independent plumbers and small plumbing companies who want a modern website without ongoing platform fees.",
  solvesFast:
    "You can publish quickly with a proven one-page structure that builds trust and makes contact easy.",
  whyNotComplex:
    "Complex sites take more time and cost more to maintain. For local plumbing work, one clear page is often enough.",
  layoutOrder: ["hero", "services", "about", "whyOnePage", "contact"],
  faq: COMMON_FAQ,
  demo: {
    brand: "SAMPLE PLUMBING",
    subtitle: "Residential · Repairs · Installations",
    phoneDisplay: "403-000-0000",
    phoneTel: "4030000000",
    serviceAreaLine: "Serving Calgary, Airdrie, Chestermere and nearby areas",
    services: [
      { title: "Drain Cleaning", description: "Fast help for clogs, backups, and slow drains." },
      { title: "Leak Repairs", description: "Clear diagnosis and reliable repair for common leaks." },
      { title: "Water Heater", description: "Repair or replacement with straightforward recommendations." },
      { title: "Fixture Install", description: "Toilets, faucets, sinks, and other plumbing fixtures." },
      { title: "Emergency Calls", description: "Quick response for urgent plumbing issues when needed." },
    ],
  },
};
