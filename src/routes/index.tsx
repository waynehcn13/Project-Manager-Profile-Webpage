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

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Awards", href: "#awards" },
  { label: "Experience", href: "#experience" },
];

const skills = [
  "Agile & Scrum",
  "Stakeholder Management",
  "Risk & Issue Management",
  "Jira & Confluence",
  "Budget Planning",
  "Cross-functional Leadership",
  "Process Optimization",
  "Vendor Management",
];

const projects = [
  {
    title: "Enterprise CRM Migration",
    description:
      "Led a 12-month CRM migration for a 500-person sales organization, coordinating engineering, sales, and external vendors.",
    outcome: "Delivered 2 weeks early and 8% under budget.",
  },
  {
    title: "Mobile App Launch",
    description:
      "Managed end-to-end delivery of a customer-facing iOS and Android app, from discovery through store release.",
    outcome: "Achieved 4.7-star rating and 100K downloads in 90 days.",
  },
  {
    title: "Operational Efficiency Program",
    description:
      "Drove a company-wide process improvement initiative spanning operations, support, and finance teams.",
    outcome: "Reduced cycle time by 25% and saved $400K annually.",
  },
];

const awards = [
  {
    title: "Project Management Professional (PMP)",
    organization: "Project Management Institute",
    year: "2021",
  },
  {
    title: "Top 10 PMs to Watch",
    organization: "ProductCraft Quarterly",
    year: "2023",
  },
  {
    title: "Excellence in Operational Leadership",
    organization: "Internal Leadership Awards",
    year: "2024",
  },
];

const experiences = [
  {
    role: "Senior Project Manager",
    company: "Apex Solutions",
    period: "2022 — Present",
    highlights: [
      "Own portfolio of 5+ concurrent enterprise initiatives with combined budgets over $3M.",
      "Built standardized Agile ceremonies adopted across three product squads.",
      "Improved forecast accuracy by 30% through refined capacity planning.",
    ],
  },
  {
    role: "Project Manager",
    company: "Northbridge Tech",
    period: "2019 — 2022",
    highlights: [
      "Delivered 8 software releases for a B2B SaaS platform serving 2M+ users.",
      "Reduced sprint spillover from 35% to under 10% within two quarters.",
      "Facilitated workshops that aligned stakeholders across five time zones.",
    ],
  },
  {
    role: "Associate Project Coordinator",
    company: "BrightPath Consulting",
    period: "2016 — 2019",
    highlights: [
      "Supported delivery of client implementations ranging from $200K to $1M.",
      "Maintained project documentation and risk registers for leadership reviews.",
      "Recognized for streamlining reporting workflows and improving visibility.",
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
