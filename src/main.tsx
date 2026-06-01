import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { registerSW } from "virtual:pwa-register";
import { Capacitor } from "@capacitor/core";

import { getRouter } from "./router";
import "./styles.css";
//not working here need to fix it 
if (Capacitor.isNativePlatform()) {
  void import("@capacitor/status-bar").then(({ StatusBar, Style }) => {
    void StatusBar.setStyle({ style: Style.Light });
    void StatusBar.setBackgroundColor({ color: "#0B1120" });
  });
  void import("@capacitor/splash-screen").then(({ SplashScreen }) => {
    void SplashScreen.hide();
  });
} else if ("serviceWorker" in navigator) {
  registerSW({
    immediate: true,
    onOfflineReady() {
      console.info("Tudoor is ready to work offline.");
    },
  });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root was not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={getRouter()} />
  </StrictMode>,
);
