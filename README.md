# My PM Portfolio

![CI](https://github.com/waynehcn13/Project-Manager-Profile-Webpage/actions/workflows/ci.yml/badge.svg)

Build a clean, modern personal portfolio webpage for a Project Manager. Include a hero section with my name and bio, a skills section, a projects section, my awards & achievements, my work experience and a footer with my LinkedIn and email. Use a minimal design with white background and dark text.

This project was built with [Lovable](https://lovable.dev).

**Live app (Lovable)**: https://waynenguyenportfolio.lovable.app
**Live app (Vercel)**: https://waynehoangnguyen.vercel.app

Both deploy automatically from the `main` branch on every push — Vercel builds and redeploys immediately, and Lovable syncs the code but needs a manual Publish (in the Lovable editor) before its live URL updates.

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/605aa850-b412-4526-9136-969051992cb2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

This project uses [Bun](https://bun.sh) as its package manager (see `bun.lock`).

```sh
git clone https://github.com/waynehcn13/Project-Manager-Profile-Webpage.git
cd Project-Manager-Profile-Webpage
bun install
bun run dev
```

### Scripts

| Command             | Purpose                                  |
| -------------------- | ----------------------------------------- |
| `bun run dev`         | Start the Vite dev server                 |
| `bun run build`       | Production build                          |
| `bun run build:dev`   | Development-mode build                    |
| `bun run preview`     | Preview a production build locally        |
| `bun run lint`        | Run ESLint                                |
| `bun run format`      | Format the codebase with Prettier         |
| `bunx tsc --noEmit`   | Type-check without emitting output        |

### Environment variables

Supabase access lives in `.env` (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, etc.). These are the public/publishable Supabase keys, safe for client-side use — actual data access is governed by Supabase Row Level Security policies, not by keeping this key secret.

An optional `VITE_AI_AGENTS_API_URL` overrides the backend URL used by the AI Agent Design Patterns section (see below); it defaults to the deployed Railway instance, so it's only needed to point the demo at a local backend during development.

### AI Agent Design Patterns demo

The "AI Agents" section (`src/components/AIAgentPatterns.tsx`) is an interactive demo of a separate side project, [AI-Agent-Design-Structure](https://github.com/waynehcn13/AI-Agent-Design-Structure) — a FastAPI backend deployed on Railway that implements five agent design patterns (single-shot, ReAct, planner-executor, reflexive, verifier-gated), all solving the same task: turning a messy, informal project update into a structured status report. A visitor picks a pattern, runs the sample text or their own, and watches the agent's step-by-step reasoning trace alongside the final report.

The browser calls the live backend directly (`https://ai-agent-design-structure-production.up.railway.app` by default). That backend rate-limits to 5 requests/hour per IP and only accepts cross-origin requests from origins listed in its `ALLOWED_ORIGINS` env var on Railway — currently `waynehoangnguyen.com`, `www.waynehoangnguyen.com`, `waynehoangnguyen.vercel.app`, and a few `localhost` dev ports. If this section stops working after changing domains or running the dev server on a new port, that allowlist is the first thing to check.

### Continuous integration

Every push and pull request against `main` runs [`.github/workflows/ci.yml`](.github/workflows/ci.yml), which installs dependencies with Bun and runs lint, type-check, and build. Type-check and build are blocking; lint currently reports but doesn't fail the build, since the repo has pre-existing formatting debt (mostly Prettier quote/semicolon nits in older Lovable-generated files) — see the note in the workflow file. See [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution workflow and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the case-study presentation data model works.

### VS Code

Opening this repo in VS Code will prompt you to install the recommended extensions in `.vscode/extensions.json` (ESLint, Prettier, Tailwind CSS IntelliSense). `.vscode/settings.json` enables format-on-save and ESLint auto-fix on save to match CI.
