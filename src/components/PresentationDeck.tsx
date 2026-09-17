import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  Flag,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

// Shared "comes alive on scroll" entrance: items fade/slide in, staggered by
// index, once their container enters the viewport, and reset to hidden when
// it scrolls back out — so the animation replays on every pass.
const revealClass = "transition-all duration-500 ease-out";
function revealState(inView: boolean, index: number) {
  return {
    className: cn(revealClass, inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"),
    style: { transitionDelay: inView ? `${index * 70}ms` : "0ms" },
  };
}

const deckPdfUrl = "/presentation/wayne-project-presentation.pdf";
const roadmapPdfUrl = "/presentation/dto-texas-roadmap.pdf";
const dashboardPdfUrl = "/presentation/dto-texas-dashboard.pdf";

const cupDeckPdfUrl = "/presentation/cup-manufacturing-presentation.pdf";
const cupRoadmapPdfUrl = "/presentation/cup-manufacturing-roadmap.pdf";
const cupDashboardPdfUrl = "/presentation/cup-manufacturing-dashboard.pdf";

type Visual = "case" | "lifecycle" | "architecture" | "roadmap" | "dashboard" | "impact";

type Slide = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  visual: Visual;
};

type CaseColumn = { label: string; color: string; icon: typeof ArrowRight; items: string[] };
type Phase = { number: string; title: string; body: string; accent: "primary" | "coral" | "cyan" };
type Layer = { title: string; color: string; items: string; indent?: "none" | "sm" | "lg" };
type RoadmapRow = { name: string; start: number; width: number; color: string };
type Marker = { label: string; color: string };
type Metric = [string, string];
type PhaseProgress = { label: string; color: string };
type Impact = { title: string; body: string; color: string };

type CaseStudyData = {
  id: string;
  navLabel: string;
  tabLabel: string;
  slides: Slide[];
  caseColumns: CaseColumn[];
  lifecycle: { phases: Phase[]; whyLabel: string; whyBody: string };
  architecture: { layers: Layer[]; footerTag: string };
  roadmap: { months: string[]; rows: RoadmapRow[]; markers: Marker[] };
  dashboard: { metrics: Metric[]; phases: PhaseProgress[] };
  impact: Impact[];
  pdfs: { label: string; url: string; icon: typeof Download }[];
};

const dtoTexas: CaseStudyData = {
  id: "dto-texas",
  navLabel: "DTO Texas",
  tabLabel: "DTO Texas Policy Rollout",
  slides: [
    {
      id: "case-study",
      label: "Case study",
      title: "DTO Texas Policy Rollout",
      subtitle:
        "Recovering lost premiums by building direct-issuance capability across all 249 Texas counties.",
      visual: "case",
    },
    {
      id: "lifecycle",
      label: "Delivery model",
      title: "Hybrid Project Life Cycle",
      subtitle:
        "Waterfall governance with agile execution for automation, compliance, and staged deployment.",
      visual: "lifecycle",
    },
    {
      id: "architecture",
      label: "Program architecture",
      title: "A system designed to sustain itself",
      subtitle:
        "Ten connected deliverables moved the operation from foundation to scalable outcomes.",
      visual: "architecture",
    },
    {
      id: "roadmap",
      label: "Process artifact",
      title: "Two phases. Fifteen milestones. One controlled rollout.",
      subtitle:
        "A 12-month roadmap coordinated county readiness, automation, agents, and three vendors.",
      visual: "roadmap",
    },
    {
      id: "dashboard",
      label: "Metrics dashboard",
      title: "The project closed with every risk resolved",
      subtitle:
        "High-contrast closeout metrics show deployment, schedule, compliance, and operational readiness.",
      visual: "dashboard",
    },
    {
      id: "impact",
      label: "Business impact",
      title: "Operational insight became measurable value",
      subtitle:
        "The final model increased revenue, reduced dependency, protected compliance, and earned agent trust.",
      visual: "impact",
    },
  ],
  caseColumns: [
    {
      label: "Problem",
      color: "border-coral bg-coral/8",
      icon: ArrowDownRight,
      items: ["Lost title premiums", "249-county complexity", "Manual billing paths"],
    },
    {
      label: "Action",
      color: "border-primary bg-primary/8",
      icon: ArrowRight,
      items: ["Built Wintrack automation", "Configured premium splits", "Staged two-phase rollout"],
    },
    {
      label: "Result",
      color: "border-cyan bg-cyan/10",
      icon: Check,
      items: ["100% county coverage", "Zero compliance violations", "Self-sustaining operations"],
    },
  ],
  lifecycle: {
    phases: [
      { number: "01", title: "Initiate", body: "Charter · scope · value case", accent: "primary" },
      { number: "02", title: "Plan", body: "WBS · CPM · risks · SLAs", accent: "primary" },
      { number: "03", title: "Execute", body: "3 agile build and UAT sprints", accent: "coral" },
      { number: "04", title: "Deploy", body: "Staged rollout · formal close", accent: "cyan" },
    ],
    whyLabel: "Why hybrid:",
    whyBody:
      "fixed regulatory requirements stayed controlled while automation builds improved through rapid feedback loops.",
  },
  architecture: {
    layers: [
      {
        title: "Outcomes",
        color: "bg-cyan/14 border-cyan/30",
        items: "Allocation reports · Agent education · Vendor redistribution",
        indent: "lg",
      },
      {
        title: "Operations",
        color: "bg-coral/10 border-coral/30",
        items: "Automated billing · Premium allocation engine",
        indent: "sm",
      },
      {
        title: "Foundation",
        color: "bg-primary/8 border-primary/25",
        items: "Templates · Wintrack backbone · Curative · Digital signature · MSCC",
        indent: "none",
      },
    ],
    footerTag: "249 counties · one operating model",
  },
  roadmap: {
    months: ["Oct 23", "Dec", "Feb", "Apr", "Jun", "Aug", "Oct 24"],
    rows: [
      { name: "Phase I · 29 CPU counties", start: 0, width: 46, color: "bg-primary" },
      { name: "Phase II · 220 agency counties", start: 36, width: 48, color: "bg-cyan" },
      { name: "Vendor redistribution", start: 61, width: 25, color: "bg-coral" },
      { name: "Formal close", start: 84, width: 16, color: "bg-foreground" },
    ],
    markers: [
      { label: "Mar 15 · Phase I live", color: "bg-primary/10 text-primary" },
      { label: "Jul 1 · All counties live", color: "bg-cyan/10 text-foreground" },
      { label: "Oct · Close", color: "bg-coral/10 text-foreground" },
    ],
  },
  dashboard: {
    metrics: [
      ["249", "Counties deployed"],
      ["12 mo", "On schedule"],
      ["10/10", "Risks closed"],
      ["0", "Compliance violations"],
    ],
    phases: [
      { label: "Phase I", color: "bg-primary" },
      { label: "Phase II", color: "bg-cyan" },
      { label: "Project close", color: "bg-coral" },
    ],
  },
  impact: [
    { title: "Revenue", body: "Recovered lost premiums across 249 counties", color: "bg-primary" },
    { title: "Operations", body: "Zero IT dependency after close", color: "bg-cyan" },
    { title: "Compliance", body: "T7/T2 templates · zero violations", color: "bg-coral" },
    { title: "Agent trust", body: "220 agents · zero disengagement", color: "bg-foreground" },
  ],
  pdfs: [
    { label: "Full presentation", url: deckPdfUrl, icon: Download },
    { label: "Roadmap PDF", url: roadmapPdfUrl, icon: Flag },
    { label: "Dashboard PDF", url: dashboardPdfUrl, icon: ShieldCheck },
  ],
};

const cupManufacturing: CaseStudyData = {
  id: "cup-manufacturing",
  navLabel: "Cup Mfg",
  tabLabel: "Custom Cup Manufacturing Program",
  slides: [
    {
      id: "case-study",
      label: "Case study",
      title: "Custom Cup Manufacturing Program",
      subtitle:
        "Delivering 100,000 branded cups for Brew & Co. on a fixed four-month window with vendor Pureco Company.",
      visual: "case",
    },
    {
      id: "lifecycle",
      label: "Delivery model",
      title: "Hybrid Project Life Cycle",
      subtitle:
        "Phase-gate control for design and prototyping, then continuous-flow discipline once specs were locked for mass production.",
      visual: "lifecycle",
    },
    {
      id: "architecture",
      label: "Program architecture",
      title: "A document suite that carried the program end to end",
      subtitle:
        "Foundation planning artifacts fed operational plans, which fed the milestones and reporting that kept the sponsor informed.",
      visual: "architecture",
    },
    {
      id: "roadmap",
      label: "Process artifact",
      title: "Sixteen milestones. Three hard gates. One production run.",
      subtitle:
        "A four-month roadmap moved from charter sign-off through prototyping into mass production and delivery acceptance.",
      visual: "roadmap",
    },
    {
      id: "dashboard",
      label: "Metrics dashboard",
      title: "The program closed on schedule and in scope",
      subtitle:
        "Closeout metrics show units delivered, schedule adherence, and milestone and gate performance.",
      visual: "dashboard",
    },
    {
      id: "impact",
      label: "Business impact",
      title: "Disciplined planning turned a tight timeline into a reliable launch",
      subtitle:
        "The hybrid model protected the fixed delivery date while giving design room to iterate early.",
      visual: "impact",
    },
  ],
  caseColumns: [
    {
      label: "Problem",
      color: "border-coral bg-coral/8",
      icon: ArrowDownRight,
      items: [
        "No standing custom-cup supply chain",
        "100,000 units in a fixed 4-month window",
        "Design iteration risked the production start date",
      ],
    },
    {
      label: "Action",
      color: "border-primary bg-primary/8",
      icon: ArrowRight,
      items: [
        "Ran a phase-gate design and prototyping front end",
        "Locked specs at the Prototype Approval gate",
        "Shifted to continuous-flow production with Pureco",
      ],
    },
    {
      label: "Result",
      color: "border-cyan bg-cyan/10",
      icon: Check,
      items: [
        "100,000 units delivered on schedule",
        "All 3 hard gates met on time",
        "Full charter-to-close document suite delivered",
      ],
    },
  ],
  lifecycle: {
    phases: [
      {
        number: "01",
        title: "Initiate",
        body: "Charter sign-off · sponsor approval",
        accent: "primary",
      },
      {
        number: "02",
        title: "Design & Prototype",
        body: "Phase-gated iterations to the prototype gate",
        accent: "primary",
      },
      {
        number: "03",
        title: "Mass Production",
        body: "Continuous-flow manufacturing · QA sampling",
        accent: "coral",
      },
      {
        number: "04",
        title: "Delivery & Close",
        body: "Acceptance review · formal close",
        accent: "cyan",
      },
    ],
    whyLabel: "Why hybrid:",
    whyBody:
      "phase-gate control kept design risk contained while specs were still moving, then continuous-flow discipline kept 100,000 units on a fixed delivery date once they were locked.",
  },
  architecture: {
    layers: [
      {
        title: "Outcomes",
        color: "bg-cyan/14 border-cyan/30",
        items: "Delivery acceptance · Sponsor reporting · Vendor coordination with Pureco",
        indent: "lg",
      },
      {
        title: "Operations",
        color: "bg-coral/10 border-coral/30",
        items: "Schedule, Cost, Communication & Stakeholder Management Plans",
        indent: "sm",
      },
      {
        title: "Foundation",
        color: "bg-primary/8 border-primary/25",
        items: "Charter · WBS · WBS Dictionary · RACI · Risk Register · RAID Log",
        indent: "none",
      },
    ],
    footerTag: "100,000 units · one hybrid delivery model",
  },
  roadmap: {
    months: ["Apr", "May", "Jun", "Jul", "Aug"],
    rows: [
      { name: "Design & Prototype gate", start: 0, width: 40, color: "bg-primary" },
      { name: "Mass production (continuous-flow)", start: 36, width: 48, color: "bg-cyan" },
      { name: "QA & delivery acceptance", start: 80, width: 14, color: "bg-coral" },
      { name: "Formal close", start: 92, width: 8, color: "bg-foreground" },
    ],
    markers: [
      { label: "Apr 25 · Charter sign-off", color: "bg-primary/10 text-primary" },
      { label: "Jun 1 · Prototype approval", color: "bg-cyan/10 text-foreground" },
      { label: "Aug 15 · Delivery acceptance", color: "bg-coral/10 text-foreground" },
    ],
  },
  dashboard: {
    metrics: [
      ["100K", "Units delivered"],
      ["4 mo", "On schedule"],
      ["16/16", "Milestones closed"],
      ["3/3", "Hard gates met"],
    ],
    phases: [
      { label: "Design & Prototype", color: "bg-primary" },
      { label: "Mass Production", color: "bg-cyan" },
      { label: "Delivery & Close", color: "bg-coral" },
    ],
  },
  impact: [
    {
      title: "Delivery",
      body: "100,000 branded cups delivered on time for Brew & Co.",
      color: "bg-primary",
    },
    {
      title: "Schedule",
      body: "Fixed 4-month window held despite early design iteration",
      color: "bg-cyan",
    },
    {
      title: "Vendor partnership",
      body: "Coordinated Pureco across 14 resources and 710 person-hours",
      color: "bg-coral",
    },
    {
      title: "Governance",
      body: "8 risks tracked in the RAID log · zero surprises at gate reviews",
      color: "bg-foreground",
    },
  ],
  pdfs: [
    { label: "Full presentation", url: cupDeckPdfUrl, icon: Download },
    { label: "Roadmap PDF", url: cupRoadmapPdfUrl, icon: Flag },
    { label: "Dashboard PDF", url: cupDashboardPdfUrl, icon: ShieldCheck },
  ],
};

const caseStudies: CaseStudyData[] = [dtoTexas, cupManufacturing];

function CaseStudyVisual({ columns, inView }: { columns: CaseColumn[]; inView: boolean }) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {columns.map(({ label, color, icon: Icon, items }, index) => {
        const reveal = revealState(inView, index);
        return (
          <div
            key={label}
            style={reveal.style}
            className={cn(
              "rounded-lg border-t-4 bg-card/85 p-5 shadow-sm backdrop-blur-xl",
              color,
              reveal.className,
            )}
          >
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-semibold">{label}</p>
              <Icon className="h-5 w-5" />
            </div>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {items.map((item) => (
                <li key={item} className="border-b border-border/70 pb-3 last:border-0">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

const accentText: Record<Phase["accent"], string> = {
  primary: "text-primary",
  coral: "text-coral",
  cyan: "text-cyan",
};

function LifecycleVisual({
  phases,
  whyLabel,
  whyBody,
  inView,
}: {
  phases: Phase[];
  whyLabel: string;
  whyBody: string;
  inView: boolean;
}) {
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-4">
        {phases.map((phase, index) => {
          const reveal = revealState(inView, index);
          return (
            <div
              key={phase.number}
              style={reveal.style}
              className={cn(
                "relative rounded-lg border border-border bg-card/80 p-5 shadow-sm",
                reveal.className,
              )}
            >
              <span className={cn("font-display text-3xl font-bold", accentText[phase.accent])}>
                {phase.number}
              </span>
              <h4 className="mt-4 font-semibold">{phase.title}</h4>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{phase.body}</p>
              {index < phases.length - 1 && (
                <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden h-6 w-6 rounded-full bg-background p-1 text-primary md:block" />
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">{whyLabel}</strong> {whyBody}
      </div>
    </div>
  );
}

const indentClass: Record<NonNullable<Layer["indent"]>, string> = {
  none: "",
  sm: "mx-6",
  lg: "mx-12",
};

function ArchitectureVisual({
  layers,
  footerTag,
  inView,
}: {
  layers: Layer[];
  footerTag: string;
  inView: boolean;
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {layers.map((layer, index) => {
        const reveal = revealState(inView, index);
        return (
          <div
            key={layer.title}
            style={reveal.style}
            className={cn(
              "rounded-lg border px-6 py-5 shadow-sm",
              layer.color,
              indentClass[layer.indent ?? "none"],
              reveal.className,
            )}
          >
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <h4 className="font-semibold">{layer.title}</h4>
              <p className="text-xs text-muted-foreground">{layer.items}</p>
            </div>
          </div>
        );
      })}
      <div className="mt-2 flex justify-center">
        <span className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
          {footerTag}
        </span>
      </div>
    </div>
  );
}

function RoadmapVisual({
  months,
  rows,
  markers,
  inView,
}: {
  months: string[];
  rows: RoadmapRow[];
  markers: Marker[];
  inView: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card/85 p-5 shadow-sm">
      <div className="min-w-[640px]">
        <div
          className="ml-48 grid text-center text-[10px] font-semibold uppercase text-muted-foreground"
          style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}
        >
          {months.map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
        <div className="mt-4 space-y-4">
          {rows.map((row, index) => (
            <div key={row.name} className="grid grid-cols-[180px_1fr] items-center gap-3">
              <span className="text-xs font-semibold">{row.name}</span>
              <div className="relative h-8 rounded bg-muted">
                <span
                  className={cn(
                    "absolute top-1 h-6 rounded shadow-sm transition-all duration-700 ease-out",
                    row.color,
                  )}
                  style={{
                    left: `${row.start}%`,
                    width: inView ? `${row.width}%` : 0,
                    transitionDelay: inView ? `${index * 90}ms` : "0ms",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div
          className="ml-48 mt-5 grid gap-3 text-center text-xs font-semibold"
          style={{ gridTemplateColumns: `repeat(${markers.length}, minmax(0, 1fr))` }}
        >
          {markers.map((marker, index) => {
            const reveal = revealState(inView, rows.length + index);
            return (
              <span
                key={marker.label}
                style={reveal.style}
                className={cn("rounded p-2", marker.color, reveal.className)}
              >
                {marker.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DashboardVisual({
  metrics,
  phases,
  inView,
}: {
  metrics: Metric[];
  phases: PhaseProgress[];
  inView: boolean;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(([value, label], i) => {
          const reveal = revealState(inView, i);
          return (
            <div
              key={label}
              style={reveal.style}
              className={cn(
                "rounded-lg border p-5 shadow-sm",
                i === 0
                  ? "border-primary/30 bg-primary text-primary-foreground"
                  : i === 2
                    ? "border-cyan/30 bg-cyan/10"
                    : "border-border bg-card/85",
                reveal.className,
              )}
            >
              <p className="font-display text-3xl font-bold">{value}</p>
              <p className="mt-2 text-xs font-semibold opacity-75">{label}</p>
            </div>
          );
        })}
      </div>
      <div className="rounded-lg border border-border bg-card/85 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">Phase progress</h4>
        </div>
        {phases.map((phase, index) => (
          <div key={phase.label} className="mt-5">
            <div className="flex justify-between text-xs">
              <span>{phase.label}</span>
              <span className="font-semibold">100%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded bg-muted">
              <div
                className={cn("h-full rounded transition-all duration-700 ease-out", phase.color)}
                style={{
                  width: inView ? "100%" : "0%",
                  transitionDelay: inView ? `${metrics.length * 70 + index * 90}ms` : "0ms",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImpactVisual({ impacts, inView }: { impacts: Impact[]; inView: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {impacts.map((impact, index) => {
        const reveal = revealState(inView, index);
        return (
          <div
            key={impact.title}
            style={reveal.style}
            className={cn(
              "rounded-lg border border-border bg-card/85 p-5 shadow-sm transition-transform hover:-translate-y-1",
              reveal.className,
            )}
          >
            <span className={cn("mb-4 block h-1.5 w-12 rounded", impact.color)} />
            <h4 className="font-semibold">{impact.title}</h4>
            <p className="mt-2 text-sm text-muted-foreground">{impact.body}</p>
          </div>
        );
      })}
    </div>
  );
}

function SlideVisual({
  visual,
  study,
  inView,
}: {
  visual: Visual;
  study: CaseStudyData;
  inView: boolean;
}) {
  if (visual === "case") return <CaseStudyVisual columns={study.caseColumns} inView={inView} />;
  if (visual === "lifecycle") return <LifecycleVisual {...study.lifecycle} inView={inView} />;
  if (visual === "architecture")
    return <ArchitectureVisual {...study.architecture} inView={inView} />;
  if (visual === "roadmap") return <RoadmapVisual {...study.roadmap} inView={inView} />;
  if (visual === "dashboard") return <DashboardVisual {...study.dashboard} inView={inView} />;
  return <ImpactVisual impacts={study.impact} inView={inView} />;
}

export default function PresentationDeck() {
  const { ref: visualRef, inView: visualInView } = useInView<HTMLDivElement>(0.35);
  const [studyId, setStudyId] = useState(dtoTexas.id);
  const study = caseStudies.find((item) => item.id === studyId) ?? dtoTexas;
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const next = useCallback(
    () => setIndex((value) => Math.min(value + 1, study.slides.length - 1)),
    [study.slides.length],
  );
  const prev = useCallback(() => setIndex((value) => Math.max(value - 1, 0)), []);

  const selectStudy = useCallback((id: string) => {
    setStudyId(id);
    setIndex(0);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = study.slides[index] ?? study.slides[0];
  if (!slide) return null;

  // Rendered twice (inline + fullscreen overlay); only the inline copy should
  // drive the scroll-in-view reveal — fullscreen is already full-focus, so its
  // visuals just show immediately rather than sharing (and fighting over) the
  // same IntersectionObserver-backed ref.
  const renderDeck = (withScrollReveal: boolean) => (
    <div className="overflow-hidden rounded-lg border border-border/80 bg-card/75 shadow-[0_24px_70px_-36px_var(--primary)] backdrop-blur-xl">
      <div className="grid lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-border bg-foreground p-5 text-background lg:border-b-0 lg:border-r">
          <p className="text-xs font-semibold uppercase text-background/60">{study.navLabel}</p>
          <nav
            className="mt-5 grid grid-cols-3 gap-2 lg:grid-cols-1"
            aria-label="Presentation slides"
          >
            {study.slides.map((item, itemIndex) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setIndex(itemIndex)}
                className={cn(
                  "h-auto min-h-11 justify-start whitespace-normal px-3 py-2 text-left text-xs text-background/65 hover:bg-background/10 hover:text-background",
                  itemIndex === index && "bg-background/12 text-background",
                )}
              >
                <span
                  className={cn(
                    "mr-1 h-2 w-2 shrink-0 rounded-full",
                    itemIndex === index ? "bg-cyan" : "bg-background/25",
                  )}
                />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase text-primary">
                {slide.label} · {index + 1}/{study.slides.length}
              </p>
              <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">{slide.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{slide.subtitle}</p>
            </div>
            <Button
              variant="glass"
              size="icon"
              onClick={() => setFullscreen(true)}
              aria-label="Open full-screen presentation"
            >
              <Expand />
            </Button>
          </div>
          <div ref={withScrollReveal ? visualRef : undefined} className="mt-7">
            <SlideVisual
              visual={slide.visual}
              study={study}
              inView={withScrollReveal ? visualInView : true}
            />
          </div>
          <div className="mt-7 flex items-center justify-between border-t border-border pt-4">
            <Button
              variant="glass"
              size="icon"
              onClick={prev}
              disabled={index === 0}
              aria-label="Previous slide"
            >
              <ChevronLeft />
            </Button>
            <div className="flex gap-1.5">
              {study.slides.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  aria-label={`Go to slide ${itemIndex + 1}`}
                  onClick={() => setIndex(itemIndex)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    itemIndex === index ? "w-8 bg-primary" : "w-3 bg-border",
                  )}
                />
              ))}
            </div>
            <Button
              variant="vivid"
              size="icon"
              onClick={next}
              disabled={index === study.slides.length - 1}
              aria-label="Next slide"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Choose a case study">
        {caseStudies.map((item) => (
          <Button
            key={item.id}
            variant={item.id === study.id ? "vivid" : "glass"}
            size="sm"
            role="tab"
            aria-selected={item.id === study.id}
            onClick={() => selectStudy(item.id)}
          >
            {item.tabLabel}
          </Button>
        ))}
      </div>
      {renderDeck(true)}
      {study.pdfs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {study.pdfs.map(({ label, url, icon: Icon }) => (
            <Button key={label} asChild variant="glass">
              <a href={url} target="_blank" rel="noreferrer">
                <Icon />
                {label}
              </a>
            </Button>
          ))}
        </div>
      )}
      {fullscreen && (
        <div className="fixed inset-0 z-[100] overflow-auto bg-background/96 p-4 backdrop-blur-2xl sm:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex justify-end">
              <Button
                variant="glass"
                size="icon"
                onClick={() => setFullscreen(false)}
                aria-label="Exit presentation"
              >
                <X />
              </Button>
            </div>
            {renderDeck(false)}
          </div>
        </div>
      )}
    </div>
  );
}
