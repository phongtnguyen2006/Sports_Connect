# Architecture

**Analysis Date:** 2026-05-07

## Overall Pattern

**Style:** Two-tier client/server monorepo skeleton.

- **Tier 1 (Client):** React SPA bundled by Vite, served on port `5173` in development.
- **Tier 2 (Server):** Express REST API on port `3001` exposing `/api/*` endpoints.
- **Topology:** Independent npm projects (`backend/`, `frontend/`) coordinated by a thin root `package.json` that runs both via `npm-run-all`.

There is no shared code, no build pipeline coupling, and no service registry. The two tiers communicate exclusively over HTTP/JSON.

## Layers

The codebase is too small to have formal layers. The de-facto layering is:

**Backend (`backend/src/index.js`):**
- Single-file Express app — bootstrap, middleware, and routes live in the same module.
- No separation yet between `app` setup, routing, controllers, services, or data access. Each route handler is defined inline (`app.get('/api/health', ...)`).

**Frontend (`frontend/src/`):**
- `main.jsx` — React DOM bootstrap, mounts `<App>` inside `<React.StrictMode>` on `#root`.
- `App.jsx` — Single component that owns its own `fetch` call to `/api/hello` and local `useState`. No router, no layout, no component library, no state container.
- `styles.css` — Single global stylesheet imported from `main.jsx`.

## Data Flow

**Steady-state request flow (current example: `/api/hello`):**

1. Browser loads `frontend/index.html` (served by Vite dev server on `:5173`).
2. `<App>` mounts, `useEffect` fires once (StrictMode runs effects twice in dev).
3. `fetch('/api/hello')` issues a same-origin request to the Vite dev server.
4. Vite's `server.proxy` config in `frontend/vite.config.js` rewrites the request to `http://localhost:3001/api/hello`.
5. Express CORS middleware allows the request, route handler returns `{ message: '...' }`.
6. React state updates; the message renders in `<p>{message}</p>`.

**Failure path:** `App.jsx` `.catch()` swaps the message to `'Failed to reach backend'`. There is no retry, no error boundary, no logging.

## Abstractions

There are essentially none. The codebase is a starter skeleton:

- **No service or repository layer** — route handlers in `backend/src/index.js` return inline literal payloads.
- **No HTTP client wrapper** — `App.jsx` calls the global `fetch` directly.
- **No configuration object** — the only config knob is `process.env.PORT` read at module load.
- **No domain model / types** — there are no entities, schemas, or shared type definitions (no TypeScript, no Zod, no JSON Schema).

The lack of abstractions is appropriate for the current scope but means new features will likely introduce them from scratch.

## Entry Points

| Tier | Entry File | What it does |
|------|------------|--------------|
| Backend runtime | `backend/src/index.js` | Loads `dotenv`, creates Express app, registers `cors` + `express.json`, mounts `/api/health` and `/api/hello`, listens on `PORT` |
| Backend dev | `backend/package.json` script `dev` | `node --watch src/index.js` — restarts on file change |
| Frontend HTML | `frontend/index.html` | Loads `/src/main.jsx` as an ES module |
| Frontend runtime | `frontend/src/main.jsx` | `ReactDOM.createRoot(...).render(<App/>)` |
| Frontend dev | `frontend/package.json` script `dev` | `vite` — starts dev server on `:5173` with `/api` proxy |
| Monorepo dev | Root `package.json` script `dev` | `npm-run-all --parallel dev:backend dev:frontend` |

## Cross-Cutting Concerns

**Currently implemented:**
- CORS — `app.use(cors())` in `backend/src/index.js` (wide-open, all origins).
- JSON body parsing — `app.use(express.json())`.
- Hot reload — backend via `node --watch`, frontend via Vite HMR.

**Not yet implemented:** authentication, authorization, request logging, error handling middleware, validation, rate limiting, observability, request IDs, configuration management beyond `PORT`.

## Boundary with the Outside World

The only boundary the system currently exposes is the Express HTTP server on `:3001`. There are no databases, message queues, third-party APIs, file uploads, websockets, or webhooks (see `INTEGRATIONS.md`).

## Notable Architectural Decisions

- **ESM throughout** — both `backend/package.json` and `frontend/package.json` declare `"type": "module"`. Imports use `.jsx` extensions explicitly (`from './App.jsx'`).
- **Vite proxy over hardcoded URL** — frontend uses relative `/api/...` paths and relies on `frontend/vite.config.js` proxy in dev. This means production deployment will need its own proxying or CORS strategy.
- **React StrictMode is on** — in `frontend/src/main.jsx`. Effects intentionally double-fire in development; any data fetching introduced later must tolerate this.

---

*Architecture analysis: 2026-05-07*
