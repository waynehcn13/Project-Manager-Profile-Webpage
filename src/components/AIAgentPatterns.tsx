import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Bot, Clock, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

// Same "comes alive on scroll / reveal" primitives PresentationDeck.tsx uses,
// repurposed here to stagger-reveal trace steps as they "play out" once a
// response lands (the backend returns the full trace in one shot, not as a
// stream — this animates the reveal client-side instead).
const revealClass = "transition-all duration-500 ease-out";
function revealState(shown: boolean, index: number) {
  return {
    className: cn(revealClass, shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"),
    style: { transitionDelay: shown ? `${index * 220}ms` : "0ms" },
  };
}

const API_BASE =
  (import.meta.env["VITE_AI_AGENTS_API_URL"] as string | undefined) ||
  "https://ai-agent-design-structure-production.up.railway.app";

// Mirrors agents/shared.py's SAMPLE_MESSY_INPUT verbatim.
const SAMPLE_INPUT = `- Sarah says the API integration is basically done, just waiting on something from the DevOps side before we can call it done-done.
- Mike mentioned the dashboard redesign is stalled, not totally sure why — he said "later this week" for an update.
- Payment gateway testing — Priya thinks it'll be ready soon, maybe by end of month? Blocked on legal review last we heard, but that was a while ago.
- Data migration script: no update since last Tuesday, might be done, might not — need to check with Jon.
- Onboarding flow UI looks good, QA found a couple bugs, ETA for fixes unclear.
`;

// Matches the backend's 8KB request body cap (MAX_BODY_BYTES in main.py),
// with margin for the JSON wrapper ({"raw_text": "..."}) around the text.
const MAX_CHARS = 7000;

type TaskStatusValue = "on_track" | "at_risk" | "blocked" | "done" | "unknown";

type TaskStatus = {
  name: string;
  owner: string | null;
  status: TaskStatusValue;
  due_date: string | null;
  blockers: string[];
  notes: string | null;
};

type TraceStep = {
  step: number;
  phase: string;
  title: string;
  detail: string;
};

type AgentResult = {
  pattern: string;
  model: string;
  report: {
    summary: string;
    tasks: TaskStatus[];
    open_questions: string[];
  };
  trace: TraceStep[];
};

type Pattern = {
  id: string;
  slug: string;
  label: string;
  caption: string;
};

const PATTERNS: Pattern[] = [
  {
    id: "single-shot",
    slug: "single-shot",
    label: "Single-shot",
    caption: "One prompt, one pass — no self-correction.",
  },
  {
    id: "react",
    slug: "react",
    label: "ReAct",
    caption: "Reasons and acts in a loop, checking its own work step by step.",
  },
  {
    id: "planner-executor",
    slug: "planner-executor",
    label: "Planner-Executor",
    caption: "Plans the whole task up front, then executes each piece.",
  },
  {
    id: "reflexive",
    slug: "reflexive",
    label: "Reflexive",
    caption: "Drafts an answer, then critiques and revises its own output.",
  },
  {
    id: "verifier-gated",
    slug: "verifier-gated",
    label: "Verifier-Gated",
    caption: "Proposes an answer, then a separate verification pass gates whether it ships.",
  },
];

const phaseAccent: Record<string, string> = {
  reason: "bg-primary/12 text-primary",
  plan: "bg-primary/12 text-primary",
  propose: "bg-primary/12 text-primary",
  draft: "bg-primary/12 text-primary",
  invoke: "bg-primary/12 text-primary",
  act: "bg-cyan/14 text-foreground",
  execute: "bg-cyan/14 text-foreground",
  observe: "bg-cyan/14 text-foreground",
  aggregate: "bg-cyan/14 text-foreground",
  critique: "bg-coral/12 text-coral",
  verify: "bg-coral/12 text-coral",
  refine: "bg-coral/12 text-coral",
  retry: "bg-coral/12 text-coral",
  final: "bg-foreground text-background",
};
const fallbackPhaseAccent = "bg-muted text-muted-foreground";

const statusLabel: Record<TaskStatusValue, string> = {
  on_track: "On track",
  at_risk: "At risk",
  blocked: "Blocked",
  done: "Done",
  unknown: "Unknown",
};
const statusAccent: Record<TaskStatusValue, string> = {
  on_track: "bg-primary/12 text-primary",
  at_risk: "bg-coral/12 text-coral",
  blocked: "bg-destructive/12 text-destructive",
  done: "bg-cyan/14 text-foreground",
  unknown: "bg-muted text-muted-foreground",
};

type RunState =
  | { status: "idle" }
  | { status: "loading"; startedAt: number }
  | { status: "error"; message: string }
  | { status: "done"; result: AgentResult };

function friendlyError(res: Response | null, err: unknown): string {
  if (res?.status === 429) {
    return "You've hit the demo's rate limit (5 requests/hour) — try again later.";
  }
  if (res) {
    return `The backend returned an error (HTTP ${res.status}). Try again in a moment.`;
  }
  if (err instanceof TypeError) {
    return "Couldn't reach the live demo backend right now — it may be waking up from idle, or temporarily unreachable.";
  }
  return "Something went wrong running this agent. Try again.";
}

function ElapsedTimer({ startedAt }: { startedAt: number }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const id = window.setInterval(
      () => setElapsed(Math.floor((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => window.clearInterval(id);
  }, [startedAt]);
  return (
    <span className="tabular-nums">
      {elapsed}s elapsed — this can take up to ~2 minutes depending on the pattern.
    </span>
  );
}

function TraceView({ trace }: { trace: TraceStep[] }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.1);
  const [shownCount, setShownCount] = useState(0);

  useEffect(() => {
    setShownCount(0);
    if (!inView) return;
    let cancelled = false;
    trace.forEach((_, index) => {
      window.setTimeout(() => {
        if (!cancelled) setShownCount((value) => Math.max(value, index + 1));
      }, index * 220);
    });
    return () => {
      cancelled = true;
    };
  }, [trace, inView]);

  return (
    <div ref={ref} className="space-y-3">
      {trace.map((step, index) => {
        const shown = index < shownCount;
        const reveal = revealState(shown, index);
        return (
          <div
            key={step.step}
            style={reveal.style}
            className={cn(
              "rounded-lg border border-border/80 bg-card/70 p-4 shadow-sm backdrop-blur-xl",
              reveal.className,
            )}
          >
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase",
                  phaseAccent[step.phase] ?? fallbackPhaseAccent,
                )}
              >
                {step.phase}
              </span>
              <span className="text-xs font-semibold text-muted-foreground">Step {step.step}</span>
              <h4 className="w-full text-sm font-semibold sm:w-auto">{step.title}</h4>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
              {step.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ReportView({ report }: { report: AgentResult["report"] }) {
  return (
    <div className="mt-6 rounded-lg border border-primary/25 bg-primary/5 p-5">
      <p className="text-xs font-bold uppercase text-primary">Final report</p>
      <p className="mt-3 text-sm leading-relaxed text-foreground">{report.summary}</p>
      {report.tasks.length > 0 && (
        <ul className="mt-4 space-y-3">
          {report.tasks.map((task) => (
            <li
              key={task.name}
              className="rounded-lg border border-border/70 bg-card/80 p-4 text-sm shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{task.name}</span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase",
                    statusAccent[task.status],
                  )}
                >
                  {statusLabel[task.status]}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                {task.owner && <span>Owner: {task.owner}</span>}
                {task.due_date && <span>Due: {task.due_date}</span>}
              </div>
              {task.blockers.length > 0 && (
                <p className="mt-2 text-xs text-coral">Blockers: {task.blockers.join("; ")}</p>
              )}
              {task.notes && (
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{task.notes}</p>
              )}
            </li>
          ))}
        </ul>
      )}
      {report.open_questions.length > 0 && (
        <div className="mt-4 border-t border-primary/15 pt-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Open questions</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-xs leading-relaxed text-muted-foreground">
            {report.open_questions.map((question) => (
              <li key={question}>{question}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function AIAgentPatterns() {
  const [patternId, setPatternId] = useState(PATTERNS[0]!.id);
  const pattern = PATTERNS.find((item) => item.id === patternId) ?? PATTERNS[0]!;
  const [textByPattern, setTextByPattern] = useState<Record<string, string>>({});
  const [runByPattern, setRunByPattern] = useState<Record<string, RunState>>({});
  const abortRef = useRef<AbortController | null>(null);

  const text = textByPattern[pattern.id] ?? "";
  const run = runByPattern[pattern.id] ?? { status: "idle" as const };

  const selectPattern = useCallback((id: string) => {
    setPatternId(id);
  }, []);

  const setText = useCallback(
    (value: string) => {
      setTextByPattern((prev) => ({ ...prev, [pattern.id]: value.slice(0, MAX_CHARS) }));
    },
    [pattern.id],
  );

  const useSample = useCallback(() => {
    setText(SAMPLE_INPUT);
  }, [setText]);

  const runAgent = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const startedAt = Date.now();
    setRunByPattern((prev) => ({ ...prev, [pattern.id]: { status: "loading", startedAt } }));

    let res: Response | null = null;
    try {
      res = await fetch(`${API_BASE}/agents/${pattern.slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: text.trim() || null }),
        signal: controller.signal,
      });
      if (!res.ok) {
        setRunByPattern((prev) => ({
          ...prev,
          [pattern.id]: { status: "error", message: friendlyError(res, null) },
        }));
        return;
      }
      const result = (await res.json()) as AgentResult;
      setRunByPattern((prev) => ({ ...prev, [pattern.id]: { status: "done", result } }));
    } catch (err) {
      if (controller.signal.aborted) return;
      setRunByPattern((prev) => ({
        ...prev,
        [pattern.id]: { status: "error", message: friendlyError(res, err) },
      }));
    }
  }, [pattern.id, pattern.slug, text]);

  return (
    <div>
      <div
        className="mb-4 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Choose an agent pattern"
      >
        {PATTERNS.map((item) => (
          <Button
            key={item.id}
            variant={item.id === pattern.id ? "vivid" : "glass"}
            size="sm"
            role="tab"
            aria-selected={item.id === pattern.id}
            onClick={() => selectPattern(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border/80 bg-card/75 p-5 shadow-[0_24px_70px_-36px_var(--primary)] backdrop-blur-xl sm:p-7">
        <div className="flex items-start gap-3">
          <Bot className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">{pattern.caption}</p>
        </div>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-coral/20 bg-coral/5 p-4 text-xs leading-relaxed text-muted-foreground">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-coral" />
          <p>
            <strong className="text-foreground">Real finding from testing:</strong> only the ReAct
            agent got the date math (resolving phrases like "last Tuesday" and "end of month" to
            real dates) fully correct on the first try. The others either guessed wrong or needed a
            self-critique pass to catch it.
          </p>
        </div>

        <div className="mt-5">
          <Textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder='Paste your own messy project update, or click "Use sample"...'
            maxLength={MAX_CHARS}
            rows={6}
            className="text-sm"
          />
          <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Leave blank to let the agent use its own sample input.</span>
            <span className="tabular-nums">
              {text.length} / {MAX_CHARS}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button variant="glass" size="sm" onClick={useSample} disabled={run.status === "loading"}>
            Use sample
          </Button>
          <Button variant="vivid" size="sm" onClick={runAgent} disabled={run.status === "loading"}>
            {run.status === "loading" && <Loader2 className="animate-spin" />}
            Run agent
          </Button>
        </div>

        {run.status === "loading" && (
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-border/70 bg-muted/40 p-4 text-xs text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <ElapsedTimer startedAt={run.startedAt} />
          </div>
        )}

        {run.status === "error" && (
          <div className="mt-5 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/8 p-4 text-xs leading-relaxed text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>{run.message}</p>
          </div>
        )}

        {run.status === "done" && (
          <div className="mt-6">
            <TraceView trace={run.result.trace} />
            <ReportView report={run.result.report} />
          </div>
        )}
      </div>
    </div>
  );
}
