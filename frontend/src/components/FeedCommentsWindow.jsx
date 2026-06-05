import { useEffect, useState } from "react";
import { createEventComment, fetchEventComments } from "../api/comments";
import { FeedEventPanel } from "./FeedEventPanel.jsx";

export function FeedCommentsWindow({ selectedCommentEvent, handleCloseCommentsClick }) {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if(!selectedCommentEvent) {
      setComments([]);
      return;
    }

    async function loadComments() {
      try {
        const comments = await fetchEventComments(selectedCommentEvent);
        setComments(Array.isArray(comments) ? comments : []);
      } catch (err) {
        console.error(err);
        setComments([]);
      }
    }

    loadComments(); 

    const intervalId = setInterval(loadComments, 3000); 

    return () => clearInterval(intervalId); 
  }, [selectedCommentEvent]);

  
  function handleCommentCreated(comment) {
    setComments((comments) => [...comments, comment]);
  }

  return (
    <FeedEventPanel
      ariaLabel="Event comments"
      eyebrow="Comments"
      title={selectedCommentEvent?.title}
      onClose={handleCloseCommentsClick}
      closeLabel="Close comments"
      footer={(
        <FeedCommentForm
          selectedCommentEvent={selectedCommentEvent}
          onCommentCreated={handleCommentCreated}
        />
      )}
    >
        {comments.length === 0 ? (
          <p className="feed-comments-empty">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <FeedSingleComment
              key={`${comment.userId ?? comment.user_id}-${comment.created_at}`}
              comment={comment}
            />
          ))
        )}
    </FeedEventPanel>
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

function FeedSingleComment({comment}) {
  const userId = comment.userId ?? comment.user_id;
  const authorName = comment.username
    ? `@${comment.username}`
    : formatCommentAuthor(userId);
  const createdAt = comment.created_at
    ? new Date(comment.created_at).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

  return (
    <article className="feed-comment">
      <div className="feed-comment-header">
        <div>
          <strong>{authorName}</strong>
          {comment.is_rsvpd ? (
            <span className="feed-comment-rsvp">RSVP'd</span>
          ) : null}
        </div>
        <span>{createdAt}</span>
      </div>
      <p>{comment.message}</p>
    </article>
  ); 
}

function formatCommentAuthor(userId) {
  if (!userId) {
    return 'Member';
  }

  return `Member ${String(userId).slice(0, 8)}`;
}
