import { formatEventMeta } from '../utils/formatEventMeta';
import './EventCard.css';

/** @typedef {import('../types/event.js').Event} Event */

/**
 * @param {{ event: Event }} props
 */
export default function EventCard({ event }) {
  const meta = formatEventMeta(event.starts_at, event.ends_at, event.location);

  return (
    <article className="event-card">
      {event.sport ? (
        <span className="event-card-sport">{event.sport}</span>
      ) : null}
      <p className="event-card-meta">{meta}</p>
      <h3 className="event-card-title">{event.title}</h3>
      {event.description ? (
        <p className="event-card-description">{event.description}</p>
      ) : null}
      {event.max_attendees ? (
        <p className="event-card-attendees">Up to {event.max_attendees} attendees</p>
      ) : null}
    </article>
  );
}
