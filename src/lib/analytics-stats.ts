import { createServerFn } from "@tanstack/react-start";

export type StatsRangeDays = 7 | 30 | 90;

export type StatBreakdown = { label: string; count: number };

export type AnalyticsStats = {
  totalPageviews: number;
  uniqueSessions: number;
  rangeDays: StatsRangeDays;
  dailyPageviews: { date: string; count: number }[];
  topPaths: StatBreakdown[];
  topReferrers: StatBreakdown[];
  deviceTypes: StatBreakdown[];
  browsers: StatBreakdown[];
  operatingSystems: StatBreakdown[];
  topCountries: StatBreakdown[];
};

type StatsInput = { passphrase: string; rangeDays: StatsRangeDays };

function validateStatsInput(data: unknown): StatsInput {
  const d = (data ?? {}) as Partial<Record<keyof StatsInput, unknown>>;
  if (typeof d.passphrase !== "string" || !d.passphrase) {
    throw new Error("Missing passphrase");
  }
  const rangeDays =
    d.rangeDays === 7 || d.rangeDays === 30 || d.rangeDays === 90 ? d.rangeDays : 30;
  return { passphrase: d.passphrase, rangeDays };
}

// Not truly constant-time (V8 may short-circuit on the XOR chain), but avoids
// the obvious early-return-on-first-mismatch timing leak of `===`.
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return mismatch === 0;
}

function topEntries(counts: Map<string, number>, limit = 8): StatBreakdown[] {
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

function referrerToLabel(referrer: string | null): string {
  if (!referrer) return "Direct / none";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return referrer;
  }
}

function buildDailySeries(counts: Map<string, number>, rangeDays: number) {
  const series: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    series.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return series;
}

// Reads and aggregates analytics_events for the stats page. Runs server-side
// only, and requires a passphrase (checked against the STATS_PASSPHRASE env
// var on every call, not just once) since analytics_events has no RLS
// policies and is otherwise only reachable via the service-role key.
export const getAnalyticsStats = createServerFn({ method: "POST" })
  .validator(validateStatsInput)
  .handler(async ({ data }): Promise<AnalyticsStats> => {
    const expected = process.env["STATS_PASSPHRASE"];
    if (!expected) {
      throw new Error(
        "Stats page is not configured: set the STATS_PASSPHRASE environment variable",
      );
    }
    if (!safeEqual(data.passphrase, expected)) {
      throw new Error("Unauthorized");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const since = new Date(Date.now() - data.rangeDays * 24 * 60 * 60 * 1000).toISOString();

    const { data: rows, error } = await supabaseAdmin
      .from("analytics_events")
      .select("created_at, session_id, path, referrer, device_type, browser, os, country")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(20000);

    if (error) throw new Error(`Failed to load analytics: ${error.message}`);

    const events = rows ?? [];

    const sessions = new Set<string>();
    const pathCounts = new Map<string, number>();
    const referrerCounts = new Map<string, number>();
    const deviceCounts = new Map<string, number>();
    const browserCounts = new Map<string, number>();
    const osCounts = new Map<string, number>();
    const countryCounts = new Map<string, number>();
    const dailyCounts = new Map<string, number>();

    for (const row of events) {
      sessions.add(row.session_id);
      pathCounts.set(row.path, (pathCounts.get(row.path) ?? 0) + 1);

      const referrerLabel = referrerToLabel(row.referrer);
      referrerCounts.set(referrerLabel, (referrerCounts.get(referrerLabel) ?? 0) + 1);

      const device = row.device_type ?? "unknown";
      deviceCounts.set(device, (deviceCounts.get(device) ?? 0) + 1);

      const browser = row.browser ?? "unknown";
      browserCounts.set(browser, (browserCounts.get(browser) ?? 0) + 1);

      const os = row.os ?? "unknown";
      osCounts.set(os, (osCounts.get(os) ?? 0) + 1);

      const country = row.country ?? "Unknown";
      countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);

      const day = row.created_at.slice(0, 10);
      dailyCounts.set(day, (dailyCounts.get(day) ?? 0) + 1);
    }

    return {
      totalPageviews: events.length,
      uniqueSessions: sessions.size,
      rangeDays: data.rangeDays,
      dailyPageviews: buildDailySeries(dailyCounts, data.rangeDays),
      topPaths: topEntries(pathCounts),
      topReferrers: topEntries(referrerCounts),
      deviceTypes: topEntries(deviceCounts),
      browsers: topEntries(browserCounts),
      operatingSystems: topEntries(osCounts),
      topCountries: topEntries(countryCounts),
    };
  });
