import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CitizenThemeToggle from '../common/CitizenThemeToggle';
import { useCitizenTheme } from '../../context/CitizenThemeContext';
import { useAuth } from '../../context/AuthContext';
import { notifications, officerProfile } from '../../data/government/governmentOverview';
import Icon from './Icon';
import '../../pages/government/government-portal.css';

const navItems = [
  { label: 'Overview', icon: 'dashboard', to: '/government' },
  { label: 'Projects', icon: 'account_tree', to: '/government/projects' },
  { label: 'AI Risk Monitor', icon: 'monitor_heart', to: '/government/risk-monitor' },
  { label: 'Investigations', icon: 'policy', to: '/government/investigations' },
  { label: 'Analytics', icon: 'monitoring', to: '/government/analytics' },
];

function isActivePath(pathname, to) {
  if (to === '/government') return pathname === '/government';
  return pathname === to || pathname.startsWith(`${to}/`);
}

function GovernmentLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useCitizenTheme();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const officerName = user?.role === 'government' ? user.name : officerProfile.name;
  const unread = useMemo(() => notifications.filter((item) => item.unread).length, []);

  return (
    <div className={`gov-portal ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <div className="gov-shell">
        <aside className={`gov-sidebar ${collapsed ? 'collapsed' : ''}`}>
          <div className="gov-brand">
            <div className="gov-brand-main">
              <img src="/trinetra-logo.jpg" alt="TRINETRA" />
              <div className="gov-brand-copy">
                <strong>TRINETRA</strong>
                <em>Government Portal</em>
              </div>
            </div>
            <button
              type="button"
              className="gov-collapse"
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed((value) => !value)}
            >
              {collapsed ? '›' : '‹'}
            </button>
          </div>

          <nav className="gov-nav" aria-label="Government navigation">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`gov-nav-item ${isActivePath(location.pathname, item.to) ? 'active' : ''}`}
              >
                <Icon name={item.icon} />
                <span className="gov-nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="gov-side-foot">
            Control room
            <strong>{officerProfile.department}</strong>
            Duty hours 09:00–18:00 IST
          </div>
        </aside>

        <div className="gov-main">
          <header className="gov-topbar">
            <div className="gov-topbar-brand">
              <div className="gov-product">TRINETRA</div>
              <p>Public Infrastructure Monitoring &amp; Intelligence Platform</p>
            </div>

            <div className="gov-topbar-right">
              <div className="gov-region-chip" title="Department and region">
                <Icon name="account_balance" />
                {officerProfile.region}
              </div>

              <CitizenThemeToggle />

              <div className="gov-notify">
                <button
                  type="button"
                  className="gov-icon-btn"
                  aria-label="Notifications"
                  aria-expanded={notifyOpen}
                  onClick={() => {
                    setNotifyOpen((value) => !value);
                    setProfileOpen(false);
                  }}
                >
                  <Icon name="notifications" />
                  {unread > 0 ? <span className="gov-dot" /> : null}
                </button>
                {notifyOpen ? (
                  <div className="gov-dropdown" role="menu">
                    <h3>Notifications</h3>
                    {notifications.map((item) => (
                      <div key={item.id} className="gov-drop-row">
                        {item.title}
                        <small>{item.time}</small>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="gov-profile-wrap">
                <button
                  type="button"
                  className="gov-profile-btn"
                  aria-label="Officer menu"
                  aria-expanded={profileOpen}
                  onClick={() => {
                    setProfileOpen((value) => !value);
                    setNotifyOpen(false);
                  }}
                >
                  <span className="gov-avatar">MS</span>
                  <span>
                    {officerName}
                    <small style={{ display: 'block', fontWeight: 500, color: 'inherit', opacity: 0.75 }}>
                      {officerProfile.designation}
                    </small>
                  </span>
                </button>
                {profileOpen ? (
                  <div className="gov-dropdown" role="menu">
                    <h3>Officer control</h3>
                    <div className="gov-drop-row">
                      {officerProfile.name}
                      <small>{officerProfile.officerId}</small>
                    </div>
                    <div className="gov-drop-row">
                      {officerProfile.department}
                      <small>{officerProfile.region}</small>
                    </div>
                    <button type="button" onClick={() => navigate('/login')}>
                      Sign out
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </header>

          <div className="gov-content">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default GovernmentLayout;
