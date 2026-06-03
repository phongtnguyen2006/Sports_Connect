import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJoinedEvents } from "../../api/events";
import "./UserEvents.css";

function JoinedEvents() {
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJoinedEvents() {
      try {
        const events = await fetchJoinedEvents();
        setJoinedEvents(events);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadJoinedEvents();
  }, []);

  if (loading) {
    return <div className="user-events-page">Loading joined events...</div>;
  }

  if (error) {
    return <div className="user-events-page">Error: {error}</div>;
  }

  return (
    <div className="user-events-page">
      <div className="user-events-header">
        <div>
          <p className="user-events-label">Sports Connect</p>
          <h1>Events Joined</h1>
        </div>

        <Link className="back-profile-button" to="/profile">
          Back to Profile
        </Link>
      </div>

      {joinedEvents.length > 0 ? (
        <div className="user-events-grid">
          {joinedEvents.map((event) => (
            <article className="user-event-card" key={event.id}>
              <p className="user-event-meta">
                {new Date(event.starts_at).toLocaleDateString()} -{" "}
                {event.location || "Location TBD"}
              </p>

              <h2>{event.title}</h2>

              <p className="user-event-description">
                {event.description || "No description provided."}
              </p>

              <div className="user-event-details">
                <span>{event.sport || "Sport TBD"}</span>
                <span>Max: {event.max_attendees || "No limit"}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="no-events-message">You have not joined any events yet.</p>
      )}
    </div>
  );
}

export default JoinedEvents;