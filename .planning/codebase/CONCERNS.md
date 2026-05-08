# Concerns

**Analysis Date:** 2026-05-07

This is a green skeleton — most "concerns" are really gaps to address before the codebase grows. Items are grouped by severity.

## Critical (Block Before Production)

### Wide-open CORS
**Where:** `backend/src/index.js:8` — `app.use(cors())`
**Issue:** No origin allowlist. Every origin is permitted, including credentialed requests once auth is added.
**Action:** Configure `cors({ origin: process.env.ALLOWED_ORIGIN, credentials: true })` before any auth or session work lands.

### No authentication or authorization
**Where:** Entire backend.
**Issue:** Both `/api/health` and `/api/hello` are anonymous. Acceptable now, but no auth boundary exists at all — there is no middleware seam to plug into.
**Action:** Decide on auth approach (session cookie, JWT, third-party like Clerk/Auth0) before adding the first user-scoped route.

### No input validation
**Where:** `backend/src/index.js` — `app.use(express.json())` accepts arbitrary JSON; no route currently reads a body, but the next one will.
**Issue:** No schema validation library (`zod`, `joi`, `valibot`) is installed. The default body size limit (100kb) and lack of validation will be the first thing exploited if endpoints are exposed.
**Action:** Pick a validator before the first POST endpoint.

### No error-handling middleware
**Where:** `backend/src/index.js` — only `cors`, `express.json`, two routes, then `listen`.
**Issue:** Any throw inside a route handler hits Express's default handler, returning an HTML 500 with a stack trace in dev. Async throws inside `.then` chains won't even reach Express.
**Action:** Add a final `app.use((err, req, res, next) => ...)` that returns JSON and an async wrapper helper before async route handlers exist.

## High

### No tests, no CI
**Where:** Repo-wide. See `TESTING.md` for the full picture.
**Issue:** No way to catch regressions automatically. Manual smoke testing (`npm run dev` + browser) is the only safety net.
**Action:** Establish a test framework choice and CI workflow before the codebase doubles.

### No TypeScript
**Where:** All `.js` / `.jsx` files.
**Issue:** No compile-time contract between `App.jsx`'s `data.message` and the backend's response shape. Renaming a field will only fail at runtime in the browser.
**Action:** Decide TS-or-not deliberately. If staying on JS, document the call (and consider JSDoc + `checkJs`).

### No request logging or observability
**Where:** `backend/src/index.js` — only `console.log` for the listen banner.
**Issue:** When a request fails, there is no record of it. No request IDs, no latency, no structured logging.
**Action:** Add a logger (`pino` is the lightest fit for Express) and a minimal request log middleware before the first non-trivial endpoint.

### No shared API contract
**Where:** `backend/src/index.js` and `frontend/src/App.jsx`.
**Issue:** The two tiers agree on `{ message: string }` by convention. There is no schema, no generated client, no shared package. Drift is inevitable as endpoints multiply.
**Action:** Pick a contract source (OpenAPI, tRPC, hand-shared TS types in a shared package, Zod schemas exported from backend) before adding the third endpoint.

## Medium

### Hardcoded ports / proxy URL
**Where:** `frontend/vite.config.js:9` (`'/api': 'http://localhost:3001'`), `backend/src/index.js:6` (`PORT || 3001`).
**Issue:** The frontend dev proxy hardcodes the backend URL. If `PORT` is overridden in `backend/.env`, the proxy breaks silently.
**Action:** Read the proxy target from an env var (e.g. `VITE_BACKEND_URL`) or document the coupling in `backend/.env.example`.

### Production deployment story is missing
**Where:** No `Dockerfile`, no `vite build` consumer, no proxy config beyond dev.
**Issue:** `frontend/vite.config.js`'s `/api` proxy only exists in `vite dev`. A `vite build` artifact has no proxy — production needs either same-origin hosting (reverse proxy) or CORS + absolute backend URL.
**Action:** Decide deployment topology before the first non-localhost demo.

### Silent fetch failure in `App.jsx`
**Where:** `frontend/src/App.jsx:10` — `.catch(() => setMessage('Failed to reach backend'))`
**Issue:** The catch handler discards the error. Users see a generic message; developers see nothing.
**Action:** At minimum `console.error` the caught value. Better: introduce an error boundary or a typed error state.

### StrictMode double-fetch in dev
**Where:** `frontend/src/main.jsx` wraps `<App/>` in `<React.StrictMode>`; `App.jsx` fetches in `useEffect`.
**Issue:** In development, `useEffect` runs twice, so `/api/hello` is called twice on mount. Harmless for a GET but a footgun once mutating effects appear.
**Action:** Use an idempotency guard (`AbortController`, ref flag, or move data fetching to TanStack Query / SWR) before adding any effect with side effects.

### No `package-lock.json` checked in
**Where:** Root, `backend/`, `frontend/` — none have a lockfile.
**Issue:** Reproducible installs are not guaranteed. CI and prod builds may resolve different transitive versions.
**Action:** Run `npm install` once in each directory and commit the resulting lockfiles. Decide whether the monorepo should hoist via npm workspaces (currently it does not).

### Empty `frontend/public/`
**Where:** `frontend/public/`
**Issue:** No `favicon.ico` — browsers will 404 on it. No `robots.txt`. Cosmetic, but visible in dev tools.
**Action:** Drop in a favicon when branding is decided.

## Low / Cosmetic

- **No linter/formatter** (no ESLint, no Prettier). Style consistency relies on author discipline.
- **`README.md` is minimal** — no contribution guide, no architecture pointer, no env-setup details beyond `npm run dev`.
- **No `.nvmrc` / `engines` field** — Node version is documented as "v22.13.1 verified at analysis time" in `STACK.md` but not enforced.
- **No path aliases** in `frontend/vite.config.js` — relative imports will get noisy as the tree deepens.

## Fragile Areas

- **Single point of failure for the frontend → backend link:** the Vite proxy in `frontend/vite.config.js`. If anyone changes the backend port without updating both files, the app silently breaks in dev.
- **Single-file Express app:** `backend/src/index.js` is the entire backend. The first feature added will need to decide on a layering convention; the wrong choice ossifies fast.

## Things That Are Fine

- ESM throughout (no CJS/ESM interop pain to come).
- React 18 + Vite 5 — current, well-supported.
- `.gitignore` already covers the right things (`node_modules/`, `dist/`, `.env`, `.vite/`, `coverage/`).
- `.env.example` exists for the backend.
- `node --watch` in `backend/package.json` avoids needing `nodemon`.

## Priority Order for Next Phase

If only a handful of items can be addressed before the next feature:

1. **Pick TS-or-not** — affects everything else.
2. **Test framework + first two tests** (see `TESTING.md`).
3. **Error-handling middleware + structured logger** in backend.
4. **API contract approach** (OpenAPI / shared types / tRPC).
5. **CORS allowlist** before any cross-origin or auth work.

---

*Concerns analysis: 2026-05-07*
