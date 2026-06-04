import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserByUsername } from '../../api/users';
import {
  fetchEventsByUserId,
  fetchJoinedEventsByUserId,
} from '../../api/events';
import './Profile.css';

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [eventsJoined, setEventsJoined] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setError('');

      try {
        const data = await getUserByUsername(username ?? '');
        if (!cancelled) {
          setProfile(data);

          const createdEvents = await fetchEventsByUserId(data.id);
          const joinedData = await fetchJoinedEventsByUserId(data.id);

          if (cancelled) return;

          setUserEvents(createdEvents);
          setEventsJoined(joinedData.count);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Something went wrong');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (username) {
      loadProfile();
    }

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="profile-page">
        <p>Error: {error}</p>
        <Link to="/feed">Back to feed</Link>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <p>Profile not found.</p>
        <Link to="/feed">Back to feed</Link>
      </div>
    );
  }

  const fullName =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.username || 'User';
  const profileUsername = profile.username || 'username';
  const bio = profile.biography || 'No biography yet.';
  const profileImage = profile.profile_image || '/images/images-2.jpeg';
  const favoriteSports = profile.favorite_sports || [];

  return (
    <div className="profile-page">
      <section className="profile-content" aria-label="User profile">
        <div className="profile-top">
          <div className="profile-photo-wrap">
            <img
              className="profile-image"
              src={profileImage}
              alt={`${fullName} profile`}
            />
          </div>

          <div className="profile-info">
            <p className="profile-label">Sports Connect Profile</p>
            <h1 className="profile-name">{fullName}</h1>
            <p className="profile-username">@{profileUsername}</p>
            <p className="profile-bio">{bio}</p>

            <div className="profile-details" aria-label="Profile details">
              {favoriteSports.length > 0 ? (
                favoriteSports.map((sport) => <span key={sport}>{sport}</span>)
              ) : (
                <span>No sports selected</span>
              )}
            </div>
          </div>
        </div>

        <div className="profile-stats" aria-label="Profile stats">
          <div>
            <strong>{userEvents.length}</strong>
            <span>Posts</span>
          </div>
          <div>
            <strong>42</strong>
            <span>Connections</span>
          </div>
          <div>
            <strong>{eventsJoined}</strong>
            <span>Events Joined</span>
          </div>
        </div>

        <section className="posts-section" aria-labelledby="previous-posts">
          <div className="posts-header">
            <h2 id="previous-posts">Previous Posts</h2>
          </div>

          <div className="posts-grid">
            {userEvents.length > 0 ? (
              userEvents.map((event) => (
                <article className="post" key={event.id}>
                  <p className="post-meta">
                    {new Date(event.starts_at).toLocaleDateString()} -{" "}
                    {event.location || "Location TBD"}
                  </p>
                  <h3>{event.title}</h3>
                  <p>{event.description || "No description provided."}</p>
                </article>
              ))
            ) : (
              <p>No previous events yet.</p>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
