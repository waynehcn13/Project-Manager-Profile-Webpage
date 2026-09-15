# Contributing

This is a personal portfolio site, edited both by hand (this repo) and through the [Lovable](https://lovable.dev) editor, which pushes/pulls against the same `main` branch. Keep that in mind: changes made here sync into Lovable automatically, and prompts run in Lovable sync back here the same way.

## Workflow

1. **Branch from `main`** for any non-trivial change: `git checkout -b <short-description>`.
2. **Keep commits focused.** One logical change per commit; prefer a few small commits over one large one.
3. **Write commit messages that explain why, not just what** — e.g. `Fix 404s on presentation PDF download buttons` rather than `update PresentationDeck.tsx`.
4. **Open a pull request against `main`.** CI (`.github/workflows/ci.yml`) runs lint, type-check, and build on every push and PR — fix any failures before merging.
5. **Merge to `main` deploys automatically to Vercel.** If the change should also go live on Lovable's `waynenguyenportfolio.lovable.app`, publish it manually from the Lovable editor after the merge (see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#deployment-model)).

For small, low-risk fixes (typos, copy tweaks), committing directly to `main` is fine — this isn't a team repo with review gates, just keep CI green.

## Before opening a PR

```sh
bun install
bun run lint
bunx tsc --noEmit
bun run build
```

All four should pass locally — this mirrors exactly what CI runs.

## Code style

- Formatting is enforced by Prettier (`bun run format`) and linting by ESLint (`bun run lint`); don't hand-format against the grain of the existing config.
- Follow the existing patterns in a file before introducing a new one — e.g. new case studies in `PresentationDeck.tsx` should be plain `CaseStudyData` objects, not new components (see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)).
- Don't commit `.env` values that are genuinely secret. The Supabase keys currently in `.env` are public/publishable keys and are fine to have in the repo — a `sb_secret_...` key would not be.
