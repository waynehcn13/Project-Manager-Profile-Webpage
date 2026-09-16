import { useEffect, useRef } from "react";
import { useRouterState } from "@tanstack/react-router";

import { trackPageView } from "@/lib/analytics";

const SESSION_STORAGE_KEY = "analytics_session_id";

function getSessionId(fallbackRef: React.MutableRefObject<string | undefined>): string {
  try {
    const existing = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
    return id;
  } catch {
    // Storage blocked (private browsing, etc.) — keep a per-mount id instead.
    if (!fallbackRef.current) fallbackRef.current = crypto.randomUUID();
    return fallbackRef.current;
  }
}

// Fires a pageview to the self-hosted (Supabase-backed) tracker on every
// route change. No cookies, no third-party script — see src/lib/analytics.ts.
export function usePageViewTracking() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lastTracked = useRef<string | null>(null);
  const fallbackSessionId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (navigator.doNotTrack === "1") return;
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const search = new URLSearchParams(window.location.search);

    trackPageView({
      data: {
        sessionId: getSessionId(fallbackSessionId),
        path: pathname,
        referrer: document.referrer || null,
        screenWidth: window.screen?.width ?? null,
        screenHeight: window.screen?.height ?? null,
        language: navigator.language ?? null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
        utmSource: search.get("utm_source"),
        utmMedium: search.get("utm_medium"),
        utmCampaign: search.get("utm_campaign"),
      },
    }).catch(() => {
      // Analytics must never break the page.
    });
  }, [pathname]);
}
