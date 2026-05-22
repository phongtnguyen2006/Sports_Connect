# Sports Connect

Project skeleton: React (Vite, JSX) frontend + Node.js (Express) backend.

## Structure

```
backend/    Express API (ESM, Node --watch)
frontend/   React + Vite app
```

## Getting started

```bash
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Backend:  http://localhost:3001

`/api/*` requests from the frontend dev server are proxied to the backend.

## Event feed

- **Feed** (`/feed`) — lists events from `GET /api/events` with title, description, date/time, location, sport, and host.
- **Create Event** (`/create-event`) — posts new events via `POST /api/events`, then returns to the feed.

Events are stored in memory on the backend (resets when the server restarts). Seed data matches the sample posts on the profile page.
