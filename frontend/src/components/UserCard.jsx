import { Link } from 'react-router-dom';
import './UserCard.css';

/** @typedef {import('../types/user.js').UserProfile} UserProfile */

/**
 * @param {{ user: UserProfile }} props
 */
export default function UserCard({ user }) {
  const fullName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.username || 'User';
  const username = user.username || 'unknown';
  const profileImage = user.profile_image || '/images/images-2.jpeg';
  const favoriteSports = user.favorite_sports ?? [];

  const cardBody = (
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

  if (!user.username) {
    return <article className="user-card user-card-static">{cardBody}</article>;
  }

  return (
    <Link
      className="user-card"
      to={`/users/${encodeURIComponent(user.username)}`}
    >
      {cardBody}
    </Link>
  );
}
