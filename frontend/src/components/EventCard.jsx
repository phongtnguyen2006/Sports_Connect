import { formatEventMeta } from '../utils/formatEventMeta';
import './EventCard.css';

/** @typedef {import('../types/event.js').Event} Event */

/**
 * @param {{ event: Event }} props
 */
export default function EventCard({ event }) {
  const meta = formatEventMeta(event.date, event.time, event.location);

  return (
    <article className="event-card">
      {event.sport ? (
        <span className="event-card-sport">{event.sport}</span>
      ) : null}
      <p className="event-card-meta">{meta}</p>
      <h3 className="event-card-title">{event.title}</h3>
      <p className="event-card-description">{event.description}</p>
      <p className="event-card-host">
        Hosted by <span>@{event.hostUsername}</span>
      </p>
    </article>
  );
}
