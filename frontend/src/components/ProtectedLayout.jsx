import { Navigate, Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { isAuthenticated } from '../utils/auth';

/**
 * Layout for authenticated screens. Renders the NavBar and the matched
 * child route. Visitors without an access token are redirected to /login.
 */
export default function ProtectedLayout({ currentUser, setCurrentUser, authLoading }) {
  if (authLoading) {
    return <p className="auth-loading">Loading...</p>;
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <NavBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Outlet />
    </>
  );
}
