import { Capacitor } from "@capacitor/core";

export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** True when user is in a normal browser tab (not native app, not installed PWA). */
export function isWebBrowser(): boolean {
  if (typeof window === "undefined") return false;
  return !Capacitor.isNativePlatform() && !isStandalonePwa();
}

export function isIosDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function isIosSafari(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  const ios = /iphone|ipad|ipod/.test(ua);
  return ios && !ua.includes("crios") && !ua.includes("fxios");
}

export function getAndroidApkUrl(): string {
  const fromEnv = import.meta.env.VITE_ANDROID_APK_URL?.trim();
  return fromEnv || "/downloads/tudoor.apk";
}
