import { useEffect, useState } from "react";
import { createEventComment, fetchEventComments } from "../api/comments";

export function FeedCommentsWindow({ selectedCommentEvent, handleCloseCommentsClick }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    async function loadComments() {
      const comments = await fetchEventComments(selectedCommentEvent); 
      setComments(Array.isArray(comments) ? comments : []);
    }

    if(selectedCommentEvent) {
      loadComments(); 
    }
  }, [selectedCommentEvent]);

  
  function handleCommentCreated(comment) {
    setComments((comments) => [...comments, comment]);
  }

  return (
    <aside className="feed-comments-panel" aria-label="Event comments">
      <FeedCommentsWindowHeader
        selectedCommentEvent={selectedCommentEvent}
        handleCloseCommentsClick={handleCloseCommentsClick}
      />

      <div className="feed-comments-list">
        <p>no comments yet</p>
      </div>

      <FeedCommentForm
        selectedCommentEvent={selectedCommentEvent}
        onCommentCreated={handleCommentCreated}
      />
    </aside>
  ); 
}

function FeedCommentsWindowHeader({ selectedCommentEvent, handleCloseCommentsClick }) {
  return (
    <div className="feed-comments-header">
      <div>
        <p className="feed-comments-eyebrow">Comments</p>
        <h2>{selectedCommentEvent?.title}</h2>
      </div>
      <FeedCommentsCloseXButton handleCloseCommentsClick={handleCloseCommentsClick}/>
    </div>
  ); 
}

function FeedCommentsCloseXButton({ handleCloseCommentsClick }) {
  return (
    <button
      type="button"
      className="feed-comments-close"
      aria-label="Close comments"
      onClick={handleCloseCommentsClick}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </button>
  ); 
}

function FeedCommentForm({ selectedCommentEvent, onCommentCreated }) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedMessage = message.trim();
    if (!selectedCommentEvent || !trimmedMessage) {
      return;
    }

    setIsSubmitting(true);

    try {
      const comment = await createEventComment(selectedCommentEvent, trimmedMessage);
      onCommentCreated(comment);
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="feed-comment-form" onSubmit={handleSubmit}>
      <label htmlFor="static-event-comment">Leave a comment</label>
      <textarea
        id="static-event-comment"
        rows="4"
        placeholder="Write a comment..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button type="submit" disabled={isSubmitting || !message.trim()}>
        {isSubmitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  ); 
}

function FeedSingleComment({name, time, message}) {
  return (
    <article className="feed-comment">
      <div className="feed-comment-header">
        <strong>{name}</strong>
        <span>{time}</span>
      </div>
      <p>{message}</p>
    </article>
  ); 
}
