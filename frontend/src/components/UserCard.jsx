import { Link } from 'react-router-dom';
import './UserCard.css';

/** @typedef {import('../types/user.js').UserProfile} UserProfile */

/**
 * @param {{
 *   user: UserProfile,
 *   onFollow?: (userId: string) => void,
 *   isFollowingUser?: boolean,
 * }} props
 */
export default function UserCard({ user, onFollow, isFollowingUser = false }) {
  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || 'User';
  const username = user.username || 'unknown';
  const profileImage = user.profile_image || '/images/images-2.jpeg';
  const favoriteSports = user.favorite_sports ?? [];
  const isFollowing = Boolean(user.is_following);

  const profileContent = (
    <>
      <img
        className="user-card-avatar"
        src={profileImage}
        alt={`${fullName} profile`}
      />
      <div className="user-card-body">
        <h3 className="user-card-name">{fullName}</h3>
        <p className="user-card-username">@{username}</p>
        {user.biography ? (
          <p className="user-card-bio">{user.biography}</p>
        ) : null}
        {favoriteSports.length > 0 ? (
          <p className="user-card-sports">
            {favoriteSports.slice(0, 3).join(' · ')}
          </p>
        ) : null}
      </div>
    </>
  );

  return (
    <article className="user-card">
      {user.username ? (
        <Link
          className="user-card-profile-link"
          to={`/users/${encodeURIComponent(user.username)}`}
        >
          {profileContent}
        </Link>
      ) : (
        <div className="user-card-profile-link user-card-profile-link-static">
          {profileContent}
        </div>
      )}

      {isFollowing ? (
        <span className="user-card-following-badge" aria-label="Following">
          Following
        </span>
      ) : (
        <button
          type="button"
          className="user-card-follow-button"
          onClick={() => onFollow?.(user.id)}
          disabled={isFollowingUser || !onFollow}
          aria-label={`Follow ${fullName}`}
          title="Follow"
        >
          {isFollowingUser ? '…' : '+'}
        </button>
      )}
    </article>
  );
}
