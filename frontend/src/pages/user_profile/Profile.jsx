import { useEffect, useState } from "react";
import { getCurrentUserProfile } from "../../api/users";
import "./Profile.css";
import {Link} from "react-router-dom";
import { fetchMyEvents, fetchMyRsvps } from "../../api/events";
import {
  fetchFollowersByUserId,
  fetchFollowingByUserId,
  unfollowUser,
} from "../../api/follows";


function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [myEvents, setMyEvents] = useState([]);
  const [eventsJoined, setEventsJoined] = useState(0);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeFollowPanel, setActiveFollowPanel] = useState(null);
  const [followError, setFollowError] = useState("");

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
        const followingUsers = await fetchFollowingByUserId(Profiledata.id);
        const followerUsers = await fetchFollowersByUserId(Profiledata.id);

        setFollowing(followingUsers);
        setFollowers(followerUsers);

        const events = await fetchMyEvents(token);
        setMyEvents(events);

        const rsvpData  = await fetchMyRsvps(token);
        setEventsJoined(rsvpData.count);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
    }, []);

  async function handleUnfollow(userId) {
  setFollowError("");

  try {
    await unfollowUser(userId);
    setFollowing((prevFollowing) =>
      prevFollowing.filter((user) => user.id !== userId)
    );
  } catch (err) {
    setFollowError(err.message);
  }
}
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
          <button
            className="profile-stat-button"
            type="button"
            onClick={() =>
              setActiveFollowPanel(activeFollowPanel === "following" ? null : "following")
            }
          >
            <strong>{following.length}</strong>
            <span>Following</span>
          </button>

          <button
            className="profile-stat-button"
            type="button"
            onClick={() =>
              setActiveFollowPanel(activeFollowPanel === "followers" ? null : "followers")
            }
          >
            <strong>{followers.length}</strong>
            <span>Followed By</span>
          </button>
          <Link className="profile-stat-link" to="/profile/joined-events">
            <strong>{eventsJoined}</strong>
            <span>Events Joined</span>
          </Link>
        </div>
        {followError && <p className="follow-error">{followError}</p>}

{activeFollowPanel && (
  <section className="follow-panel">
    <div className="follow-panel-header">
      <h2>{activeFollowPanel === "following" ? "Following" : "Followed By"}</h2>
      <button
        className="follow-panel-close"
        type="button"
        onClick={() => setActiveFollowPanel(null)}
      >
        Close
      </button>
    </div>

    {(activeFollowPanel === "following" ? following : followers).length > 0 ? (
      <div className="follow-list">
        {(activeFollowPanel === "following" ? following : followers).map((user) => {
          const name =
            user.firstName && user.lastName
              ? `${user.firstName} ${user.lastName}`
              : user.username || "User";

          return (
            <div className="follow-list-item" key={user.id}>
              <Link className="follow-user-link" to={`/users/${user.username}`}>
                <img
                  className="follow-user-image"
                  src={user.profile_image || "/images/images-2.jpeg"}
                  alt={`${name} profile`}
                />
                <div>
                  <strong>{name}</strong>
                  <span>@{user.username}</span>
                </div>
              </Link>

              {activeFollowPanel === "following" && (
                <button
                  className="unfollow-button"
                  type="button"
                  onClick={() => handleUnfollow(user.id)}
                >
                  Unfollow
                </button>
              )}
            </div>
          );
        })}
      </div>
    ) : (
      <p className="no-follow-message">
        {activeFollowPanel === "following"
          ? "You are not following anyone yet."
          : "No one is following you yet."}
      </p>
    )}
  </section>
)}

        <section className="posts-section" aria-labelledby="previous-posts">
          <div className="posts-header">
            <h2 id="previous-posts">Previous Posts</h2>
            <Link className="view-all-button" to="/profile/events">
              View All
            </Link>
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
