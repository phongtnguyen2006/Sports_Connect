import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../api/events';
import './CreateEvent.css';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
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
        date,
        time,
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
            <label htmlFor="date">Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="time">Time</label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
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
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating…' : 'Create Event'}
        </button>
      </form>
    </main>
  );
}
