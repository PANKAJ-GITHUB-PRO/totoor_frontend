import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.tudoor.app",
  appName: "Tudoor",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#0B1120",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#0B1120",
    },
  },
};

export default config;
