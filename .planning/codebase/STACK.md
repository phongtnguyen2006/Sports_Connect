# Technology Stack

**Analysis Date:** 2026-05-07

## Languages

**Primary:**
- JavaScript (ES6+) - Both frontend and backend
- JSX - React component syntax in frontend

## Runtime

**Environment:**
- Node.js v22.13.1 (verified at analysis time)

**Package Manager:**
- npm 11.6.2
- Lockfile: Not yet generated (fresh project setup)

## Frameworks

**Core:**
- React 18.3.1 - Frontend UI framework
- Express 4.19.2 - Backend HTTP server framework

**Build/Dev:**
- Vite 5.4.2 - Frontend bundler and dev server
- @vitejs/plugin-react 4.3.1 - Vite React integration plugin

**Utility:**
- CORS 2.8.5 - Cross-Origin Resource Sharing middleware for Express
- dotenv 16.4.5 - Environment variable management for backend

**Development Tools:**
- npm-run-all 4.1.5 - Parallel script execution for monorepo dev commands

## Key Dependencies

**Critical:**
- react, react-dom 18.3.1 - Core React library and DOM bindings
- express 4.19.2 - Foundation of backend API server
- vite 5.4.2 - Frontend build tool and dev server

**Infrastructure:**
- cors 2.8.5 - Enables cross-origin requests between frontend (port 5173) and backend (port 3001)
- dotenv 16.4.5 - Configuration management without hardcoding secrets

## Configuration

**Environment:**
- Backend configuration: `backend/.env.example` defines PORT (defaults to 3001)
- Frontend proxy configuration: `frontend/vite.config.js` proxies /api requests to http://localhost:3001
- Environment variables managed via dotenv in backend

**Build:**
- Frontend build config: `frontend/vite.config.js`
  - React plugin enabled
  - Dev server on port 5173
  - API proxy to backend at localhost:3001

- Backend configuration: `backend/src/index.js`
  - CORS enabled globally
  - JSON body parsing enabled
  - PORT configurable via environment variable

## Development Setup

**Scripts:**
- `npm run install:all` - Install dependencies for both backend and frontend
- `npm run dev:backend` - Start backend dev server with Node --watch
- `npm run dev:frontend` - Start frontend dev server with Vite
- `npm run dev` - Run both backend and frontend concurrently

**Entry Points:**
- Frontend: `frontend/src/main.jsx` - React DOM initialization
- Backend: `backend/src/index.js` - Express server startup

## Platform Requirements

**Development:**
- Node.js v22.x or later
- npm 11.x or later

**Production:**
- Node.js runtime for backend
- Static file hosting for frontend build output

---

*Stack analysis: 2026-05-07*
