"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function PWARegistry() {
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").catch((err) => {
          console.error("Service Worker registration failed:", err);
        });
      });
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      deferredPrompt = event as BeforeInstallPromptEvent;
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  if (!isInstallable) return null;

  return <PWAInstallButton />;
}

export function PWAInstallButton() {
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      deferredPrompt = null;
    }
  };

  return (
    <div className="fixed bottom-4 start-4 z-50">
      <button
        type="button"
        onClick={handleInstallClick}
        className="flex items-center gap-2 rounded-full bg-[#0B7D72] px-4 py-2 text-white shadow-lg transition-colors hover:bg-[#09665d]"
        aria-label="تثبيت تطبيق نسق"
      >
        <Download className="size-4" aria-hidden="true" />
        <span>تثبيت التطبيق</span>
      </button>
    </div>
  );
}
