# Code Conventions

**Analysis Date:** 2026-05-07

## Language & Module System

- **JavaScript ES2022+ with JSX** — no TypeScript anywhere in the repo.
- **ESM modules** — both `backend/package.json` and `frontend/package.json` set `"type": "module"`. CommonJS `require` is not used.
- **Explicit file extensions on imports** — e.g. `import App from './App.jsx'` in `frontend/src/main.jsx`. Required for Vite/Node ESM resolution; future additions must follow.

## Formatting

No formatter is configured (no `.prettierrc`, no `eslint.config.js`). Existing files share a consistent style by convention:

| Aspect | Observed in `backend/src/index.js`, `frontend/src/App.jsx`, `frontend/src/main.jsx` |
|--------|--------------------------------------------------------------------------------------|
| Indentation | 2 spaces |
| Quotes | Single quotes for JS strings (`'dotenv/config'`), double quotes only inside JSX attributes when needed |
| Semicolons | Always present |
| Trailing commas | Present in multi-line object/array literals (`frontend/vite.config.js`) |
| Line endings | LF |

## Naming

**Code identifiers:**
- `camelCase` for variables, functions, and React hooks (`message`, `setMessage`).
- `PascalCase` for React components (`App`) and component files (`App.jsx`).
- `UPPER_SNAKE_CASE` for env-derived constants (`PORT` in `backend/src/index.js`).

**Files:**
- `PascalCase.jsx` for React components.
- `lowercase.js` / `lowercase.css` for everything else.

**Routes:**
- Lowercase, hyphenated, namespaced under `/api/*` (`/api/health`, `/api/hello`).

## React Patterns

Observed in `frontend/src/App.jsx` and `frontend/src/main.jsx`:

- **Function components only** — no class components.
- **Default export per component file** — `export default function App() { ... }`.
- **Hooks at top of component body** — `useState`, `useEffect`.
- **`<React.StrictMode>` enabled** — set in `main.jsx`. Effects double-fire in dev; future fetch/effect code must be idempotent.
- **JSX attribute style** — double quotes for string attributes (default React convention).

## Express / Backend Patterns

Observed in `backend/src/index.js`:

- **Top-level `await`-free bootstrap** — config loaded via `import 'dotenv/config'` side effect; `app.listen` called synchronously.
- **Inline route handlers** — `app.get('/api/health', (_req, res) => res.json({...}))`. Unused parameters prefixed with `_`.
- **Middleware order** — `cors()` → `express.json()` → routes → `listen`. No error-handling middleware yet.
- **Global CORS** — `app.use(cors())` with no options. Wide-open; flagged in `CONCERNS.md`.

## Error Handling

**Frontend:** Promise `.catch()` chain in `App.jsx`:
```js
fetch('/api/hello')
  .then((res) => res.json())
  .then((data) => setMessage(data.message))
  .catch(() => setMessage('Failed to reach backend'));
```
- No `try/catch` with `async/await`.
- No error boundary component.
- Catch handler ignores the actual error.

**Backend:** None. No `try/catch`, no error middleware, no `next(err)` paths. Any thrown error in a handler will hit Express's default error handler (HTML 500 response).

When introducing new code, choose **once** and commit: either continue with `.then/.catch` or move to `async/await + try/catch` consistently.

## Configuration

- **Environment variables** read with `process.env.X || <default>` pattern. Only `PORT` exists today.
- **Env template** `backend/.env.example` is checked in; `.env` is git-ignored.
- **No config object** — env vars are read directly at use sites. If the surface grows, centralizing into a `config.js` module is the natural next step.

## Logging

- `console.log` only — `backend/src/index.js` logs the listen banner.
- No structured logger (Pino, Winston). No log level discipline.
- The frontend never logs anything.

## Comments & Documentation

- **Existing files contain zero comments** — code is self-explanatory at this size.
- No JSDoc, no docstrings.
- README is minimal (`README.md`, ~20 lines).

Maintain the "no comments unless the why is non-obvious" stance as the codebase grows.

## API Response Shape

Both endpoints in `backend/src/index.js` return flat JSON objects:
- `GET /api/health` → `{ "status": "ok" }`
- `GET /api/hello` → `{ "message": "..." }`

There is **no** envelope (`{ data, error }`), no consistent error shape, no status field on success responses, and no versioning prefix (`/api/v1`). Establishing one before more endpoints exist will avoid retrofitting later.

## Imports Ordering

Observed pattern in `backend/src/index.js` and `frontend/src/main.jsx`:
1. Side-effect / framework imports first (`'dotenv/config'`, `'react'`).
2. Third-party packages next.
3. Relative imports (`./App.jsx`, `./styles.css`) last.

CSS imports come at the end of the import block (`import './styles.css'` in `main.jsx`).

---

*Conventions analysis: 2026-05-07*
