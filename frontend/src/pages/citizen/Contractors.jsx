import { Link, useLocation } from 'react-router-dom';
import CitizenThemeToggle from '../../components/common/CitizenThemeToggle';
import { useCitizenTheme } from '../../context/CitizenThemeContext';

const contractors = [
  {
    name: 'ABC Infrastructure Pvt. Ltd.',
    category: 'Roads & Connectivity',
    activeProjects: 4,
    compliance: 'Low Risk',
    score: 78,
    lastAudit: '12 Apr 2025',
    status: 'Verified',
  },
  {
    name: 'Punjab BuildWorks',
    category: 'Education',
    activeProjects: 2,
    compliance: 'Medium Risk',
    score: 68,
    lastAudit: '01 May 2025',
    status: 'Review',
  },
  {
    name: 'Northern Civil Works',
    category: 'Water & Sanitation',
    activeProjects: 3,
    compliance: 'High Risk',
    score: 54,
    lastAudit: '16 Apr 2025',
    status: 'Flagged',
  },
  {
    name: 'GreenGrid Power',
    category: 'Street Lighting',
    activeProjects: 1,
    compliance: 'Low Risk',
    score: 86,
    lastAudit: '08 May 2025',
    status: 'Verified',
  },
];

const navItems = [
  { label: 'Home', icon: '⌂', to: '/citizen' },
  { label: 'Projects', icon: '▣', to: '/citizen/projects' },
  { label: 'Contractors', icon: '▤', to: '/citizen/contractors' },
  { label: 'Reports & Feedback', icon: '✎', to: '/citizen/feedback' },
];

const styles = `
  .contractors-page {
    --page-bg: #edf2f8;
    --sidebar-bg: #f4f7fb;
    --panel-bg: #ffffff;
    --panel-soft: #f9fbfd;
    --surface-bg: #f8fafd;
    --title-color: #132437;
    --body-color: #3b546c;
    --muted-color: #66727d;
    --border: #dde7f2;
    --shadow: rgba(17, 33, 54, 0.04);
    min-height: 100vh;
    background: var(--page-bg);
    font-family: "Inter", "Segoe UI", sans-serif;
    color: var(--title-color);
  }

  .contractors-page.dark-theme {
    --page-bg: #0a1220;
    --sidebar-bg: #101a2b;
    --panel-bg: #111f2f;
    --panel-soft: #15263a;
    --surface-bg: #0f1b2d;
    --title-color: #edf4ff;
    --body-color: #dfeaf8;
    --muted-color: #b2c3d9;
    --border: rgba(162, 182, 210, 0.18);
    --shadow: rgba(2, 6, 12, 0.42);
    background: var(--page-bg);
    color: var(--title-color);
  }

  .contractors-page.dark-theme {
    color: var(--title-color);
  }

  .contractors-page.dark-theme .contractors-sidebar,
  .contractors-page.dark-theme .contractors-topbar,
  .contractors-page.dark-theme .contractors-content,
  .contractors-page.dark-theme .contractors-card,
  .contractors-page.dark-theme .contractors-header,
  .contractors-page.dark-theme .contractors-toolbar,
  .contractors-page.dark-theme .contractors-location,
  .contractors-page.dark-theme .contractors-button,
  .contractors-page.dark-theme .contractors-search input,
  .contractors-page.dark-theme .contractor-filter select,
  .contractors-page.dark-theme table,
  .contractors-page.dark-theme th,
  .contractors-page.dark-theme td,
  .contractors-page.dark-theme .contractors-brand,
  .contractors-page.dark-theme .contractors-nav-item,
  .contractors-page.dark-theme .contractors-nav-item .icon {
    background: #131f2d !important;
    border-color: rgba(148, 167, 190, 0.22) !important;
    color: var(--title-color) !important;
  }

  .contractors-shell {
    display: flex;
    min-height: 100vh;
  }

  .contractors-sidebar {
    width: 240px;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 18px 16px 14px;
    box-sizing: border-box;
  }

  .contractors-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 4px 16px;
    margin-bottom: 18px;
  }
  .contractors-brand img {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(24, 45, 73, 0.12);
  }
  .contractors-brand strong {
    display: block;
    font-size: 1.5rem;
    letter-spacing: 0.04em;
    font-weight: 800;
    color: var(--title-color);
  }
  .contractors-brand span {
    display: block;
    margin-top: 3px;
    font-size: 0.72rem;
    color: #72839a;
    letter-spacing: 0.04em;
  }

  .contractors-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .contractors-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 10px;
    border-radius: 10px;
    color: var(--body-color);
    font-size: 0.88rem;
    font-weight: 600;
    text-decoration: none;
  }
  .contractors-nav-item.active {
    background: #eaf0f7;
    color: #1d2d40;
    box-shadow: inset 0 0 0 1px #dfe9f4;
  }
  .contractors-nav-item .icon {
    width: 18px;
    text-align: center;
    color: #576e88;
  }

  .contractors-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .contractors-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    background: var(--surface-bg);
    border-bottom: 1px solid var(--border);
    padding: 12px 18px 10px;
  }

  .contractors-topbar-left, .contractors-topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .contractors-location {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    border: 1px solid #dfe9f3;
    background: #fff;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 600;
    color: #52677f;
  }

  .contractors-button {
    border: 1px solid var(--border);
    background: var(--panel-bg);
    color: var(--title-color);
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
  }

  .citizen-theme-toggle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--panel-bg);
    color: #f5b942;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.9rem;
    line-height: 1;
  }

  .contractors-search {
    position: relative;
    width: 340px;
  }
  .contractors-search input {
    width: 100%;
    border: 1px solid #dfe8f4;
    background: #fff;
    border-radius: 10px;
    padding: 9px 14px 9px 40px;
    color: #485f79;
    font-size: 0.82rem;
    outline: none;
    box-sizing: border-box;
  }
  .contractors-search .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6f869a;
    font-size: 1rem;
  }

  .contractors-content {
    padding: 18px 20px 20px;
  }

  .contractors-card {
    background: var(--panel-bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 16px var(--shadow);
  }

  .contractors-header {
    padding: 18px 20px 14px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 12px;
    border-bottom: 1px solid #e5edf5;
    background: #fbfcfe;
  }
  .contractors-header h1 {
    margin: 0;
    font-size: clamp(1.9rem, 2vw, 2.4rem);
    letter-spacing: -0.04em;
    color: var(--title-color);
    font-weight: 800;
  }
  .contractors-header p {
    margin: 8px 0 0;
    color: #66727d;
    font-size: 0.9rem;
  }

  .contractors-toolbar {
    padding: 16px 20px;
    display: grid;
    grid-template-columns: repeat(4, minmax(160px, 1fr));
    gap: 12px;
    border-bottom: 1px solid #ebf0f6;
    background: #f9fbfd;
  }
  .contractor-filter {
    position: relative;
  }
  .contractor-filter select {
    width: 100%;
    height: 40px;
    border: 1px solid #dfe7f1;
    border-radius: 10px;
    background: #fff;
    appearance: none;
    padding: 0 30px 0 10px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #24384d;
    box-sizing: border-box;
  }
  .contractor-filter .caret {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #5d7187;
    font-size: 0.8rem;
  }

  .contractors-table-wrap {
    padding: 16px 20px 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    background: #fff;
    border: 1px solid #e4ecf5;
    border-radius: 12px;
    overflow: hidden;
  }
  th, td {
    padding: 12px 12px;
    border-bottom: 1px solid #edf2f7;
    text-align: left;
    font-size: 0.76rem;
    color: #3b546c;
  }
  th {
    background: #f8fafc;
    color: #5d6e7f;
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 800;
  }

  .company-name {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .company-name strong {
    color: #17212b;
  }

  .score-pill {
    display: inline-flex;
    align-items: center;
    border-radius: 999px;
    padding: 5px 8px;
    font-weight: 700;
    background: #edf7f0;
    color: #2b7f5c;
    border: 1px solid #d8f0e3;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 5px 8px;
    font-weight: 700;
    border: 1px solid transparent;
  }
  .status-verified {
    background: #eefaf4;
    color: #2b7f5c;
    border-color: #d7f0e3;
  }
  .status-review {
    background: #fff7ea;
    color: #b77b28;
    border-color: #efdebb;
  }
  .status-flagged {
    background: #fff0f0;
    color: #d54e4e;
    border-color: #f0d0d0;
  }

  .contractor-view-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    border-radius: 9px;
    background: linear-gradient(135deg, #123b5d 0%, #2e6b9f 100%);
    color: #ffffff;
    text-decoration: none;
    font-size: 0.72rem;
    font-weight: 800;
    box-shadow: 0 8px 18px rgba(18, 59, 93, 0.18);
  }

  @media (max-width: 900px) {
    .contractors-shell { flex-direction: column; }
    .contractors-sidebar { width: 100%; border-right: none; border-bottom: 1px solid #dde7f2; }
    .contractors-toolbar { grid-template-columns: repeat(2, minmax(160px, 1fr)); }
  }
`;

function Contractors() {
  const location = useLocation();
  const { theme } = useCitizenTheme();

  return (
    <div className={`contractors-page ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <style>{styles}</style>

      <div className="contractors-shell">
        <aside className="contractors-sidebar">
          <div className="contractors-brand">
            <img src="/trinetra-logo.jpg" alt="TRINETRA logo" />
            <div>
              <strong>TRINETRA</strong>
            </div>
          </div>

          <nav className="contractors-nav" aria-label="Citizen navigation">
            <CitizenThemeToggle />
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link key={item.label} to={item.to} className={`contractors-nav-item ${isActive ? 'active' : ''}`}>
                  <span className="icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="contractors-main">
          <header className="contractors-topbar">
            <div className="contractors-topbar-left">
              <div className="contractors-location">📍 Ludhiana, Punjab</div>
              <button className="contractors-button" type="button">Change Area</button>
            </div>

            <div className="contractors-topbar-right">
              <div className="contractors-search">
                <span className="search-icon">⌕</span>
                <input type="text" placeholder="Search contractor or project" />
              </div>
              <button className="contractors-button" type="button">🔔</button>
            </div>
          </header>

          <div className="contractors-content">
            <section className="contractors-card">
              <div className="contractors-header">
                <div>
                  <h1>Contractors</h1>
                  <p>Track contractor compliance, audit performance, and project delivery accountability.</p>
                </div>
                <button className="contractors-button" type="button">Download Full Audit</button>
              </div>

              <div className="contractors-toolbar">
                <div className="contractor-filter">
                  <select defaultValue="Filter by category">
                    <option disabled>Filter by category</option>
                    <option>Roads &amp; Connectivity</option>
                    <option>Education</option>
                    <option>Water &amp; Sanitation</option>
                    <option>Street Lighting</option>
                  </select>
                  <span className="caret">▾</span>
                </div>

                <div className="contractor-filter">
                  <select defaultValue="Compliance status">
                    <option disabled>Compliance status</option>
                    <option>Low Risk</option>
                    <option>Medium Risk</option>
                    <option>High Risk</option>
                  </select>
                  <span className="caret">▾</span>
                </div>

                <div className="contractor-filter">
                  <select defaultValue="Performance band">
                    <option disabled>Performance band</option>
                    <option>Top 25%</option>
                    <option>Median</option>
                    <option>High Watch</option>
                  </select>
                  <span className="caret">▾</span>
                </div>

                <div className="contractor-filter">
                  <select defaultValue="Location">
                    <option disabled>Location</option>
                    <option>Ludhiana</option>
                    <option>Ward 12</option>
                    <option>Sahnewal Block</option>
                  </select>
                  <span className="caret">▾</span>
                </div>
              </div>

              <div className="contractors-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Contractor</th>
                      <th>Category</th>
                      <th>Active Projects</th>
                      <th>Compliance</th>
                      <th>Score</th>
                      <th>Last Audit</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractors.map((contractor) => (
                      <tr key={contractor.name}>
                        <td>
                          <div className="company-name">
                            <strong>{contractor.name}</strong>
                            <span>Registered vendor</span>
                          </div>
                        </td>
                        <td>{contractor.category}</td>
                        <td>{contractor.activeProjects}</td>
                        <td>{contractor.compliance}</td>
                        <td><span className="score-pill">{contractor.score}/100</span></td>
                        <td>{contractor.lastAudit}</td>
                        <td>
                          <span className={`status-badge ${contractor.status === 'Verified' ? 'status-verified' : contractor.status === 'Review' ? 'status-review' : 'status-flagged'}`}>
                            {contractor.status}
                          </span>
                        </td>
                        <td>
                          <Link to={`/citizen/contractors/${encodeURIComponent(contractor.name)}`} className="contractor-view-link">
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Contractors;
