import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

/**
 * Wraps the login/register screens. Already-authenticated users are sent
 * to the feed so they never see the auth screens again while logged in.
 */
export default function PublicRoute({ authLoading }) {
  if (authLoading) {
    return <p className="auth-loading">Loading...</p>;
  }

  if (isAuthenticated()) {
    return <Navigate to="/feed" replace />;
  }

  return <Outlet />;
}
