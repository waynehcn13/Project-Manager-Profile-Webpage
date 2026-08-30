import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Download, Maximize2, X } from "lucide-react";
import deckPdf from "@/assets/dto-deck.pdf.asset.json";
import { cn } from "@/lib/utils";

type Slide = {
  id: string;
  kicker: string;
  title: string;
  body?: string;
  groups?: { heading: string; items: string[] }[];
};

export const slides: Slide[] = [
  {
    id: "intro",
    kicker: "Slide 1",
    title: "Meet Your Project Manager",
    body:
      "12+ years at First American Mortgage Solutions leading 100+ projects, with deep focus on legacy system migrations and workflow automation. PMP, CSM, and Lean Six Sigma Black Belt certified. In late 2023 I stepped into a supervisory role at UPS while completing my Bachelor's at UCI — adding operational discipline to project leadership.",
  },
  {
    id: "cover",
    kicker: "Slide 2 · Case study",
    title: "DTO Texas Policy Rollout",
    body: "Presented by Wayne Nguyen, PMP, CSM, LSSBB.",
  },
  {
    id: "summary",
    kicker: "Slide 3 · Project summary",
    title: "Overview of the DTO Texas Policy Rollout",
    body:
      "Recover lost title insurance premiums by establishing direct-issuance capability across all 249 Texas counties, while raising operational efficiency.",
  },
  {
    id: "foundation",
    kicker: "Slide 4 · Setting the foundation",
    title: "Goals, Triple Constraints & PM Role",
    groups: [
      {
        heading: "Project goals",
        items: [
          "Recover 100% of title premiums across 249 TX counties",
          "Build Wintrack automation end-to-end",
          "Premium split model for 220 agency agents",
          "Self-sustaining ops: revenue up, overhead down, zero compliance violations",
        ],
      },
      {
        heading: "PM role",
        items: [
          "Full resource authority across IT, billing, underwriting, compliance & 3 vendors",
          "Critical path owner — CPM schedule, 15 milestones",
          "Change control lead — 9 scope changes, zero scope creep",
          "Vendor manager — NPS, DataTrace, Allegiance Title",
        ],
      },
      {
        heading: "Triple constraints",
        items: [
          "Scope: 249 counties · 2 phases · 10 deliverables · 9 CCB change requests",
          "Time: 12 months · Phase I +6 wk approved variance · Phase II on schedule",
          "Cost: no external budget — revenue justification model, zero added headcount",
        ],
      },
      {
        heading: "Stakeholder engagement",
        items: [
          "3 sponsors engaged at every phase gate",
          "220 Texas county agents onboarded — zero disengagement",
          "DTO billing team cross-trained and self-sufficient post-launch",
          "Weekly allocation reports and monthly finance reports",
        ],
      },
    ],
  },
  {
    id: "lifecycle",
    kicker: "Slide 5 · Methodology",
    title: "Hybrid Project Life Cycle",
    groups: [
      {
        heading: "Phase 1 — Initiation (Waterfall)",
        items: ["Charter & authorization", "Stakeholder ID", "Scope boundary", "Revenue justification"],
      },
      {
        heading: "Phase 2 — Planning",
        items: ["WBS development", "CPM schedule", "Risk register", "Resource plan", "Vendor SLAs"],
      },
      {
        heading: "Phase 3 — Execution (Agile sprints)",
        items: [
          "Sprint 1: Wintrack build & templates",
          "Sprint 2: billing automation & UAT",
          "Sprint 3: county config & go-live",
          "Review → feedback → adapt → next sprint",
        ],
      },
      {
        heading: "Phase 4 — Deployment & closing (Waterfall)",
        items: ["Staged rollout", "Phase gate review", "Vendor redistribution", "Formal close"],
      },
    ],
  },
  {
    id: "architecture",
    kicker: "Slide 6 · Program architecture",
    title: "249 Counties · Oct 2023 – Oct 2024",
    groups: [
      {
        heading: "Foundation — Phase I",
        items: [
          "D-01 Title templates",
          "D-03 Wintrack (backbone)",
          "D-05 Curative process",
          "D-06 Digital signature",
          "D-07 MSCC calculator",
        ],
      },
      {
        heading: "Operational — Phase I & II",
        items: ["D-02 Automated billing (revenue collection engine)", "D-04 Premium allocation (split calculation engine)"],
      },
      {
        heading: "Outcomes — Phase II+",
        items: [
          "D-08 Allocation reports (financial visibility)",
          "D-09 Educational broadcast (agent adoption)",
          "D-10 Vendor redistribution (scalability engine)",
        ],
      },
    ],
  },
  {
    id: "schedule",
    kicker: "Slide 7 · Schedule",
    title: "Gantt — Two Phases, 15 Milestones",
    groups: [
      {
        heading: "Phase I (Oct 2023 – Mar 2024)",
        items: [
          "Initiation · Phase I state selection · financial analysis",
          "Wintrack workflow & automation · billing integration",
          "Signature integration · T7/T2 template validation",
          "County readiness reviews → Go-live 29 CPU counties (03/15/2024)",
        ],
      },
      {
        heading: "Phase II (Mar – Sep 2024)",
        items: [
          "Phase II planning · Wintrack Phase II automation",
          "Agent contact loading (220 counties) · premium split configuration",
          "7 high-volume counties go-live (06/15) · 213 remaining (07/01)",
          "MSCC calculator update · CPU redistribution (NPS/DataTrace) · P24 (Allegiance)",
        ],
      },
      {
        heading: "Close (Sep – Oct 2024)",
        items: ["Educational broadcast to agents", "Project completion & formal close"],
      },
    ],
  },
  {
    id: "metrics",
    kicker: "Slide 8 · Outcomes",
    title: "Key Performance Indicators at Close",
    body:
      "Deployment and compliance metrics tracked to project close across all 249 counties — full premium recovery, all milestones delivered, zero compliance violations.",
  },
  {
    id: "impact",
    kicker: "Slide 9 · Business impact",
    title: "Key Business Impact Areas",
    groups: [
      { heading: "Revenue", items: ["Recovered lost premiums across all 249 Texas counties"] },
      { heading: "Operations", items: ["Self-sustaining model with zero IT dependency post-close"] },
      { heading: "Underwriting", items: ["T7 and T2 templates ensuring compliance — zero violations"] },
      { heading: "Agent relations", items: ["220 agents onboarded with zero disengagement"] },
    ],
  },
  {
    id: "lessons",
    kicker: "Slide 10 · Retrospective",
    title: "Lessons Learned",
    groups: [
      { heading: "What went well", items: ["Staged rollout minimized disruption and smoothed county transitions"] },
      { heading: "What to improve", items: ["Earlier financial analysis to surface issues and allocate resources pre-go-live"] },
    ],
  },
  {
    id: "highlights",
    kicker: "Slide 11 · Special highlights",
    title: "Complexity Handled",
    groups: [
      { heading: "Regulatory", items: ["5 ALTA-restricted counties routed to separate NPS TEN vendor paths, excluded via sponsor-approved change control"] },
      { heading: "Vendor complexity", items: ["Mid-project NPS → DataTrace redistribution in Aug 2024 with zero disruption"] },
      { heading: "Tech adoption", items: ["Wintrack built from scratch as the automation backbone for all 249 counties"] },
      { heading: "Financial discipline", items: ["Revenue justification model increased revenue while decreasing overhead"] },
    ],
  },
  {
    id: "thanks",
    kicker: "Slide 12",
    title: "Thank You & Questions",
    groups: [
      {
        heading: "Contact",
        items: ["waynehcn@gmail.com", "linkedin.com/in/wayne-nguyen1", "714-933-6503"],
      },
    ],
  },
];

function SlideBody({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {slide.kicker}
      </p>
      <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{slide.title}</h3>
      {slide.body && (
        <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground">{slide.body}</p>
      )}
      {slide.groups && (
        <div className="mt-6 grid flex-1 gap-5 sm:grid-cols-2">
          {slide.groups.map((group) => (
            <div key={group.heading} className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-foreground">{group.heading}</p>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted-foreground">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PresentationDeck() {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, slides.length - 1)), []);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const slide = slides[index]!;

  const controls = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={prev}
        disabled={index === 0}
        aria-label="Previous slide"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="min-w-16 text-center text-sm font-medium tabular-nums text-muted-foreground">
        {index + 1} / {slides.length}
      </span>
      <button
        type="button"
        onClick={next}
        disabled={index === slides.length - 1}
        aria-label="Next slide"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        {controls}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFullscreen(true)}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Maximize2 className="h-4 w-4" />
            Present
          </button>
          <a
            href={deckPdf.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Download className="h-4 w-4" />
            PDF
          </a>
        </div>
      </div>

      <div className="mt-5 min-h-[26rem] rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
        <SlideBody slide={slide} />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-current={i === index}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
              i === index
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {fullscreen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background p-4 sm:p-8">
          <div className="flex items-center justify-between">
            {controls}
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              aria-label="Exit presentation"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-6 flex-1 overflow-auto rounded-xl border border-border bg-card p-6 sm:p-10">
            <SlideBody slide={slide} />
          </div>
        </div>
      )}
    </div>
  );
}
