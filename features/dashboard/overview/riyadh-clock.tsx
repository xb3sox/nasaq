"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function RiyadhClock() {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
    const syncClock = () => setTime(new Date());
    const initialTimer = setTimeout(syncClock, 0);
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => {
      clearTimeout(initialTimer);
      clearInterval(timer);
    };
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium bg-background/50 px-3 py-1.5 rounded-full border shadow-sm w-fit">
        <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
        <span dir="ltr">--:--:--</span>
        <span className="hidden sm:inline text-muted-foreground/60">| </span>
      </div>
    );
  }

  const riyadh = time?.toLocaleString("ar-SA", {
    timeZone: "Asia/Riyadh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }) ?? "--:--:--";

  const date = time?.toLocaleDateString("ar-SA", {
    timeZone: "Asia/Riyadh",
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  }) ?? "";

  return (
    <div className="flex items-center gap-2 text-sm text-foreground font-medium bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full border shadow-sm w-fit" suppressHydrationWarning>
      <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
      <span dir="ltr" suppressHydrationWarning className="font-semibold">{riyadh}</span>
      <span className="hidden sm:inline text-muted-foreground" suppressHydrationWarning>| {date}</span>
    </div>
  );
}
