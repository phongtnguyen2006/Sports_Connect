import { useState } from 'react';
import { createEventRsvp, deleteEventRsvp } from '../api/events';
import { formatEventMeta } from '../utils/formatEventMeta';
import EventFooter from './EventFooter.jsx';
import './EventCard.css';

/** @typedef {import('../types/event.js').Event} Event */

/**
 * @param {{
 *   event: Event,
 *   onRsvpChange: (eventId: number, isRsvpd: boolean) => void,
 *   onCommentClick: (event: Event) => void,
 *   isCommentSelected?: boolean,
 * }} props
 */
export default function EventCard({
  event,
  onRsvpChange,
  onCommentClick,
  isCommentSelected = false,
}) {
  const [isRsvpUpdating, setIsRsvpUpdating] = useState(false);
  const meta = formatEventMeta(event.starts_at, event.ends_at, event.location);
  const showFullStatus = event.is_full && !event.is_rsvpd;

  async function handleRsvpClick() {
    setIsRsvpUpdating(true);

    try {
      if (event.is_rsvpd) {
        await deleteEventRsvp(event.id);
        onRsvpChange(event.id, false);
      } else {
        await createEventRsvp(event.id);
        onRsvpChange(event.id, true);
      }
    } finally {
      setIsRsvpUpdating(false);
    }
  }

  return (
    <article className="event-card">
      <div className="event-card-header">
        {event.sport ? (
          <span className="event-card-sport">{event.sport}</span>
        ) : null}
        {event.host_username ? (
          <span className="event-card-host-username">@{event.host_username}</span>
        ) : null}
        {showFullStatus ? (
          <span className="event-card-full-status">Full</span>
        ) : (
          <button
            type="button"
            className={`event-card-rsvp-button${event.is_rsvpd ? ' is-rsvpd' : ''}`}
            onClick={handleRsvpClick}
            disabled={isRsvpUpdating}
            aria-label={event.is_rsvpd ? 'Remove RSVP' : 'RSVP to event'}
          >
            {event.is_rsvpd ? (
              <svg
                aria-hidden="true"
                className="event-card-rsvp-check"
                viewBox="0 0 24 24"
              >
                <path d="M5 12.5L10 17.5L19 6.5" />
              </svg>
            ) : (
              <span aria-hidden="true">+</span>
            )}
          </button>
        )}
      </div>
      <p className="event-card-meta">{meta}</p>
      <h3 className="event-card-title">{event.title}</h3>
      {event.description ? (
        <p className="event-card-description">{event.description}</p>
      ) : null}
      {event.max_attendees ? (
        <p className="event-card-attendees">Up to {event.max_attendees} attendees</p>
      ) : null}
      
      <EventFooter
        event={event}
        onCommentClick={onCommentClick}
        isCommentSelected={isCommentSelected}
      />
    </article>
  );
}
