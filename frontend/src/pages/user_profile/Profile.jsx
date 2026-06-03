import { useEffect, useState } from "react";
import { getCurrentUserProfile } from "../../api/users";
import "./Profile.css";
import {Link} from "react-router-dom";


const posts = [
  {
    title: "Looking for pickup basketball tonight",
    meta: "May 12 - Westwood Rec Center",
    text: "Need two more players for a friendly 5v5 run at 7 PM. All skill levels welcome.",
  },
  {
    title: "Morning tennis rally",
    meta: "May 8 - UCLA Tennis Courts",
    text: "Had a great hitting session and found a new doubles partner through Sports Connect.",
  },
  {
    title: "Weekend soccer group",
    meta: "May 3 - Drake Stadium",
    text: "Starting a casual Sunday soccer group. Comment if you want to join next week.",
  },
];

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
            <strong>18</strong>
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
            {posts.map((post) => (
              <article className="post" key={post.title}>
                <p className="post-meta">{post.meta}</p>
                <h3>{post.title}</h3>
                <p>{post.text}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

export default Profile;
