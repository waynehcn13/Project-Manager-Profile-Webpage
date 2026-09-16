import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";

export type PageViewInput = {
  sessionId: string;
  path: string;
  referrer: string | null;
  screenWidth: number | null;
  screenHeight: number | null;
  language: string | null;
  timezone: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

function validatePageViewInput(data: unknown): PageViewInput {
  const d = (data ?? {}) as Partial<Record<keyof PageViewInput, unknown>>;
  if (typeof d.sessionId !== "string" || typeof d.path !== "string") {
    throw new Error("Invalid page view payload: sessionId and path are required");
  }
  const str = (v: unknown) => (typeof v === "string" ? v : null);
  const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : null);
  return {
    sessionId: d.sessionId,
    path: d.path,
    referrer: str(d.referrer),
    screenWidth: num(d.screenWidth),
    screenHeight: num(d.screenHeight),
    language: str(d.language),
    timezone: str(d.timezone),
    utmSource: str(d.utmSource),
    utmMedium: str(d.utmMedium),
    utmCampaign: str(d.utmCampaign),
  };
}

type UserAgentInfo = { deviceType: string; browser: string; os: string };

function parseUserAgent(ua: string | undefined): UserAgentInfo {
  if (!ua) return { deviceType: "unknown", browser: "unknown", os: "unknown" };

  const isTablet = /iPad|Tablet/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua));
  const isMobile = !isTablet && /Mobi|iPhone|Android/i.test(ua);
  const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop";

  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Chrome\/|CriOS\//.test(ua)
        ? "Chrome"
        : /Firefox\/|FxiOS\//.test(ua)
          ? "Firefox"
          : /Safari\//.test(ua) && /Version\//.test(ua)
            ? "Safari"
            : "Other";

  const os = /Windows NT/.test(ua)
    ? "Windows"
    : /iPhone|iPad|iPod/.test(ua)
      ? "iOS"
      : /Mac OS X/.test(ua)
        ? "macOS"
        : /Android/.test(ua)
          ? "Android"
          : /Linux/.test(ua)
            ? "Linux"
            : "Other";

  return { deviceType, browser, os };
}

// Records a single pageview. Runs server-side only: reads geo/IP-derived
// headers (Vercel injects x-vercel-ip-*; absent on other hosts, so those
// fields just stay null there) and writes via the service-role client, since
// analytics_events has no RLS policies for the anon/publishable key.
export const trackPageView = createServerFn({ method: "POST" })
  .validator(validatePageViewInput)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { deviceType, browser, os } = parseUserAgent(getRequestHeader("user-agent"));
    const country = getRequestHeader("x-vercel-ip-country");
    const region = getRequestHeader("x-vercel-ip-country-region");
    const city = getRequestHeader("x-vercel-ip-city");

    const { error } = await supabaseAdmin.from("analytics_events").insert({
      session_id: data.sessionId,
      path: data.path,
      referrer: data.referrer,
      device_type: deviceType,
      browser,
      os,
      screen_width: data.screenWidth,
      screen_height: data.screenHeight,
      language: data.language,
      timezone: data.timezone,
      utm_source: data.utmSource,
      utm_medium: data.utmMedium,
      utm_campaign: data.utmCampaign,
      country: country ? decodeURIComponent(country) : null,
      region: region ? decodeURIComponent(region) : null,
      city: city ? decodeURIComponent(city) : null,
    });

    // Analytics must never break the page: log and swallow instead of throwing.
    if (error) console.error("[analytics] failed to record page view", error);
  });
