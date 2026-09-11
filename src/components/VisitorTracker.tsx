"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

function getBrowserName(userAgent: string): string {
  if (/edg/i.test(userAgent)) return "Edge";
  if (/chrome|crios/i.test(userAgent) && !/opr|opera/i.test(userAgent)) return "Chrome";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) return "Safari";
  if (/opr|opera/i.test(userAgent)) return "Opera";
  return "Other";
}

function getDeviceType(userAgent: string): string {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) return "Tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(userAgent)) {
    return "Mobile";
  }
  return "Desktop";
}

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastLoggedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid re-logging the exact same path multiple times in rapid succession or admin paths
    if (pathname.startsWith("/admin")) return;
    if (lastLoggedPath.current === pathname) return;
    lastLoggedPath.current = pathname;

    const logVisit = async () => {
      try {
        if (!isSupabaseConfigured() || !supabase) return;

        const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
        const browser = getBrowserName(ua);
        const deviceType = getDeviceType(ua);
        const referrer = typeof document !== "undefined" && document.referrer ? document.referrer : "direct";

        // Non-blocking asynchronous insert
        await supabase.from("site_visits").insert({
          page_path: pathname || "/",
          user_agent: ua.slice(0, 255),
          browser,
          device_type: deviceType,
          referrer: referrer.slice(0, 255),
          country: "US",
        });
      } catch {
        // Silently catch telemetry errors to never disturb visitor UX
      }
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      window.requestIdleCallback(() => logVisit());
    } else {
      setTimeout(logVisit, 500);
    }
  }, [pathname]);

  return null;
}
