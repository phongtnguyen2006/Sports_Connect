import { Link } from 'react-router-dom';
import './Feed.css';

export default function Feed() {
  return (
    <main className="feed-page">
      <header className="feed-header">
        <div>
          <h1>Event Feed</h1>
          <p className="feed-subtitle">
            Discover pickup games and sports meetups near you
          </p>
        </div>
        <Link className="feed-create-link" to="/create-event">
          Create Event
        </Link>
      </header>
    </main>
  );
}
