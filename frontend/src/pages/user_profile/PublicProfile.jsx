import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserByUsername } from '../../api/users';
import './Profile.css';

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
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
      </section>
    </div>
  );
}
