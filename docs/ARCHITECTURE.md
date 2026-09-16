# Architecture

This is a [TanStack Start](https://tanstack.com/start) (React + Vite + file-based routing) portfolio site, scaffolded and mostly maintained through [Lovable](https://lovable.dev), with the code also deployed independently to Vercel. Styling is Tailwind CSS v4 with [shadcn/ui](https://ui.shadcn.com)-style components under `src/components/ui`.

## Project layout

```
src/
  routes/                 TanStack Start file-based routes (__root.tsx, index.tsx)
  components/
    ui/                   shadcn/ui primitives (Button, Dialog, etc.)
    PresentationDeck.tsx   Interactive multi-case-study slide deck (see below)
  integrations/supabase/   Supabase client setup (auth, server/client variants)
  hooks/                  Shared React hooks
  lib/                    Utilities (cn(), error reporting)
public/
  presentation/           Static PDF assets served to the presentation deck
```

## Deployment model

Two independent deployments track the `main` branch:

- **Vercel** (`waynehoangnguyen.vercel.app`) rebuilds and redeploys automatically on every push to `main` via the GitHub integration.
- **Lovable** (`waynenguyenportfolio.lovable.app`) syncs the pushed code into the Lovable editor automatically, but publishing the live site is a separate, manual step inside the Lovable editor (Publish button). Code being "synced" does not mean the public Lovable URL is updated.

Both read from the same repository and the same `public/` assets, so anything added to `public/` needs to actually be committed (not just referenced by a Lovable-only asset pointer — see the PDF note below).

## The case-study presentation deck

`src/components/PresentationDeck.tsx` renders the "Interactive Case Study" section on the homepage. It's built to support **multiple case studies behind a tab switcher**, each described entirely by a `CaseStudyData` object — no case-study-specific JSX. To add a new case study, add a new `CaseStudyData` entry and push it into the `caseStudies` array; the tab bar, slide navigation, and all six visual types render generically off that data.

### `CaseStudyData` shape

```ts
type CaseStudyData = {
  id: string;                 // stable key, used for tab state
  navLabel: string;           // short label in the slide sidebar header
  tabLabel: string;           // label on the case-study switcher button
  slides: Slide[];            // ordered list of 6 slides (id, title, subtitle, visual type)
  caseColumns: CaseColumn[];  // Problem / Action / Result columns for the "case" visual
  lifecycle: { phases: Phase[]; whyLabel: string; whyBody: string };
  architecture: { layers: Layer[]; footerTag: string };
  roadmap: { months: string[]; rows: RoadmapRow[]; markers: Marker[] };
  dashboard: { metrics: Metric[]; phases: PhaseProgress[] };
  impact: Impact[];
  pdfs: { label: string; url: string; icon: typeof Download }[]; // optional download row; [] hides it
};
```

Each `Slide.visual` (`"case" | "lifecycle" | "architecture" | "roadmap" | "dashboard" | "impact"`) maps to one of six presentational components (`CaseStudyVisual`, `LifecycleVisual`, `ArchitectureVisual`, `RoadmapVisual`, `DashboardVisual`, `ImpactVisual`) via the `SlideVisual` switch near the bottom of the file. The visual components only render whatever section of the `CaseStudyData` object matches their `visual` type — they know nothing about which case study they belong to.

### Adding a new case study

1. Copy the shape of an existing `CaseStudyData` constant (e.g. `cupManufacturing`) as a starting point.
2. Fill in all six slide sections — every field is plain data (strings, small structs), no markup.
3. Add the new constant to the `caseStudies` array. It will automatically appear as a new tab.
4. If you want PDF download buttons, add real files under `public/presentation/` and reference them with plain `/presentation/<file>.pdf` paths (see below) — leave `pdfs: []` to hide the download row entirely.

### PDF assets: why they're plain files in `public/`

The original DTO Texas PDFs were authored in Lovable and initially referenced via `@/assets/*.pdf.asset.json` imports pointing at `/__l5e/assets-v1/...` — a route that only exists on Lovable's own hosting. That works fine on the Lovable-published site, but **404s on Vercel**, which doesn't know that route.

The fix (and the pattern to follow for any new case study): download/generate the actual PDF, commit it under `public/presentation/`, and reference it with a plain absolute path (`/presentation/my-file.pdf`). Vite serves everything in `public/` as-is at the site root, so this works identically on Vercel, Lovable, and local dev — no platform-specific asset pipeline involved.

`.gitattributes` marks `*.pdf` as binary so Git never rewrites line endings inside them (relevant for hand-generated, text-content PDFs — see git history around the Custom Cup Manufacturing PDFs for why that matters: a byte-exact `xref` table in a hand-built PDF will silently corrupt if CRLF conversion touches it).

## Web analytics

Pageviews are tracked with a small self-hosted pipeline instead of a third-party script:

- `src/hooks/use-page-view-tracking.ts` fires on every route change (mounted from `__root.tsx`) and collects only client-observable, non-invasive signals: path, referrer, UTM params, screen size, language/timezone, and a per-tab session id kept in `sessionStorage`. It skips entirely when `navigator.doNotTrack === "1"`.
- `src/lib/analytics.ts` exports `trackPageView`, a `createServerFn` — its handler body runs server-side only (verified it's absent from the client build output) and is where device/browser/OS get parsed from the `user-agent` header and geo fields get read from Vercel's `x-vercel-ip-*` request headers (present on Vercel, `null` elsewhere, e.g. on Lovable's own hosting).
- Writes go through `supabaseAdmin` (service-role key) into the `analytics_events` table (`supabase/migrations/20260916120000_create_analytics_events.sql`). That table has RLS enabled with **no policies**, so it's unreachable through the public Supabase API with the anon/publishable key — only the server function can read or write it.

### Stats dashboard

`/stats` (`src/routes/stats.tsx`) renders a small self-serve dashboard — pageview trend chart, top pages/referrers, and device/browser/OS/country breakdowns — over the last 7/30/90 days. It's gated by a shared passphrase, not a route link: the page isn't in the nav, and `head` sets `robots: noindex, nofollow`.

- The passphrase is checked server-side on **every** stats fetch (`src/lib/analytics-stats.ts`, `getAnalyticsStats`) against the `STATS_PASSPHRASE` environment variable — set it in Vercel's project env vars and in Lovable Cloud's env config (and locally in a gitignored `.env.local`, never in the committed `.env`). The page won't work until that variable is set somewhere the server function can read it.
- On the client, the passphrase is kept in `sessionStorage` only (so it survives a refresh but not a new tab) — it's a lightweight shared-secret gate, not real auth; treat the page as "unlisted + locked," not as protecting sensitive data.
