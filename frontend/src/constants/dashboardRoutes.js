/** Central role → dashboard mapping. Uses the project's existing paths. */

export const DASHBOARD_ROUTES = {
  citizen: '/citizen',
  government: '/government',
  contractor: '/constructor',
};

export function getDashboardPath(role) {
  return DASHBOARD_ROUTES[role] || '/login';
}

export function getRoleForPath(pathname) {
  if (pathname.startsWith('/citizen')) return 'citizen';
  if (pathname.startsWith('/government')) return 'government';
  if (pathname.startsWith('/constructor') || pathname.startsWith('/contractor')) {
    return 'contractor';
  }
  return null;
}
