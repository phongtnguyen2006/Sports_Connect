import { NavLink, useNavigate } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  isActive ? 'nav-link nav-link-active' : 'nav-link';

export default function NavBar({currentUser, setCurrentUser}) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("access_token");
    setCurrentUser(null);
    navigate("/login");
  }

  return (
    <nav className="nav-bar">
      <span className="nav-brand">Sports Connect</span>
      <div className="nav-links">

        {currentUser ? (
          <>
            <span className="nav-user">{currentUser.username}</span>
            <button className="nav-link nav-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
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
