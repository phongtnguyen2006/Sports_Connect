export function FeedCommentsWindow() {
  return (
    <aside className="feed-comments-panel" aria-label="Event comments">
      <FeedCommentsWindowHeader/>

      <div className="feed-comments-list">        
        <FeedSingleComment 
          name="Alex" 
          time="10:24 AM" 
          message="Is there still room for one more player?"/>

        <FeedSingleComment
          name="Sam"
          time="10:31 AM"
          message="I can bring an extra ball if needed."/>
      </div>

      <FeedCommentForm/>
    </aside>
  ); 
}

function FeedCommentsWindowHeader() {
  return (
    <div className="feed-comments-header">
      <div>
        <p className="feed-comments-eyebrow">Comments</p>
        <h2>Event discussion</h2>
      </div>
      <FeedCommentsCloseXButton/>
    </div>
  ); 
}

function FeedCommentsCloseXButton() {
  return (
    <button
      type="button"
      className="feed-comments-close"
      aria-label="Close comments"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    </button>
  ); 
}

function FeedCommentForm() {
  return (
    <form className="feed-comment-form">
      <label htmlFor="static-event-comment">Leave a comment</label>
      <textarea
        id="static-event-comment"
        rows="4"
        placeholder="Write a comment..."
      />
      <button type="button">Post Comment</button>
    </form>
  ); 
}

function FeedSingleComment(name, time, message) {
  return (
    <article className="feed-comment">
      <div className="feed-comment-header">
        <strong>Alex</strong>
        <span>10:24 AM</span>
      </div>
      <p>Is there still room for one more player?</p>
    </article>
  ); 
}