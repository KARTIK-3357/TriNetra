import { Link, useParams } from 'react-router-dom';
import CitizenThemeToggle from '../../components/common/CitizenThemeToggle';
import { useCitizenTheme } from '../../context/CitizenThemeContext';

const contractorProfiles = {
  'ABC Infrastructure Pvt. Ltd.': {
    name: 'ABC Infrastructure Pvt. Ltd.',
    category: 'Roads & Connectivity',
    activeProjects: 4,
    compliance: 'Low Risk',
    score: 78,
    lastAudit: '12 Apr 2025',
    status: 'Verified',
    address: 'Industrial Area, Ludhiana',
    contact: 'Mr. Harpreet Singh',
    regNo: 'PWC-2024-118',
    summary:
      'The firm has a strong completion record on rural connectivity works and is currently managing multiple active road and drainage packages in Ludhiana.',
    projects: [
      { name: 'Rural Road Improvement', id: 'MPLADS-2025-0142', progress: '48%', status: 'Delayed' },
      { name: 'Drainage Channel Rehabilitation', id: 'MPLADS-2025-0379', progress: '64%', status: 'Ongoing' },
      { name: 'Street Lighting Network Expansion', id: 'MPLADS-2025-0317', progress: '21%', status: 'Under Review' },
    ],
  },
  'Punjab BuildWorks': {
    name: 'Punjab BuildWorks',
    category: 'Education',
    activeProjects: 2,
    compliance: 'Medium Risk',
    score: 68,
    lastAudit: '01 May 2025',
    status: 'Review',
    address: 'Bhamian Road, Ludhiana',
    contact: 'Ms. Simran Kaur',
    regNo: 'PWC-2024-021',
    summary:
      'Punjab BuildWorks is delivering school infrastructure projects with a mixed compliance banner, requiring stronger progress tracking on a few facilities.',
    projects: [
      { name: 'Government School Infrastructure Upgrade', id: 'MPLADS-2025-0187', progress: '72%', status: 'On Track' },
      { name: 'Community Hall Modernisation', id: 'MPLADS-2025-0410', progress: '88%', status: 'Completed' },
    ],
  },
  'Northern Civil Works': {
    name: 'Northern Civil Works',
    category: 'Water & Sanitation',
    activeProjects: 3,
    compliance: 'High Risk',
    score: 54,
    lastAudit: '16 Apr 2025',
    status: 'Flagged',
    address: 'Civil Lines, Ludhiana',
    contact: 'Mr. Gagandeep Sharma',
    regNo: 'PWC-2025-066',
    summary:
      'The contractor has recurring schedule instability in water and sanitation works and has been flagged for additional audit follow-up.',
    projects: [
      { name: 'Drinking Water Pipeline Improvement', id: 'MPLADS-2025-0211', progress: '61%', status: 'In Progress' },
      { name: 'Sewer Network Augmentation', id: 'MPLADS-2025-0488', progress: '55%', status: 'Sanctioned' },
    ],
  },
  'GreenGrid Power': {
    name: 'GreenGrid Power',
    category: 'Street Lighting',
    activeProjects: 1,
    compliance: 'Low Risk',
    score: 86,
    lastAudit: '08 May 2025',
    status: 'Verified',
    address: 'Model Town, Ludhiana',
    contact: 'Mr. Ritesh Mehta',
    regNo: 'PWC-2024-076',
    summary:
      'GreenGrid Power has a strong compliance profile and is delivering the street lighting programme with a healthy completion outlook.',
    projects: [
      { name: 'Street Lighting Network Expansion', id: 'MPLADS-2025-0317', progress: '21%', status: 'Under Review' },
    ],
  },
};

const styles = `
  .contractor-detail-page {
    --page-bg: #edf2f8;
    --card-bg: #ffffff;
    --card-soft: #f8fafc;
    --title-color: #132437;
    --body-color: #566a7d;
    --border: #dde7f1;
    --shadow: rgba(17, 33, 54, 0.04);
    min-height: 100vh; background: var(--page-bg); font-family: "Inter", "Segoe UI", sans-serif; color: var(--title-color);
  }
  .contractor-detail-page.dark-theme {
    --page-bg: #0a1220;
    --card-bg: #111f2f;
    --card-soft: #15263a;
    --title-color: #edf4ff;
    --body-color: #dfeaf8;
    --border: rgba(162, 182, 210, 0.18);
    --shadow: rgba(2, 6, 12, 0.42);
    background: var(--page-bg); color: var(--title-color);
  }
  .contractor-detail-shell { max-width: 1120px; margin: 0 auto; padding: 28px 20px 40px; }
  .contractor-topbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand img { width: 36px; height: 36px; border-radius: 10px; object-fit: cover; }
  .brand strong { font-size: 1.5rem; letter-spacing: 0.04em; }
  .back-link { text-decoration: none; color: #123b5d; font-weight: 700; }
  .citizen-theme-toggle { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border); background: var(--card-bg); color: #f5b942; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9rem; padding: 0; line-height: 1; }
  .detail-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 18px; padding: 22px; box-shadow: 0 2px 10px var(--shadow); }
  .eyebrow { font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: #647789; font-weight: 800; }
  .header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-top: 10px; }
  .header-row h1 { margin: 0; font-size: clamp(2rem, 3vw, 2.6rem); letter-spacing: -0.04em; }
  .status-badge { display: inline-flex; align-items: center; justify-content: center; border-radius: 999px; padding: 7px 10px; font-size: 0.75rem; font-weight: 800; border: 1px solid transparent; }
  .status-verified { background: #eefaf4; color: #2b7f5c; border-color: #d7f0e3; }
  .status-review { background: #fff7ea; color: #b77b28; border-color: #efdebb; }
  .status-flagged { background: #fff0f0; color: #d54e4e; border-color: #f0d0d0; }
  .meta-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
  .meta-box { background: var(--card-soft); border: 1px solid var(--border); border-radius: 12px; padding: 14px; }
  .meta-label { display: block; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: #627684; font-weight: 800; }
  .meta-value { display: block; margin-top: 8px; color: var(--title-color); font-size: 1.1rem; font-weight: 800; }
  .summary { margin-top: 22px; padding-top: 18px; border-top: 1px solid #ebf0f5; }
  .summary p { margin: 8px 0 0; line-height: 1.7; color: var(--body-color); }
  .project-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }
  .project-item { background: var(--card-soft); border: 1px solid var(--border); border-radius: 12px; padding: 14px; }
  .project-item strong { display: block; margin-bottom: 8px; color: var(--title-color); }
  .project-item small { display: block; color: var(--body-color); margin-bottom: 8px; }
  .project-item .meta-row { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
  .project-pill { display: inline-flex; border-radius: 999px; padding: 4px 8px; font-size: 0.68rem; font-weight: 700; border: 1px solid transparent; }
  .project-pill.ongoing { background: #fff7ea; color: #b77b28; border-color: #efdebb; }
  .project-pill.on-track { background: #eefaf4; color: #2b7f5c; border-color: #d7f0e3; }
  .project-pill.delayed { background: #fff0f0; color: #d54e4e; border-color: #f0d0d0; }
  .project-pill.under-review { background: #eef3ff; color: #486ea0; border-color: #d6e3fb; }
  .project-pill.completed { background: #edf7f0; color: #2b7f5c; border-color: #d8f0e3; }
  .project-pill.sanctioned { background: #f4f7fb; color: #3d5870; border-color: #dfe7f1; }
  .project-pill.in-progress { background: #fff7ea; color: #b77b28; border-color: #efdebb; }
  .project-link { display: inline-flex; align-items: center; justify-content: center; margin-top: 10px; padding: 8px 12px; border-radius: 10px; text-decoration: none; font-size: 0.74rem; font-weight: 800; color: #fff; background: linear-gradient(135deg, #123b5d, #2d6393); }
  .dark-theme .back-link,
  .dark-theme .project-link { color: #edf5ff; }
  @media (max-width: 760px) { .meta-grid, .project-list { grid-template-columns: 1fr; } .header-row { flex-direction: column; } }
`;

function ContractorDetails() {
  const { name } = useParams();
  const { theme } = useCitizenTheme();
  const contractor = contractorProfiles[decodeURIComponent(name)] || {
    name: 'Contractor overview',
    category: 'Public Works',
    activeProjects: 0,
    compliance: 'Pending review',
    score: 0,
    lastAudit: 'Not available',
    status: 'Review',
    address: 'Ludhiana, Punjab',
    contact: 'Department contact pending',
    regNo: 'N/A',
    summary: 'This contractor record is being reviewed in the citizen dashboard.',
    projects: [],
  };

  const badgeClass = contractor.status === 'Verified' ? 'status-verified' : contractor.status === 'Review' ? 'status-review' : 'status-flagged';

  const projectClass = (status) => {
    if (status === 'On Track' || status === 'Completed') return 'on-track';
    if (status === 'Delayed') return 'delayed';
    if (status === 'In Progress') return 'in-progress';
    if (status === 'Under Review') return 'under-review';
    if (status === 'Sanctioned') return 'sanctioned';
    return 'ongoing';
  };

  return (
    <div className={`contractor-detail-page ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <style>{styles}</style>
      <div className="contractor-detail-shell">
        <div className="contractor-topbar">
          <div className="brand">
            <img src="/trinetra-logo.jpg" alt="TRINETRA logo" />
            <div>
              <strong>TRINETRA</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CitizenThemeToggle />
            <Link to="/citizen/contractors" className="back-link">← Back to Contractors</Link>
          </div>
        </div>

        <section className="detail-card">
          <div className="eyebrow">Contractor profile</div>
          <div className="header-row">
            <div>
              <h1>{contractor.name}</h1>
            </div>
            <span className={`status-badge ${badgeClass}`}>{contractor.status}</span>
          </div>

          <div className="meta-grid">
            <div className="meta-box">
              <span className="meta-label">Category</span>
              <span className="meta-value">{contractor.category}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Active projects</span>
              <span className="meta-value">{contractor.activeProjects}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Compliance</span>
              <span className="meta-value">{contractor.compliance}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Audit score</span>
              <span className="meta-value">{contractor.score}/100</span>
            </div>
          </div>

          <div className="summary">
            <div className="eyebrow">Overview</div>
            <p>{contractor.summary}</p>
          </div>

          <div className="summary">
            <div className="eyebrow">Registration & contact</div>
            <div className="project-list">
              <div className="project-item">
                <strong>Registered office</strong>
                <small>{contractor.address}</small>
              </div>
              <div className="project-item">
                <strong>Key contact</strong>
                <small>{contractor.contact}</small>
              </div>
              <div className="project-item">
                <strong>Vendor ID</strong>
                <small>{contractor.regNo}</small>
              </div>
              <div className="project-item">
                <strong>Last audit</strong>
                <small>{contractor.lastAudit}</small>
              </div>
            </div>
          </div>

          <div className="summary">
            <div className="eyebrow">Projects under this contractor</div>
            <div className="project-list">
              {contractor.projects.map((project) => (
                <div className="project-item" key={project.id}>
                  <strong>{project.name}</strong>
                  <small>{project.id}</small>
                  <div className="meta-row">
                    <span className={`project-pill ${projectClass(project.status)}`}>{project.status}</span>
                    <span>{project.progress}</span>
                  </div>
                  <Link to={`/citizen/projects/${project.id}`} className="project-link">View Project</Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContractorDetails;
