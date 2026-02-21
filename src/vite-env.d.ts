/// <reference types="vite/client" />

declare interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string;
  readonly VITE_CONTACT_EMAIL?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
