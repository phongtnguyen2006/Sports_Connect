# External Integrations

**Analysis Date:** 2026-05-07

## APIs & External Services

**Internal Communication:**
- Backend REST API at `http://localhost:3001`
  - Proxy setup in `frontend/vite.config.js` routes `/api/*` requests to backend
  - Used by frontend for data fetching via native Fetch API

**Current Endpoints:**
- `GET /api/health` - Health check endpoint in `backend/src/index.js`
- `GET /api/hello` - Returns greeting message in `backend/src/index.js`

## Data Storage

**Databases:**
- Not detected - No database client packages present

**File Storage:**
- Not applicable - No file storage integrations configured

**Caching:**
- Not detected - No caching layer (Redis, etc.) configured

## Authentication & Identity

**Auth Provider:**
- Not detected - No authentication framework configured
- Current implementation: No auth middleware present

## Monitoring & Observability

**Error Tracking:**
- Not detected - No error tracking service configured

**Logs:**
- Console logging only - `backend/src/index.js` uses console.log for startup notification
- No structured logging framework

## CI/CD & Deployment

**Hosting:**
- Not configured - Deployment target not specified in codebase

**CI Pipeline:**
- Not detected - No CI/CD configuration files present

## Environment Configuration

**Required env vars:**
- `PORT` - Backend server port (defaults to 3001 if not set) - defined in `backend/.env.example`

**Secrets location:**
- Backend env file: `backend/.env` (git-ignored, example provided at `backend/.env.example`)
- No secrets currently in use beyond PORT configuration

## Network Communication

**Frontend to Backend:**
- Protocol: HTTP/Fetch API
- Proxy: Configured in `frontend/vite.config.js` at development time
- CORS: Enabled globally in `backend/src/index.js` via `app.use(cors())`
- Content-Type: JSON

**Backend Server:**
- Listens on configurable PORT (default 3001)
- JSON request/response body parsing enabled
- No authentication required for current endpoints

## Webhooks & Callbacks

**Incoming:**
- Not detected - No webhook endpoints configured

**Outgoing:**
- Not detected - No external API calls from backend

---

*Integration audit: 2026-05-07*
