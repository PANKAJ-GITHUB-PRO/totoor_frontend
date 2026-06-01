/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  /** Public URL or path to the signed Android APK (default: /downloads/tudoor.apk) */
  readonly VITE_ANDROID_APK_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
