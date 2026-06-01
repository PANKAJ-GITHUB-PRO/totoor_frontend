import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { PillButton } from "@/components/ui-kit/PillButton";
import { isIosSafari, isStandalonePwa } from "@/lib/pwa";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem("pwa-install-dismissed") === "1",
  );
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform() || isStandalonePwa()) return;
    setIsIos(isIosSafari());

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (Capacitor.isNativePlatform() || isStandalonePwa() || dismissed) return null;

  if (isIos) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-floating backdrop-blur-xl sm:mx-auto sm:max-w-screen-sm sm:rounded-t-2xl">
        <div className="flex items-start gap-3">
          <Download className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">Install Tudoor on iPhone</p>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Tap <span className="font-medium text-foreground">Share</span>, then{" "}
              <span className="font-medium text-foreground">Add to Home Screen</span>.
            </p>
          </div>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={() => {
              sessionStorage.setItem("pwa-install-dismissed", "1");
              setDismissed(true);
            }}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!deferred) return null;

  const install = async () => {
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    if (choice.outcome === "dismissed") {
      sessionStorage.setItem("pwa-install-dismissed", "1");
      setDismissed(true);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-floating backdrop-blur-xl sm:mx-auto sm:max-w-screen-sm sm:rounded-t-2xl">
      <div className="flex items-center gap-3">
        <Download className="h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Install Tudoor app</p>
          <p className="text-xs text-muted-foreground">Add to your home screen for quick access.</p>
        </div>
        <PillButton size="sm" onClick={install}>
          Install
        </PillButton>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={() => {
            sessionStorage.setItem("pwa-install-dismissed", "1");
            setDismissed(true);
          }}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
