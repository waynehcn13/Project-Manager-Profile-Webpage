import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Linkedin, Briefcase, Award, FolderKanban, Wrench } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wayne Nguyen | Project Manager Portfolio" },
      { name: "description", content: "Portfolio of Wayne Nguyen, a results-driven Project Manager delivering complex cross-functional projects on time and on budget." },
      { property: "og:title", content: "Wayne Nguyen | Project Manager Portfolio" },
      { property: "og:description", content: "Portfolio of Wayne Nguyen, a results-driven Project Manager delivering complex cross-functional projects on time and on budget." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const EMAIL = "waynehcn@gmail.com";
const LINKEDIN = "https://linkedin.com/in/wayne-nguyen1";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Awards", href: "#awards" },
  { label: "Experience", href: "#experience" },
];

const skills = [
  "Project Management",
  "Agile Methodology",
  "Waterfall Methodology",
  "Lean Six Sigma",
  "Risk Management",
  "Stakeholder Engagement",
  "Team Development",
  "Logistics",
  "Jira & Confluence",
  "Asana",
  "MS Project",
  "Azure DevOps",
  "Slack",
  "Microsoft Office Suite",
  "SQL / MySQL",
  "AI Tools (ChatGPT, Claude, Perplexity)",
];

const projects = [
  {
    title: "Third-Party API & EDI Integrations",
    description:
      "Led 10+ inbound and outbound API and EDI connector initiatives as the primary liaison between customers, technical teams, and vendors — from intake through go-live.",
    outcome: "Improved processing efficiency by 1+ business day per initiative.",
  },
  {
    title: "ERP Legacy Data Migration",
    description:
      "Managed two internal ERP legacy system migration and enhancement initiatives, migrating business reporting, data, and image files while reconstructing system functionality.",
    outcome: "Client satisfaction +10%, system efficiency +15%.",
  },
  {
    title: "Enterprise Title Insurance Program",
    description:
      "Spearheaded 3 enterprise title insurance initiatives delivering a 50-state solution and expanding underwriting presence nationwide.",
    outcome: "Production cost -15%, closings +20%.",
  },
  {
    title: "Workflow Automation & Data Mapping",
    description:
      "Initiated 100+ workflow, automation, and data mapping initiatives using flow diagrams, fishbone analysis, Pareto charts, and process mapping.",
    outcome: "Reduced production time by 2 business days.",
  },
  {
    title: "Business Reporting & Analytics",
    description:
      "Led 30+ business system reporting initiatives, leveraging metrics to surface bottlenecks and drive continuous improvement.",
    outcome: "15+ bottlenecks identified, efficiency +15%.",
  },
  {
    title: "Portfolio Delivery — 100+ Projects",
    description:
      "Launched 100+ projects from initiation to closure with rigorous planning, budget control, and execution discipline.",
    outcome: "$5M additional revenue, costs -30%, production efficiency +20%.",
  },
];

const awards = [
  {
    title: "Lean Six Sigma Black Belt (LSSBB)",
    organization: "Aveta Business Institute (SSO-CSSC)",
    year: "2025",
  },
  {
    title: "RAID LOG Practitioner",
    organization: "RAIDLOG",
    year: "2025",
  },
  {
    title: "Project Management Professional (PMP) — ID 3783522",
    organization: "Project Management Institute (PMI)",
    year: "2024",
  },
  {
    title: "Certified ScrumMaster (CSM) — ID 1490153",
    organization: "Scrum Alliance",
    year: "2023",
  },
  {
    title: "Finance Project Manager, Budget & Forecasting (Volunteer)",
    organization: "PMI — Orange County Chapter",
    year: "2024 — 2025",
  },
  {
    title: "MBA, Data Analytics (In Progress)",
    organization: "Louisiana State University Shreveport",
    year: "Expected 2027",
  },
  {
    title: "Bachelor of Arts, Sociology",
    organization: "University of California, Irvine",
    year: "2025",
  },
  {
    title: "Certification in Project Management",
    organization: "UC Irvine, Continuing Education",
    year: "2020",
  },
];

const experiences = [
  {
    role: "Supervisor",
    company: "United Parcel Service (UPS) — Anaheim, CA",
    period: "Jul 2024 — Present",
    highlights: [
      "Oversee inventory management for a 150,000 sq. ft. facility with 95% scanning accuracy across 25,000+ daily packages and a miss-load rate below 0.3%.",
      "Manage resources and workload for a team of 10, achieving 97% on-time delivery and holding labor cost 12% under budget.",
      "Implemented QA/QC processes that cut mis-sorts by 35% and hold 99% accuracy on air priority manifest validation across 800+ daily packages.",
      "Lead daily stand-ups and weekly retrospectives with 98% attendance, driving 5+ process improvements that increased sorting speed by 10%.",
      "Training program delivers a 92% first-time certification pass rate and cut onboarding from 3 weeks to 2.",
      "Safety leadership: 100+ consecutive days without a lost-time incident and 95% monthly audit compliance.",
    ],
  },
  {
    role: "Project Manager",
    company: "First American Mortgage Solutions — Santa Ana, CA",
    period: "Apr 2017 — Sept 2023",
    highlights: [
      "Launched 100+ projects from initiation to closure, generating $5M in additional revenue, +20% production efficiency, and -30% operational costs.",
      "Led 10+ third-party API and EDI integration initiatives and two ERP legacy data migrations.",
      "Directed financial planning, forecasting, and variance reviews for 800+ monthly title policies ($800K–$1M budget), saving 10%.",
      "Managed 50+ stakeholders on a single project and led 500+ project meetings, improving transparency by 15%.",
      "Owned UAT execution with checklists and requirement traceability matrices, achieving 95%+ user satisfaction at release.",
      "Built risk registers, responses, and contingency plans that reduced project risk by 10%.",
    ],
  },
  {
    role: "Client Relations Manager",
    company: "First American Mortgage Solutions — Santa Ana, CA",
    period: "Apr 2017 — Sept 2023",
    highlights: [
      "Led and groomed a self-organized team of 7, delivering 100+ completed special projects.",
      "Facilitated 200+ weekly vendor management meetings with root cause analysis and remediation, lifting vendor quality performance by 36%.",
      "Led 100+ client change management initiatives with 98% documented, impact-analyzed, and approved change requests.",
      "Reviewed 500+ title insurance files monthly and served 45+ direct lenders at a 95% satisfaction rating.",
      "Performed 50+ monthly statistical samples and internal audits, driving 15% process improvement.",
    ],
  },
  {
    role: "Customer Service Supervisor | Operations Supervisor",
    company: "First American Mortgage Solutions — Santa Ana, CA",
    period: "Mar 2015 — Apr 2017",
    highlights: [
      "Led a team of 5 and redesigned workflows that cut client response time from 5 days to 2.",
      "Improved 16+ production processes and authored 30+ procedures for onshore and offshore teams, reducing user errors by 15%.",
      "Supported 13+ technology improvement projects with IT and Operations, raising project visibility by 10%.",
      "Participated in 20+ quality audits and helped the organization obtain two ISO certifications.",
    ],
  },
  {
    role: "Senior CSR | Account Manager",
    company: "First American Mortgage Solutions — Santa Ana, CA",
    period: "Nov 2009 — Mar 2015",
    highlights: [
      "Led a team of 4 and increased customer satisfaction by 15% through coaching and service standards.",
      "Resolved 100+ escalated customer issues and used trend analysis to reduce reported issues by 20%.",
      "Governed 20+ special projects and submitted 50+ technology tickets for workflow improvements.",
    ],
  },
  {
    role: "Operations Manager | Mortgage Loan Officer",
    company: "American First Financial Corporation — Los Angeles, CA",
    period: "Feb 2005 — Mar 2008",
    highlights: [
      "Oversaw loan processing, underwriting, and closing for 50+ loans monthly, boosting monthly revenue by 10%.",
      "Directed 4+ processors, 2+ underwriters, and 3+ closers with coaching and quarterly training, lifting performance by 12%.",
      "Tracked 5+ KPIs with data analytics and reporting tools to drive an 8% efficiency gain.",
    ],
  },
];


function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            Wayne Nguyen
          </Link>
          <nav className="hidden gap-6 text-sm font-medium text-muted-foreground sm:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        {/* Hero */}
        <section id="about" className="py-24 sm:py-32">
          <p className="text-sm font-medium text-muted-foreground">Project Manager</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Wayne Nguyen
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            I am a results-driven Project Manager with 8+ years of experience delivering
            complex, cross-functional initiatives across product, engineering, and operations.
            I specialize in turning ambiguity into structured plans, aligning diverse
            stakeholders, and shipping work that matters on time and on budget.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="mailto:wayne.nguyen@example.com"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" />
              Get in touch
            </a>
            <a
              href="https://linkedin.com/in/wayne-nguyen"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="border-t border-border py-16 sm:py-24">
          <div className="flex items-center gap-3">
            <Wrench className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">Skills</h2>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {skills.map((skill) => (
              <div
                key={skill}
                className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-sm font-medium text-foreground"
              >
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="border-t border-border py-16 sm:py-24">
          <div className="flex items-center gap-3">
            <FolderKanban className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">Projects</h2>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <article
                key={project.title}
                className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <p className="mt-4 text-sm font-medium text-foreground">{project.outcome}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section id="awards" className="border-t border-border py-16 sm:py-24">
          <div className="flex items-center gap-3">
            <Award className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">Awards & Achievements</h2>
          </div>
          <ul className="mt-8 space-y-4">
            {awards.map((award) => (
              <li
                key={award.title}
                className="flex flex-col justify-between gap-1 rounded-lg border border-border bg-muted/30 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-medium text-foreground">{award.title}</p>
                  <p className="text-sm text-muted-foreground">{award.organization}</p>
                </div>
                <span className="text-sm font-medium text-muted-foreground">{award.year}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Experience */}
        <section id="experience" className="border-t border-border py-16 sm:py-24">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-2xl font-semibold tracking-tight">Work Experience</h2>
          </div>
          <div className="mt-8 space-y-8">
            {experiences.map((job) => (
              <div key={job.role} className="relative pl-6 sm:pl-8">
                <span className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-foreground/40" />
                <div className="border-l border-border pl-6 sm:pl-8">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-lg font-semibold">{job.role}</h3>
                    <span className="text-sm font-medium text-muted-foreground">{job.period}</span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{job.company}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">
                    {job.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wayne Nguyen. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="mailto:wayne.nguyen@example.com"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              wayne.nguyen@example.com
            </a>
            <a
              href="https://linkedin.com/in/wayne-nguyen"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
