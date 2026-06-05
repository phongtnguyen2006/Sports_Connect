import { FeedEventPanel } from "./FeedEventPanel.jsx";

export function FeedAttendeesWindow({ selectedAttendeesEvent, handleCloseAttendeesClick }) {
  const rsvpCount = selectedAttendeesEvent?.rsvp_count ?? 0;
  const maxAttendees = selectedAttendeesEvent?.max_attendees;
  const spotsLeft = typeof maxAttendees === 'number'
    ? Math.max(0, maxAttendees - rsvpCount)
    : null;

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
      
    </FeedEventPanel>
  );
}
