import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../../api/events';
import EventCard from '../../components/EventCard';
import './Feed.css';

/** @typedef {import('../../types/event.js').Event} Event */

export default function Feed() {
  const [events, setEvents] = useState(/** @type {Event[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  useEffect(() => {
    let cancelled = false;

    async function loadEvents() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchEvents();
        if (!cancelled) {
          setEvents(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
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

  function handleRsvpChange(eventId, isRsvpd) {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId ? { ...event, is_rsvpd: isRsvpd } : event
      )
    );
  }

  return (
    <main className="feed-page">
      <header className="feed-header">
        <div>
          <h1>Event Feed</h1>
          <p className="feed-subtitle">
            Discover pickup games and sports meetups near you
            {!loading && !error && events.length > 0
              ? ` · ${events.length} event${events.length === 1 ? '' : 's'}`
              : ''}
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

      {!loading && error ? (
        <p className="feed-status feed-status-error" role="alert">
          {error}. Make sure the backend is running on port 3001.
        </p>
      ) : null}

      {!loading && !error && events.length === 0 ? (
        <p className="feed-status">
          No events yet.{' '}
          <Link to="/create-event">Create the first one</Link>
        </p>
      ) : null}

      {!loading && !error && events.length > 0 ? (
        <section className="events-grid" aria-label="Upcoming events">
          {events.map((event) => (
            <EventCard key={event.id} event={event} onRsvpChange={handleRsvpChange} />
          ))}
        </section>
      ) : null}
    </main>
  );
}
