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
import deckPdf from "@/assets/wayne-project-presentation.pdf.asset.json";
import roadmapPdf from "@/assets/dto-texas-roadmap.pdf.asset.json";
import dashboardPdf from "@/assets/dto-texas-dashboard.pdf.asset.json";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  label: string;
  title: string;
  subtitle: string;
  visual: "case" | "lifecycle" | "architecture" | "roadmap" | "dashboard" | "impact";
};

export const slides: Slide[] = [
  {
    id: "case-study",
    label: "Case study",
    title: "DTO Texas Policy Rollout",
    subtitle: "Recovering lost premiums by building direct-issuance capability across all 249 Texas counties.",
    visual: "case",
  },
  {
    id: "lifecycle",
    label: "Delivery model",
    title: "Hybrid Project Life Cycle",
    subtitle: "Waterfall governance with agile execution for automation, compliance, and staged deployment.",
    visual: "lifecycle",
  },
  {
    id: "architecture",
    label: "Program architecture",
    title: "A system designed to sustain itself",
    subtitle: "Ten connected deliverables moved the operation from foundation to scalable outcomes.",
    visual: "architecture",
  },
  {
    id: "roadmap",
    label: "Process artifact",
    title: "Two phases. Fifteen milestones. One controlled rollout.",
    subtitle: "A 12-month roadmap coordinated county readiness, automation, agents, and three vendors.",
    visual: "roadmap",
  },
  {
    id: "dashboard",
    label: "Metrics dashboard",
    title: "The project closed with every risk resolved",
    subtitle: "High-contrast closeout metrics show deployment, schedule, compliance, and operational readiness.",
    visual: "dashboard",
  },
  {
    id: "impact",
    label: "Business impact",
    title: "Operational insight became measurable value",
    subtitle: "The final model increased revenue, reduced dependency, protected compliance, and earned agent trust.",
    visual: "impact",
  },
];

function CaseStudyVisual() {
  const columns = [
    { label: "Problem", color: "border-coral bg-coral/8", icon: ArrowDownRight, items: ["Lost title premiums", "249-county complexity", "Manual billing paths"] },
    { label: "Action", color: "border-primary bg-primary/8", icon: ArrowRight, items: ["Built Wintrack automation", "Configured premium splits", "Staged two-phase rollout"] },
    { label: "Result", color: "border-cyan bg-cyan/10", icon: Check, items: ["100% county coverage", "Zero compliance violations", "Self-sustaining operations"] },
  ];
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {columns.map(({ label, color, icon: Icon, items }) => (
        <div key={label} className={cn("rounded-lg border-t-4 bg-card/85 p-5 shadow-sm backdrop-blur-xl", color)}>
          <div className="flex items-center justify-between">
            <p className="font-display text-lg font-semibold">{label}</p>
            <Icon className="h-5 w-5" />
          </div>
          <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
            {items.map((item) => <li key={item} className="border-b border-border/70 pb-3 last:border-0">{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function LifecycleVisual() {
  const phases = [
    ["01", "Initiate", "Charter · scope · value case"],
    ["02", "Plan", "WBS · CPM · risks · SLAs"],
    ["03", "Execute", "3 agile build and UAT sprints"],
    ["04", "Deploy", "Staged rollout · formal close"],
  ];
  return (
    <div>
      <div className="grid gap-3 md:grid-cols-4">
        {phases.map(([number, title, body], index) => (
          <div key={number} className="relative rounded-lg border border-border bg-card/80 p-5 shadow-sm">
            <span className={cn("font-display text-3xl font-bold", index === 2 ? "text-coral" : index === 3 ? "text-cyan" : "text-primary")}>{number}</span>
            <h4 className="mt-4 font-semibold">{title}</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{body}</p>
            {index < 3 && <ArrowRight className="absolute -right-5 top-1/2 z-10 hidden h-6 w-6 rounded-full bg-background p-1 text-primary md:block" />}
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm text-muted-foreground">
        <strong className="text-foreground">Why hybrid:</strong> fixed regulatory requirements stayed controlled while automation builds improved through rapid feedback loops.
      </div>
    </div>
  );
}

function ArchitectureVisual() {
  const layers = [
    { title: "Outcomes", color: "bg-cyan/14 border-cyan/30", items: "Allocation reports · Agent education · Vendor redistribution" },
    { title: "Operations", color: "bg-coral/10 border-coral/30", items: "Automated billing · Premium allocation engine" },
    { title: "Foundation", color: "bg-primary/8 border-primary/25", items: "Templates · Wintrack backbone · Curative · Digital signature · MSCC" },
  ];
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {layers.map((layer, i) => (
        <div key={layer.title} className={cn("rounded-lg border px-6 py-5 shadow-sm", layer.color, i === 0 ? "mx-12" : i === 1 ? "mx-6" : "") }>
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="font-semibold">{layer.title}</h4>
            <p className="text-xs text-muted-foreground">{layer.items}</p>
          </div>
        </div>
      ))}
      <div className="mt-2 flex justify-center"><span className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">249 counties · one operating model</span></div>
    </div>
  );
}

function RoadmapVisual() {
  const rows = [
    { name: "Phase I · 29 CPU counties", start: 0, width: 46, color: "bg-primary" },
    { name: "Phase II · 220 agency counties", start: 36, width: 48, color: "bg-cyan" },
    { name: "Vendor redistribution", start: 61, width: 25, color: "bg-coral" },
    { name: "Formal close", start: 84, width: 16, color: "bg-foreground" },
  ];
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card/85 p-5 shadow-sm">
      <div className="min-w-[640px]">
        <div className="ml-48 grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-muted-foreground"><span>Oct 23</span><span>Dec</span><span>Feb</span><span>Apr</span><span>Jun</span><span>Aug</span><span>Oct 24</span></div>
        <div className="mt-4 space-y-4">
          {rows.map((row) => (
            <div key={row.name} className="grid grid-cols-[180px_1fr] items-center gap-3">
              <span className="text-xs font-semibold">{row.name}</span>
              <div className="relative h-8 rounded bg-muted">
                <span className={cn("absolute top-1 h-6 rounded shadow-sm", row.color)} style={{ left: `${row.start}%`, width: `${row.width}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="ml-48 mt-5 grid grid-cols-3 gap-3 text-center text-xs font-semibold"><span className="rounded bg-primary/10 p-2 text-primary">Mar 15 · Phase I live</span><span className="rounded bg-cyan/10 p-2 text-foreground">Jul 1 · All counties live</span><span className="rounded bg-coral/10 p-2 text-foreground">Oct · Close</span></div>
      </div>
    </div>
  );
}

function DashboardVisual() {
  const metrics = [["249", "Counties deployed"], ["12 mo", "On schedule"], ["10/10", "Risks closed"], ["0", "Compliance violations"]];
  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(([value, label], i) => <div key={label} className={cn("rounded-lg border p-5 shadow-sm", i === 0 ? "border-primary/30 bg-primary text-primary-foreground" : i === 2 ? "border-cyan/30 bg-cyan/10" : "border-border bg-card/85")}><p className="font-display text-3xl font-bold">{value}</p><p className="mt-2 text-xs font-semibold opacity-75">{label}</p></div>)}
      </div>
      <div className="rounded-lg border border-border bg-card/85 p-5 shadow-sm">
        <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /><h4 className="font-semibold">Phase progress</h4></div>
        {["Phase I", "Phase II", "Project close"].map((phase, i) => <div key={phase} className="mt-5"><div className="flex justify-between text-xs"><span>{phase}</span><span className="font-semibold">100%</span></div><div className="mt-2 h-2 overflow-hidden rounded bg-muted"><div className={cn("h-full w-full rounded", i === 1 ? "bg-cyan" : i === 2 ? "bg-coral" : "bg-primary")} /></div></div>)}
      </div>
    </div>
  );
}

function ImpactVisual() {
  const impacts = [["Revenue", "Recovered lost premiums across 249 counties"], ["Operations", "Zero IT dependency after close"], ["Compliance", "T7/T2 templates · zero violations"], ["Agent trust", "220 agents · zero disengagement"]];
  return <div className="grid gap-3 sm:grid-cols-2">{impacts.map(([title, body], i) => <div key={title} className="rounded-lg border border-border bg-card/85 p-5 shadow-sm transition-transform hover:-translate-y-1"><span className={cn("mb-4 block h-1.5 w-12 rounded", i === 0 ? "bg-primary" : i === 1 ? "bg-cyan" : i === 2 ? "bg-coral" : "bg-foreground")} /><h4 className="font-semibold">{title}</h4><p className="mt-2 text-sm text-muted-foreground">{body}</p></div>)}</div>;
}

function SlideVisual({ visual }: { visual: Slide["visual"] }) {
  if (visual === "case") return <CaseStudyVisual />;
  if (visual === "lifecycle") return <LifecycleVisual />;
  if (visual === "architecture") return <ArchitectureVisual />;
  if (visual === "roadmap") return <RoadmapVisual />;
  if (visual === "dashboard") return <DashboardVisual />;
  return <ImpactVisual />;
}

export default function PresentationDeck() {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const next = useCallback(() => setIndex((value) => Math.min(value + 1, slides.length - 1)), []);
  const prev = useCallback(() => setIndex((value) => Math.max(value - 1, 0)), []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = slides[index] ?? slides[0];
  if (!slide) return null;

  const deck = (
    <div className="overflow-hidden rounded-lg border border-border/80 bg-card/75 shadow-[0_24px_70px_-36px_var(--primary)] backdrop-blur-xl">
      <div className="grid lg:grid-cols-[220px_1fr]">
        <aside className="border-b border-border bg-foreground p-5 text-background lg:border-b-0 lg:border-r">
          <p className="text-xs font-semibold uppercase text-background/60">DTO Texas</p>
          <nav className="mt-5 grid grid-cols-3 gap-2 lg:grid-cols-1" aria-label="Presentation slides">
            {slides.map((item, itemIndex) => (
              <Button key={item.id} variant="ghost" onClick={() => setIndex(itemIndex)} className={cn("h-auto min-h-11 justify-start whitespace-normal px-3 py-2 text-left text-xs text-background/65 hover:bg-background/10 hover:text-background", itemIndex === index && "bg-background/12 text-background")}>
                <span className={cn("mr-1 h-2 w-2 shrink-0 rounded-full", itemIndex === index ? "bg-cyan" : "bg-background/25")} />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>
        <div className="min-w-0 p-5 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase text-primary">{slide.label} · {index + 1}/{slides.length}</p>
              <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">{slide.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{slide.subtitle}</p>
            </div>
            <Button variant="glass" size="icon" onClick={() => setFullscreen(true)} aria-label="Open full-screen presentation"><Expand /></Button>
          </div>
          <div className="mt-7"><SlideVisual visual={slide.visual} /></div>
          <div className="mt-7 flex items-center justify-between border-t border-border pt-4">
            <Button variant="glass" size="icon" onClick={prev} disabled={index === 0} aria-label="Previous slide"><ChevronLeft /></Button>
            <div className="flex gap-1.5">{slides.map((item, itemIndex) => <button key={item.id} type="button" aria-label={`Go to slide ${itemIndex + 1}`} onClick={() => setIndex(itemIndex)} className={cn("h-1.5 rounded-full transition-all", itemIndex === index ? "w-8 bg-primary" : "w-3 bg-border")} />)}</div>
            <Button variant="vivid" size="icon" onClick={next} disabled={index === slides.length - 1} aria-label="Next slide"><ChevronRight /></Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {deck}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button asChild variant="glass"><a href={deckPdf.url} target="_blank" rel="noreferrer"><Download />Full presentation</a></Button>
        <Button asChild variant="glass"><a href={roadmapPdf.url} target="_blank" rel="noreferrer"><Flag />Roadmap PDF</a></Button>
        <Button asChild variant="glass"><a href={dashboardPdf.url} target="_blank" rel="noreferrer"><ShieldCheck />Dashboard PDF</a></Button>
      </div>
      {fullscreen && <div className="fixed inset-0 z-[100] overflow-auto bg-background/96 p-4 backdrop-blur-2xl sm:p-8"><div className="mx-auto max-w-7xl"><div className="mb-4 flex justify-end"><Button variant="glass" size="icon" onClick={() => setFullscreen(false)} aria-label="Exit presentation"><X /></Button></div>{deck}</div></div>}
    </div>
  );
}