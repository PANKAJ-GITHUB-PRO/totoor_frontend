import { useState, type MouseEvent } from "react";
import { Apple, Download, Smartphone } from "lucide-react";
import { PillButton } from "@/components/ui-kit/PillButton";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAndroidApkUrl, isIosDevice, isIosSafari, isWebBrowser } from "@/lib/pwa";

const outlineBtnClass =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-base font-medium text-foreground transition hover:bg-secondary sm:w-auto";

export function AppDownloadSection() {
  const [iosOpen, setIosOpen] = useState(false);
  const [androidHintOpen, setAndroidHintOpen] = useState(false);

  if (!isWebBrowser()) return null;

  const apkUrl = getAndroidApkUrl();

  const onAndroidClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (isIosDevice()) {
      event.preventDefault();
      setAndroidHintOpen(true);
    }
  };

  return (
    <>
      <div className="mt-8 rounded-2xl border border-border bg-card/80 p-5 shadow-card backdrop-blur-sm">
        <div className="flex items-center gap-2 text-primary">
          <Smartphone className="h-5 w-5" />
          <p className="text-sm font-semibold">Get Tudoor on your phone</p>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Download the Android app or install on iPhone from your browser.
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <a
            href={apkUrl}
            download="tudoor.apk"
            onClick={onAndroidClick}
            className={cn(outlineBtnClass)}
          >
            <Download className="h-4 w-4" />
            Download for Android
          </a>
          <PillButton
            size="lg"
            variant="outline"
            leftIcon={<Apple className="h-4 w-4" />}
            type="button"
            className="w-full sm:w-auto"
            onClick={() => setIosOpen(true)}
          >
            Download for iOS
          </PillButton>
        </div>
      </div>

      <Dialog open={iosOpen} onOpenChange={setIosOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Install Tudoor on iPhone</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-3 pt-2 text-left text-sm text-muted-foreground">
                {isIosSafari() ? (
                  <>
                    <p>
                      iOS does not allow direct app downloads from websites. Install Tudoor as a
                      home-screen app (PWA):
                    </p>
                    <ol className="list-decimal space-y-2 pl-5">
                      <li>
                        Tap the <span className="font-medium text-foreground">Share</span> button in
                        Safari (square with arrow).
                      </li>
                      <li>
                        Scroll and tap{" "}
                        <span className="font-medium text-foreground">Add to Home Screen</span>.
                      </li>
                      <li>
                        Tap <span className="font-medium text-foreground">Add</span> — Tudoor opens
                        like an app.
                      </li>
                    </ol>
                  </>
                ) : (
                  <>
                    <p>
                      To install on iPhone, open this website in{" "}
                      <span className="font-medium text-foreground">Safari</span> (not Chrome or
                      in-app browser), then:
                    </p>
                    <ol className="list-decimal space-y-2 pl-5">
                      <li>Tap Share → Add to Home Screen → Add.</li>
                    </ol>
                    {isIosDevice() && (
                      <p className="rounded-lg border border-border bg-muted/50 p-3 text-xs">
                        You are on iPhone but not Safari. Copy the link and open it in Safari to
                        install.
                      </p>
                    )}
                  </>
                )}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={androidHintOpen} onOpenChange={setAndroidHintOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Android app only</DialogTitle>
            <DialogDescription>
              The APK file installs on Android phones. On iPhone, use &quot;Download for iOS&quot;
              to add Tudoor to your home screen.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
