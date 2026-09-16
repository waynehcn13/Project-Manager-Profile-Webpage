import { type FormEvent, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ArrowLeft, Lock, LogOut, RefreshCw } from "lucide-react";

import {
  getAnalyticsStats,
  type AnalyticsStats,
  type StatBreakdown,
  type StatsRangeDays,
} from "@/lib/analytics-stats";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [{ title: "Site Stats" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: StatsPage,
});

const SESSION_KEY = "stats_passphrase";
const RANGE_OPTIONS: StatsRangeDays[] = [7, 30, 90];
const CARD_CLASS = "border-border/80 bg-card/70 shadow-sm backdrop-blur-xl";
const AUTH_ERROR_MESSAGES = new Set([
  "Unauthorized",
  "Stats page is not configured: set the stats_passphrase secret in the database",
]);

const chartConfig = {
  pageviews: { label: "Pageviews", color: "var(--chart-1)" },
} satisfies ChartConfig;

function pathLabel(path: string): string {
  return path === "/" ? "Home" : path;
}

function readStoredPassphrase(): string | null {
  try {
    return sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function storePassphrase(value: string | null) {
  try {
    if (value) sessionStorage.setItem(SESSION_KEY, value);
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Storage blocked (private browsing) — the gate just reappears next load.
  }
}

function StatsPage() {
  const [passphraseInput, setPassphraseInput] = useState("");
  const [passphrase, setPassphrase] = useState<string | null>(null);
  const [rangeDays, setRangeDays] = useState<StatsRangeDays>(30);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    setPassphrase(readStoredPassphrase());
  }, []);

  useEffect(() => {
    if (!passphrase) return;
    let cancelled = false;
    setLoading(true);
    setErrorMessage(null);

    getAnalyticsStats({ data: { passphrase, rangeDays } })
      .then((result) => {
        if (cancelled) return;
        setStats(result);
        setUpdatedAt(new Date());
        storePassphrase(passphrase);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "Failed to load stats";
        setErrorMessage(message);
        // Only the passphrase gate reappears on an actual auth failure — a
        // transient network/server error shouldn't sign the user out and
        // wipe the dashboard they were already looking at.
        if (AUTH_ERROR_MESSAGES.has(message)) {
          setStats(null);
          storePassphrase(null);
          setPassphrase(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [passphrase, rangeDays]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!passphraseInput.trim()) return;
    setPassphrase(passphraseInput.trim());
  }

  function handleSignOut() {
    storePassphrase(null);
    setPassphrase(null);
    setStats(null);
    setUpdatedAt(null);
    setPassphraseInput("");
  }

  if (!passphrase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className={cn(CARD_CLASS, "w-full max-w-sm")}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-primary" />
              <CardTitle>Site stats</CardTitle>
            </div>
            <CardDescription>Enter the passphrase to view analytics.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <label htmlFor="stats-passphrase" className="sr-only">
                Passphrase
              </label>
              <Input
                id="stats-passphrase"
                type="password"
                autoFocus
                value={passphraseInput}
                onChange={(e) => setPassphraseInput(e.target.value)}
                placeholder="Passphrase"
              />
              {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
              <Button type="submit" disabled={!passphraseInput.trim() || loading}>
                {loading ? "Checking…" : "Unlock"}
              </Button>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to site
              </Link>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-5 py-10 text-foreground sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Site stats</h1>
            <p className="text-sm text-muted-foreground">
              Self-hosted pageview analytics.
              {updatedAt && (
                <span className="ml-1.5 inline-flex items-center gap-1">
                  · Updated{" "}
                  {updatedAt.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
                  {loading && <RefreshCw className="h-3 w-3 animate-spin" />}
                </span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="flex overflow-hidden rounded-md border border-border"
              role="group"
              aria-label="Date range"
            >
              {RANGE_OPTIONS.map((days) => (
                <button
                  key={days}
                  type="button"
                  aria-pressed={rangeDays === days}
                  onClick={() => setRangeDays(days)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium transition-colors",
                    rangeDays === days
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                >
                  {days}d
                </button>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={handleSignOut} title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading && !stats && (
          <div className="mt-16 flex items-center justify-center gap-2 text-muted-foreground">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading…
          </div>
        )}

        {errorMessage && !stats && (
          <p className="mt-16 text-center text-sm text-destructive">{errorMessage}</p>
        )}

        {stats && (
          <div className="mt-8 space-y-8">
            {errorMessage && (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                {errorMessage} — showing the last successful load.
              </p>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <StatTile label="Pageviews" value={stats.totalPageviews} />
              <StatTile label="Unique sessions" value={stats.uniqueSessions} />
              <StatTile
                label="Avg pageviews / day"
                value={Math.round(stats.totalPageviews / stats.rangeDays)}
              />
            </div>

            <Card className={CARD_CLASS}>
              <CardHeader>
                <CardTitle className="text-base">Pageviews over time</CardTitle>
                <CardDescription>Last {stats.rangeDays} days</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
                  <BarChart data={stats.dailyPageviews} margin={{ left: 0, right: 0 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      minTickGap={24}
                      tickFormatter={(value: string) =>
                        new Date(value).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      }
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                      width={32}
                      allowDecimals={false}
                    />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          labelFormatter={(value) =>
                            new Date(value as string).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          }
                        />
                      }
                    />
                    <Bar
                      dataKey="count"
                      name="pageviews"
                      fill="var(--color-pageviews)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={24}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <BarListCard
                title="Top pages"
                items={stats.topPaths.map((item) => ({ ...item, label: pathLabel(item.label) }))}
              />
              <BarListCard title="Top referrers" items={stats.topReferrers} />
              <BarListCard title="Devices" items={stats.deviceTypes} />
              <BarListCard title="Browsers" items={stats.browsers} />
              <BarListCard title="Operating systems" items={stats.operatingSystems} />
              <BarListCard title="Countries" items={stats.topCountries} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: number }) {
  return (
    <Card className={CARD_CLASS}>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-3xl font-semibold">{value.toLocaleString()}</p>
      </CardContent>
    </Card>
  );
}

function BarListCard({ title, items }: { title: string; items: StatBreakdown[] }) {
  const max = items[0]?.count ?? 0;
  return (
    <Card className={CARD_CLASS}>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No data yet.</p>}
        {items.map((item) => (
          <div key={item.label} className="relative">
            <div
              className="absolute inset-y-0 left-0 rounded bg-primary/15"
              style={{ width: `${max > 0 ? (item.count / max) * 100 : 0}%` }}
              aria-hidden
            />
            <div className="relative flex items-center justify-between gap-3 px-2 py-1.5 text-sm">
              <span className="truncate text-foreground" title={item.label}>
                {item.label}
              </span>
              <span className="shrink-0 font-mono tabular-nums text-muted-foreground">
                {item.count.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
