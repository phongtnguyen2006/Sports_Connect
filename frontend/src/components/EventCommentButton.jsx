/** @typedef {import('../types/event.js').Event} Event */

/**
 * @param {{
 *   event: Event,
 *   onCommentClick: (event: Event) => void,
 *   isCommentSelected?: boolean,
 * }} props
 */
export default function EventCommentButton({
  event,
  onCommentClick,
  isCommentSelected = false,
}) {
  return (
    <footer className="event-card-footer">
      <button
        type="button"
        className={`event-card-comment-button${isCommentSelected ? ' is-selected' : ''}`}
        onClick={() => onCommentClick(event)}
        aria-label={`Open comments for ${event.title}`}
        aria-pressed={isCommentSelected}
      >
        <EventCommentIcon />
        Comment
      </button>
    </footer>
  ); 
}

function EventCommentIcon() {
  return (
    <svg
      aria-hidden="true"
      className="event-card-comment-icon"
      viewBox="0 0 24 24"
    >
      <path d="M5 6.5C5 5.1 6.1 4 7.5 4h9C17.9 4 19 5.1 19 6.5v6C19 13.9 
      17.9 15 16.5 15H11l-4.5 4v-4C5.7 15 5 14.3 5 13.5v-7Z" />
    </svg>
  ); 
}
