# Directory Structure

**Analysis Date:** 2026-05-07

## Top-Level Layout

```
Sports_Connect/
├── backend/              Express API (ESM, Node --watch)
│   ├── .env.example      Template for backend env vars (only `PORT`)
│   ├── package.json      Backend deps + dev/start scripts
│   └── src/
│       └── index.js      Single-file Express server (bootstrap + routes)
├── frontend/             React + Vite SPA
│   ├── index.html        HTML entry; loads /src/main.jsx as ESM
│   ├── package.json      Frontend deps + Vite scripts
│   ├── public/           Static assets (currently empty)
│   ├── src/
│   │   ├── App.jsx       Root React component
│   │   ├── main.jsx      React DOM bootstrap
│   │   └── styles.css    Single global stylesheet
│   └── vite.config.js    Vite config (port 5173, /api proxy → :3001)
├── .planning/            GSD workflow artifacts (not application code)
├── .gitignore            Ignores node_modules, dist, .env, .vite, coverage, logs
├── package.json          Monorepo root (npm-run-all to run both tiers)
└── README.md             Brief getting-started guide
```

## Key Locations

| Concern | Location |
|---------|----------|
| Backend bootstrap | `backend/src/index.js` |
| Backend routes | `backend/src/index.js` (inline; no separate `routes/`, `controllers/`, `services/`, `models/` yet) |
| Backend env template | `backend/.env.example` |
| Backend env (gitignored) | `backend/.env` (not present) |
| Frontend bootstrap | `frontend/src/main.jsx` |
| Frontend root component | `frontend/src/App.jsx` |
| Frontend HTML shell | `frontend/index.html` |
| Frontend global styles | `frontend/src/styles.css` |
| Frontend build config | `frontend/vite.config.js` |
| Frontend public assets | `frontend/public/` (empty) |
| Dev orchestration | Root `package.json` `dev` script |

## Naming Conventions

**Files:**
- React components: `PascalCase.jsx` — `App.jsx`.
- Other JS modules: `lowercase.js` — `main.jsx` is the one exception (Vite/React convention for the entry).
- Stylesheets: `lowercase.css` — `styles.css`.
- Config files: tool-specified — `vite.config.js`, `package.json`, `.env.example`.

**Directories:**
- All-lowercase, single word (`backend`, `frontend`, `src`, `public`).
- The repo itself is named `Sports_Connect` (snake_case with capital words) — atypical but established.

**Routes:**
- All API routes are namespaced under `/api/*` and proxied as a unit by Vite. Two endpoints exist: `/api/health`, `/api/hello`.

## Module System

- Both `backend/package.json` and `frontend/package.json` set `"type": "module"`.
- Imports include explicit `.jsx` extensions (`import App from './App.jsx'`) — required by Vite's ESM resolution.
- No path aliases (`@/...`) configured in `frontend/vite.config.js`.

## Where Things Should Probably Go (When Added)

Based on the current pattern, future code would likely land at:

- **New backend route** → split out of `backend/src/index.js` into `backend/src/routes/<name>.js` (no convention established yet — first addition will set it).
- **New React component** → `frontend/src/components/<Name>.jsx` (no `components/` directory yet).
- **New frontend route/page** → no router installed yet; would require a routing decision first.
- **Shared types/contracts** → no shared package; each tier would need its own definition until one is introduced.
- **Static assets** → `frontend/public/` (currently empty).
- **Backend env vars** → add to `backend/.env.example` *and* read in `backend/src/index.js`.

## What's Conspicuously Absent

| Missing | Significance |
|---------|--------------|
| `tsconfig.json` | No TypeScript anywhere. |
| `eslint.config.js` / `.eslintrc` | No linter configured. |
| `prettier` config | No formatter. |
| `tests/` or `__tests__/` | No test infrastructure (see `TESTING.md`). |
| `Dockerfile`, `.github/workflows/` | No containerization or CI. |
| `frontend/src/components/`, `hooks/`, `lib/` | No frontend organization beyond root. |
| `backend/src/routes/`, `controllers/`, `services/`, `models/` | No backend layering. |
| Shared package (`packages/`, `shared/`) | No code sharing between tiers. |

These absences are consistent with a green skeleton; they are flagged here so the next phase establishes conventions deliberately rather than ad-hoc.

---

*Structure analysis: 2026-05-07*
