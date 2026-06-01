import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api/events';
import './CreateEvent.css';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [location, setLocation] = useState('');
  const [sport, setSport] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(/** @type {string | null} */ (null));

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await createEvent({
        title,
        description,
        start_at: startAt,
        ends_at: endsAt || null,
        max_attendees: parsedMaxAttendees,
        location,
        sport
      });
      navigate('/feed');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="create-event-page">
      <h1>Create Event</h1>
      <p className="create-event-intro">
        Share a pickup game or sports meetup with the community.
      </p>

      {error ? (
        <p className="create-event-error" role="alert">
          {error}
        </p>
      ) : null}

      <form className="create-event-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="startAt">Start</label>
            <input
              id="startAt"
              type="datetime-local"
              value={startAt}
              onChange={(e) => setStartAt(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="endsAt">Ends</label>
            <input
              id="endsAt"
              type="datetime-local"
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Westwood Rec Center"
          />
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="sport">Sport</label>
            <input
              id="sport"
              type="text"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              placeholder="e.g. Basketball"
            />
          </div>

          <div className="form-field">
            <label htmlFor="maxAttendees">Max attendees</label>
            <input
              id="maxAttendees"
              type="number"
              min="1"
              step="1"
              value={maxAttendees}
              onChange={(e) => setMaxAttendees(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create Event'}
        </button>
      </form>
    </main>
  );
}
