import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Linkedin, Briefcase, Award, FolderKanban, Wrench, Presentation } from "lucide-react";
import PresentationDeck from "@/components/PresentationDeck";


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
  { label: "Presentation", href: "#presentation" },
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
    title: "Employee of the Year",
    organization: "First American Mortgage Solutions — First American Title",
    year: "Mar 2011",
    description:
      "Recognized for dedication to exceptional customer service, strong work ethic, attention to detail, and consistently going above and beyond for clients and colleagues. This award reflects the high standards of excellence and core values of First American Title, the nation's leading title insurance provider.",
  },
  {
    title: "Award of Excellence",
    organization: "First American Mortgage Solutions — First American Title",
    year: "Sep 2016",
  },
  {
    title: "Award of Excellence",
    organization: "First American Mortgage Solutions — First American Title",
    year: "Sep 2013",
  },
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
      "Lead a 10-person morning operations team across a 150,000 sq ft facility, delivering 97% on-time performance and a 35% reduction in missorts through QA/QC frameworks and Lean Six Sigma methods.",
      "Manage inventory operations for 25,000+ daily packages with 95% scanning accuracy and 99% air priority manifest validation across 800+ daily air packages; maintain labor cost 12% under budget.",
      "Design training programs achieving a 92% first-time certification pass rate and 25% reduction in onboarding time; drive 15% improvement in team satisfaction and 40% reduction in turnover.",
      "Leverage AI tools (Claude AI, ChatGPT) for operations reporting, meeting summarization, and process documentation; enforce safety procedures achieving 100+ consecutive days without lost-time incidents.",
    ],
  },
  {
    role: "Project Manager & Client Relations Manager",
    company: "First American Mortgage Solutions — Santa Ana, CA",
    period: "Apr 2017 — Sept 2023",
    highlights: [
      "Delivered 100+ enterprise projects from initiation through go-live, generating $5M+ in incremental revenue, 20% production efficiency gain, and 30% operational cost reduction.",
      "Led 10+ third-party API and EDI integration initiatives as primary liaison between clients, technical teams, and vendors; improved processing efficiency by 1+ business day per integration.",
      "Managed two enterprise ERP data migrations and system enhancement initiatives; reconstructed system functionality across business reporting, data, and image workflows, increasing system efficiency 15% and client satisfaction 10%.",
      "Spearheaded three enterprise title insurance initiatives delivering a 50-state coverage solution; reduced production cost 15% and increased nationwide policy closings 20%.",
      "Managed billing and payment operations for 800+ title insurance policies monthly ($800K–$1M budget); delivered 10% cost savings through strategic financial planning, forecasting, and variance analysis.",
      "Led 100+ change management initiatives leveraging the Change Management 101 framework and Plan-Do-Sustain model; achieved 98% documentation, impact analysis, and approval traceability.",
      "Orchestrated 200+ weekly vendor management engagements; executed root cause analyses and remediation plans that strengthened vendor quality performance by 36%.",
      "Directed 15+ cross-functional teams and managed 50+ stakeholders per initiative using stakeholder engagement analysis techniques; reduced negative stakeholder impact 10% and improved team alignment 15%.",
      "Performed 50+ monthly statistical sampling audits and applied data analytics to identify bottlenecks; drove 15+ process improvements across quality operations.",
    ],
  },
  {
    role: "Customer Service Supervisor & Senior CSR / Account Manager",
    company: "First American Mortgage Solutions — Santa Ana, CA",
    period: "Sept 2008 — Apr 2017",
    highlights: [
      "Progressed from Customer Service Representative to Operations Supervisor over 9 years; led teams of 4–5 CSRs delivering 15% customer satisfaction gains and 20% reduction in escalated issues.",
      "Established quality assurance frameworks supporting the organization's achievement of two ISO certifications; served as point of contact for annual vendor audits and quality reviews.",
      "Partnered with IT and Operations on 13+ technology improvement projects including UAT frameworks, process automation, and workflow optimization initiatives.",
      "Maintained relationships with 43+ direct lenders; onboarded new clients, delivered training, and identified 26+ upselling opportunities driving a 15% increase in client engagement.",
    ],
  },
  {
    role: "Operations Manager & Sales Associate",
    company: "American First Financial Corporation — Los Angeles, CA",
    period: "Feb 2005 — Mar 2008",
    highlights: [
      "Directed an operations team of 10+ (loan processors, underwriters, closers) managing 50+ monthly loan closings; grew monthly revenue 10% while maintaining regulatory compliance.",
      "Utilized data analytics and KPI reporting across 5+ key performance indicators to drive data-driven decisions; achieved an 8% organizational efficiency gain.",
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
          <p className="text-sm font-medium text-muted-foreground">
            Program & Project Manager · PMP, CSM, LSSBB
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Wayne Nguyen
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            12+ years leading enterprise projects at First American Mortgage Solutions —
            100+ initiatives spanning legacy system migrations, workflow automation, and
            multi-state title insurance rollouts. PMP, CSM, and Lean Six Sigma Black Belt.
          </p>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            In late 2023 I made a strategic pivot: a supervisory role at UPS while completing
            my degree at UC Irvine, adding hands-on operational accountability to project
            leadership. Now pursuing an MBA in Data Analytics at LSU Shreveport and focused on
            AI adoption and data-driven delivery. Based in Garden Grove, California.
          </p>
          <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { k: "12+", v: "Years in PM" },
              { k: "100+", v: "Projects delivered" },
              { k: "$5M+", v: "Revenue generated" },
              { k: "249", v: "TX counties rolled out" },
            ].map((stat) => (
              <div key={stat.v} className="rounded-lg border border-border bg-muted/40 px-4 py-3">
                <dt className="text-2xl font-bold tracking-tight text-foreground">{stat.k}</dt>
                <dd className="mt-1 text-xs font-medium text-muted-foreground">{stat.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" />
              Get in touch
            </a>
            <a
              href={LINKEDIN}
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
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
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
            <h2 className="text-2xl font-semibold tracking-tight">
              Awards, Certifications & Education
            </h2>
          </div>
          <ul className="mt-8 space-y-4">
            {awards.map((award) => (
              <li
                key={`${award.title}-${award.year}`}
                className="rounded-lg border border-border bg-muted/30 px-5 py-4"
              >
                <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-start">
                  <div>
                    <p className="font-medium text-foreground">{award.title}</p>
                    <p className="text-sm text-muted-foreground">{award.organization}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-muted-foreground">{award.year}</span>
                </div>
                {award.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {award.description}
                  </p>
                )}
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
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4" />
              {EMAIL}
            </a>
            <a
              href={LINKEDIN}
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
