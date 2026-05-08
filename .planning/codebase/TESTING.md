# Testing

**Analysis Date:** 2026-05-07

## Current State: No Test Infrastructure

The codebase has **zero tests** and **no testing framework installed**. This is documented here so the next phase can choose a stack deliberately rather than discover the gap mid-feature.

## What Was Checked

| Surface | Result |
|---------|--------|
| Test files (`*.test.js`, `*.spec.js`, `*.test.jsx`) | None |
| Test directories (`tests/`, `__tests__/`, `e2e/`) | None |
| Backend test deps in `backend/package.json` | None — only `cors`, `dotenv`, `express` |
| Frontend test deps in `frontend/package.json` | None — only `react`, `react-dom`, `vite`, `@vitejs/plugin-react` |
| Test scripts in any `package.json` | None — root has only `install:all`, `dev:*`; subprojects have `dev`/`build`/`start` |
| Test runner config (`vitest.config.*`, `jest.config.*`) | None |
| CI workflow (`.github/workflows/`) | None |
| Coverage tooling | `coverage/` is in `.gitignore` (placeholder only — no coverage tool produces it yet) |

## Framework

Not chosen. The natural defaults given the existing stack:

- **Frontend (React + Vite):** **Vitest** + **@testing-library/react** + **jsdom** — Vitest reuses the Vite config in `frontend/vite.config.js`, so setup is minimal.
- **Backend (Express ESM):** **Vitest** or **Node's built-in `node:test`** + **supertest** for HTTP-level tests. Vitest works cleanly with `"type": "module"`; `node:test` requires zero new deps.
- **E2E (when needed):** **Playwright** is the most common choice against a Vite dev server.

These are recommendations, not decisions — record the actual choice here once made.

## Test Structure (Once Established)

There is no convention to follow yet. Suggested layout consistent with the rest of the repo:

```
backend/src/
  index.js
  index.test.js          # colocated with module under test
frontend/src/
  App.jsx
  App.test.jsx           # colocated with component
```

Colocation matches the current "everything in `src/`" structure better than a separate `tests/` tree.

## Mocking

No mocking strategy exists. Things to decide when tests are introduced:

- **Frontend `fetch` mocking** — `App.jsx` calls `fetch('/api/hello')` directly. With Vitest, the cleanest path is `vi.spyOn(globalThis, 'fetch')` or `msw` for HTTP-level interception.
- **Backend dependency mocking** — none of the route handlers in `backend/src/index.js` have external dependencies yet, so this is moot until a database or external API is added.

## Coverage

No coverage tool is wired up. `.gitignore` already excludes `coverage/`, so introducing one (e.g. Vitest's built-in `--coverage` via `@vitest/coverage-v8`) requires no `.gitignore` changes.

No coverage target is set. The first tests should establish a baseline rather than chase a number.

## CI

No CI is configured. Once tests exist, the natural next steps are:

1. Add `test` scripts to `backend/package.json` and `frontend/package.json`.
2. Add a root `test` script that runs both (matching the `dev` pattern with `npm-run-all`).
3. Add a GitHub Actions workflow at `.github/workflows/ci.yml` that runs `npm run install:all && npm test` on PRs.

## Manual / Smoke Testing

The only verification mechanism today is manual:

```bash
npm run install:all
npm run dev
# visit http://localhost:5173 — should display the message from /api/hello
# visit http://localhost:3001/api/health — should return {"status":"ok"}
```

This is the implicit acceptance test for any change until automated tests exist.

## Recommended First Tests

When testing is introduced, the smallest set that still proves wiring works end-to-end:

1. `backend/src/index.test.js` — `supertest` against the Express app: assert `GET /api/health` returns `200 { status: 'ok' }` and `GET /api/hello` returns `200 { message: <string> }`.
2. `frontend/src/App.test.jsx` — render `<App/>` with a mocked `fetch`, assert the message renders after the promise resolves and `'Failed to reach backend'` renders on rejection.

These two tests alone exercise every line of production code currently in the repo.

---

*Testing analysis: 2026-05-07*
