import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

export default function NavBar({currentUser}) {
  return (
    <nav className="nav-bar">
      <span className="nav-brand">Sports Connect</span>
      <div className="nav-links">

        {currentUser ? (
          <span className="nav-user">{currentUser.username}</span>
        ) : (
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        )}


        <NavLink to="/feed" className={linkClass}>
          Feed
        </NavLink>
        <NavLink to="/create-event" className={linkClass}>
          Create Event
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
      </div>
    </nav>
  );
}
