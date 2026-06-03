import { useEffect, useState } from "react";
import { getCurrentUserProfile } from "../../api/users";
import "./Profile.css";
import {Link} from "react-router-dom";
import { fetchMyEvents } from "../../api/events";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [myEvents, setMyEvents] = useState([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("You are not logged in.");
          return;
        }

        
        const Profiledata = await getCurrentUserProfile(token);
        setProfile(Profiledata);

        const events = await fetchMyEvents(token);
        setMyEvents(events);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
    }, []);

  if (loading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  if (error) {
    return <div className="profile-page">Error: {error}</div>;
  }

  if (!profile) {
    return <div className="profile-page">Profile not found.</div>;
  }

  const fullName = 
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.username || "User";

  const username = profile.username || "username";
  const bio = profile.biography || "No biography yet."
  const profileImage = profile.profile_image || "/images/images-2.jpeg";
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
            <p className="profile-username">@{username}</p>
            <p className="profile-bio">{bio}</p>

            <div className="profile-details" aria-label="Profile details">
              {favoriteSports.length > 0 ? (
                favoriteSports.map((sport) => (
                  <span key={sport}>{sport}</span>
                ))
              ) : (
                <span>No sports selected</span>
              )}
            </div>
            <Link className="edit-profile-button" to="/profile/edit-profile">
              Edit Profile
            </Link>
          </div>
        </div>

        <div className="profile-stats" aria-label="Profile stats">
          <div>
            <strong>{myEvents.length}</strong>
            <span>Posts</span>
          </div>
          <div>
            <strong>42</strong>
            <span>Connections</span>
          </div>
          <div>
            <strong>7</strong>
            <span>Events Joined</span>
          </div>
        </div>

        <section className="posts-section" aria-labelledby="previous-posts">
          <div className="posts-header">
            <h2 id="previous-posts">Previous Posts</h2>
            <button className="view-all-button" type="button">
              View All
            </button>
          </div>

          <div className="posts-grid">
            {myEvents.length > 0 ? (
                myEvents.map((event) => (
                  <article className="post" key={event.id}>
                    <p className="post-meta">
                      {new Date(event.starts_at).toLocaleDateString()} - {" "}
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

export default Profile;
