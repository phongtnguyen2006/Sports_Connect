import { useEffect, useState } from "react";
import { fetchEventRsvpUsers } from "../api/events.js";
import { FeedEventPanel } from "./FeedEventPanel.jsx";

export function FeedAttendeesWindow({ selectedAttendeesEvent, handleCloseAttendeesClick }) {
  const [attendees, setAttendees] = useState(null);
  const [error, setError] = useState('');
  const rsvpCount = selectedAttendeesEvent?.rsvp_count ?? 0;
  const maxAttendees = selectedAttendeesEvent?.max_attendees;
  const spotsLeft = typeof maxAttendees === 'number'
    ? Math.max(0, maxAttendees - rsvpCount)
    : null;

  useEffect(() => {
    if (!selectedAttendeesEvent) {
      setAttendees(null);
      return;
    }

    let cancelled = false;

    async function loadAttendees() {
      setAttendees(null);
      setError('');

      try {
        const users = await fetchEventRsvpUsers(selectedAttendeesEvent.id);
        if (!cancelled) {
          setAttendees(Array.isArray(users) ? users : []);
        }
      } catch (err) {
        if (!cancelled) {
          setAttendees([]);
          setError(err instanceof Error ? err.message : 'Failed to load attendees');
        }
      }
    }

    loadAttendees();

    return () => {
      cancelled = true;
    };
  }, [selectedAttendeesEvent]);

  return (
    <FeedEventPanel
      ariaLabel="Event attendees"
      eyebrow="Attendees"
      title={selectedAttendeesEvent?.title}
      onClose={handleCloseAttendeesClick}
      closeLabel="Close attendees"
    >
      <div className="feed-attendees-summary">
        <div>
          <strong>{rsvpCount}</strong>
          <span>Going</span>
        </div>
        <div>
          <strong>{maxAttendees ?? 'No limit'}</strong>
          <span>Capacity</span>
        </div>
        <div>
          <strong>{spotsLeft ?? 'Open'}</strong>
          <span>Spots left</span>
        </div>
      </div>

      {attendees === null ? (
        <p className="feed-comments-empty">Loading attendees...</p>
      ) : error ? (
        <p className="feed-comments-empty">{error}</p>
      ) : attendees.length === 0 ? (
        <p className="feed-comments-empty">No attendees yet</p>
      ) : (
        attendees.map((attendee) => (
          <FeedAttendee key={attendee.id} attendee={attendee} />
        ))
      )}
    </FeedEventPanel>
  );
}

function FeedAttendee({ attendee }) {
  const displayName = getAttendeeDisplayName(attendee);
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="feed-attendee">
      {attendee.profile_image ? (
        <img
          className="feed-attendee-avatar"
          src={attendee.profile_image}
          alt=""
          aria-hidden="true"
          style={{ objectFit: 'cover' }}
        />
      ) : (
        <div className="feed-attendee-avatar" aria-hidden="true">
          {initials}
        </div>
      )}
      <div>
        <strong>{displayName}</strong>
        {attendee.username ? <span>@{attendee.username}</span> : null}
      </div>
    </article>
  );
}

function getAttendeeDisplayName(attendee) {
  const fullName = [attendee.firstName, attendee.lastName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return fullName || attendee.username || 'Member';
}
