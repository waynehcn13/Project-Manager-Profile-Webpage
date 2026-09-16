import { createServerFn } from "@tanstack/react-start";

import { supabase } from "@/integrations/supabase/client";

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
// only. The passphrase check happens inside the `get_analytics_events`
// Postgres function (SECURITY DEFINER, stored in private.app_secrets) rather
// than against an env var — Lovable Cloud never exposes the service-role key
// to this app's own deployment, and the anon key alone can't read
// analytics_events directly (see
// supabase/migrations/20260917090000_analytics_public_access.sql).
export const getAnalyticsStats = createServerFn({ method: "POST" })
  .validator(validateStatsInput)
  .handler(async ({ data }): Promise<AnalyticsStats> => {
    const { data: rows, error } = await supabase.rpc("get_analytics_events", {
      passphrase: data.passphrase,
      range_days: data.rangeDays,
    });

    if (error) {
      if (error.message.includes("Unauthorized")) throw new Error("Unauthorized");
      if (error.message.includes("not configured")) {
        throw new Error(
          "Stats page is not configured: set the stats_passphrase secret in the database",
        );
      }
      throw new Error(`Failed to load analytics: ${error.message}`);
    }

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
