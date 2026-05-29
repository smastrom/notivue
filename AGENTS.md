# Agents

## Project

Notivue is a public OSS Vue 3 toast notification library. Treat `packages/notivue` as the product, with Nuxt and Astro integrations, playgrounds for manual checks, docs for the public contract, and `tests` as the regression suite.

- Keep changes small and library-grade. Prefer existing APIs, file layout, and naming over new patterns.
- Protect public exports, types, CSS entrypoints, accessibility behavior, SSR compatibility, and backwards compatibility unless the user explicitly asks for a breaking change.
- For behavior changes, update or add focused tests near the affected area. Cypress component tests are the main suite; Vitest is used for config logic.
- Never run development servers unless the user explicitly requests them.
- Use `pnpm` and the repo scripts: `pnpm build`, `pnpm test`, `pnpm test:unit`, `pnpm format:check`, `pnpm dev`, `pnpm dev:astro`.

## Workflow

- **GitHub (PR review):** CodeRabbit comments on pull requests. Triage each thread: fix when valid, dismiss with a short reason when not. Resolve threads after replying.
- **Local (implementation):** Cursor Agent makes changes, commits, and pushes on request. When answering CodeRabbit on GitHub, post replies on the review thread and note they were written by the agent (see below).
- Do not create commits or push to remotes unless the user explicitly requests it in the current conversation.

## Writing

- Do not use em-dashes. Use a hyphen, a comma, a colon, or separate sentences instead.

## Git

Match the style on `main`. Do **not** use Conventional Commits (`feat:`, `fix:`, `chore:`, etc.).

**Titles**

- Scoped: `{Area} - {Description}`. Capitalize the part after `-`.
  - Areas: `Core`, `Notivue`, `Notification`, `Notifications`, `Pkg`, `Demo`, `Playground`, `Astro`, `Tests`, `Docs`, `CodeRabbit`, …
  - Examples: `Core - Rename useRepositioning to useSizes`, `NotivueKeyboard - Fix focusable element tabindex selector`
- Multi-scope: `Core, Astro - Cleanup`
- Releases: `2.4.5 (#63)` (include PR number for version bumps)
- Small / misc: short imperative is fine (e.g. `Remove Claude Code GitHub workflow`)

**Body (optional)**

- Bullet lines: `* {Area} - …`

**Agent commits**

- Append co-author trailer:

  ```text
  Co-authored-by: Cursor <cursoragent@cursor.com>
  ```

**GitHub review replies**

- When replying to CodeRabbit (or any PR comment) on the user's behalf, end with:

  ```text
  Added by Cursor Agent
  ```
