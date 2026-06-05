import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserByUsername, getCurrentUserProfile } from '../../api/users';
import {
  fetchEventsByUserId,
  fetchJoinedEventsByUserId,
} from '../../api/events';
import './Profile.css';
import {
  fetchFollowersByUserId,
  fetchFollowingByUserId,
  followUser,
  unfollowUser,
} from '../../api/follows';

export default function PublicProfile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [userEvents, setUserEvents] = useState([]);
  const [eventsJoined, setEventsJoined] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFollowingProfile, setIsFollowingProfile] = useState(false);
  const [followActionLoading, setFollowActionLoading] = useState(false);
  const [followActionError, setFollowActionError] = useState('');
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [activeFollowPanel, setActiveFollowPanel] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      setLoading(true);
      setError('');

      try {
        const data = await getUserByUsername(username ?? '');
        const token = localStorage.getItem('access_token');
          let loggedInUser = null;
          let loggedInFollowing = [];

          if (token) {
            loggedInUser = await getCurrentUserProfile(token);
            loggedInFollowing = await fetchFollowingByUserId(loggedInUser.id);
          }

        if (cancelled) return;

        setProfile(data);

          const createdEvents = await fetchEventsByUserId(data.id);
          const joinedData = await fetchJoinedEventsByUserId(data.id);
          const followingUsers = await fetchFollowingByUserId(data.id);
          const followerUsers = await fetchFollowersByUserId(data.id);
          if (cancelled) return;

          setUserEvents(createdEvents);
          setEventsJoined(joinedData.count);
          setFollowing(followingUsers);
          setFollowers(followerUsers);
          setCurrentUser(loggedInUser);
          setIsFollowingProfile(
            loggedInFollowing.some((user) => user.id === data.id)
          );
        }
        catch (err) {
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

  async function handleFollowProfile() {
  if (!profile) return;

  setFollowActionError('');
  setFollowActionLoading(true);

  try {
    if (isFollowingProfile) {
      await unfollowUser(profile.id);

      setIsFollowingProfile(false);
      setFollowers((prevFollowers) =>
        prevFollowers.filter((user) => user.id !== currentUser?.id)
      );
    } else {
      await followUser(profile.id);

      setIsFollowingProfile(true);

      if (currentUser) {
        setFollowers((prevFollowers) => {
          const alreadyListed = prevFollowers.some(
            (user) => user.id === currentUser.id
          );

          if (alreadyListed) return prevFollowers;

          return [...prevFollowers, currentUser];
        });
      }
    }
  } catch (err) {
    setFollowActionError(
      err instanceof Error ? err.message : 'Failed to update follow'
    );
  } finally {
    setFollowActionLoading(false);
  }
}

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
  const isOwnProfile = currentUser?.id === profile.id;
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
            {!isOwnProfile && (
              <>
                <button
                  className={
                    isFollowingProfile
                      ? 'public-profile-unfollow-button'
                      : 'public-profile-follow-button'
                  }
                  type="button"
                  onClick={handleFollowProfile}
                  disabled={followActionLoading}
                >
                  {followActionLoading
                    ? 'Updating...'
                    : isFollowingProfile
                      ? 'Unfollow'
                      : 'Follow'}
                </button>

                {followActionError && (
                  <p className="follow-error">{followActionError}</p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="profile-stats" aria-label="Profile stats">
          <div>
            <strong>{userEvents.length}</strong>
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
          <div>
            <strong>{eventsJoined}</strong>
            <span>Events Joined</span>
          </div>
        </div>
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
            </div>
          );
        })}
      </div>
    ) : (
      <p className="no-follow-message">
        {activeFollowPanel === "following"
          ? "This user is not following anyone yet."
          : "No one is following this user yet."}
      </p>
    )}
  </section>
)}
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

