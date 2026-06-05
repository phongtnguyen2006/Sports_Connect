export function FeedEventPanel({
  ariaLabel,
  eyebrow,
  title,
  onClose,
  closeLabel,
  children,
  footer,
}) {
  return (
    <aside className="feed-comments-panel" aria-label={ariaLabel}>
      <div className="feed-comments-header">
        <div>
          <p className="feed-comments-eyebrow">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <FeedEventPanelCloseButton
          closeLabel={closeLabel}
          onClose={onClose}
        />
      </div>

      <div className="feed-comments-list">
        {children}
      </div>

      {footer}
    </aside>
  );
}

function FeedEventPanelCloseButton({ closeLabel, onClose }) {
  return (
    <button
      type="button"
      className="feed-comments-close"
      aria-label={closeLabel}
      onClick={onClose}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </button>
  );
}
