import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getDashboardPath } from '../constants/dashboardRoutes';

export function GuestRoute() {
  const { user, ready } = useAuth();

  if (!ready) {
    return <div className="auth-restore" aria-live="polite">Restoring session…</div>;
  }

  if (user?.role) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
}

export function ProtectedRoute({ roles }) {
  const { user, ready } = useAuth();
  const location = useLocation();

  if (!ready) {
    return <div className="auth-restore" aria-live="polite">Restoring session…</div>;
  }

  if (!user?.role) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles?.length && !roles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <Outlet />;
}
