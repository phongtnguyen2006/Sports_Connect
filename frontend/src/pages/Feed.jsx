import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../api/events';
import './Feed.css';

/** @typedef {import('../types/event.js').Event} Event */

export default function Feed() {
  const [events, setEvents] = useState(/** @type {Event[]} */ ([]));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setLoading(true);
      try {
        const data = await fetchEvents();
        if (!cancelled) {
          setEvents(data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, []);
  return (
    <main className="feed-page">
      <header className="feed-header">
        <div>
          <h1>Event Feed</h1>
          <p className="feed-subtitle">
            Discover pickup games and sports meetups near you
          </p>
        </div>
        <Link className="feed-create-link" to="/create-event">
          Create Event
        </Link>
      </header>

      {loading ? (
        <p className="feed-status" role="status">
          Loading events…
        </p>
      ) : null}
    </main>
  );
}
