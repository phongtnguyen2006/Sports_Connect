import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyEvents } from "../../api/events";
import "./UserEvents.css";

function UserEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEvents() {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("You are not logged in.");
          return;
        }

        const userEvents = await fetchMyEvents(token);
        setEvents(userEvents);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  if (loading) {
    return <div className="user-events-page">Loading your events...</div>;
  }

  if (error) {
    return <div className="user-events-page">Error: {error}</div>;
  }

  return (
    <div className="user-events-page">
      <div className="user-events-header">
        <div>
          <p className="user-events-label">Sports Connect</p>
          <h1>Your Created Events</h1>
        </div>

        <Link className="back-profile-button" to="/profile">
          Back to Profile
        </Link>
      </div>

      {events.length > 0 ? (
        <div className="user-events-grid">
          {events.map((event) => (
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
                <span>
                  Max: {event.max_attendees || "No limit"}
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="no-events-message">You have not created any events yet.</p>
      )}
    </div>
  );
}

export default UserEvents;