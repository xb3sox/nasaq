"use client";

import { useEffect, useState } from "react";

export function ChartWrapper({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // A small timeout bypasses the synchronous update rule and allows the initial paint
    const t = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!isMounted) {
    return <div className="w-full h-full" />;
  }

  return <>{children}</>;
}
