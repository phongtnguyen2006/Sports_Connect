import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

export default function NavBar() {
  return (
    <nav className="nav-bar">
      <span className="nav-brand">Sports Connect</span>
      <div className="nav-links">
        <NavLink to="/login" className={linkClass}>
          Login
        </NavLink>
        <NavLink to="/feed" className={linkClass}>
          Feed
        </NavLink>
        <NavLink to="/profile" className={linkClass}>
          Profile
        </NavLink>
      </div>
    </nav>
  );
}
