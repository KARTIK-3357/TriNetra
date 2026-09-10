import { Link, useNavigate, useParams } from 'react-router-dom';
import CitizenThemeToggle from '../../components/common/CitizenThemeToggle';
import { useCitizenTheme } from '../../context/CitizenThemeContext';

const projectDetails = {
  'MPLADS-2025-0142': {
    title: 'Rural Road Improvement',
    id: 'MPLADS-2025-0142',
    location: 'Ward 12, Ludhiana',
    contractor: 'ABC Infrastructure Pvt. Ltd.',
    budget: '₹42.5 Lakh',
    progress: '48%',
    status: 'Delayed',
    summary: 'Road resurfacing and drainage strengthening across the ward with safety barriers and culvert restoration.',
    timeline: [
      ['Apr 2025', 'Tender finalised and site mobilisation complete'],
      ['May 2025', 'Subgrade work completed for 68% of corridor'],
      ['Jun 2025', 'Traffic diversion and surface repair underway'],
    ],
  },
};

const styles = `
  .project-detail-page {
    --page-bg: #edf2f8;
    --card-bg: #ffffff;
    --card-soft: #f8fafc;
    --title-color: #132437;
    --body-color: #566a7d;
    --border: #dde7f1;
    --shadow: rgba(17, 33, 54, 0.04);
    min-height: 100vh; background: var(--page-bg); font-family: "Inter", "Segoe UI", sans-serif; color: var(--title-color);
  }
  .project-detail-page.dark-theme {
    --page-bg: #0a1220;
    --card-bg: #111f2f;
    --card-soft: #15263a;
    --title-color: #edf4ff;
    --body-color: #dfeaf8;
    --border: rgba(162, 182, 210, 0.18);
    --shadow: rgba(2, 6, 12, 0.42);
    background: var(--page-bg); color: var(--title-color);
  }

  .project-detail-page.dark-theme {
    color: var(--title-color);
  }

  .project-detail-page.dark-theme .project-card,
  .project-detail-page.dark-theme .meta-box,
  .project-detail-page.dark-theme .timeline-item,
  .project-detail-page.dark-theme .brand small,
  .project-detail-page.dark-theme .back-link,
  .project-detail-page.dark-theme .report-project-btn {
    background: #131f2d !important;
    border-color: rgba(148, 167, 190, 0.22) !important;
    color: var(--title-color) !important;
  }

  .project-detail-page.dark-theme .project-header h1,
  .project-detail-page.dark-theme .meta-value,
  .project-detail-page.dark-theme .summary p,
  .project-detail-page.dark-theme .timeline-item strong,
  .project-detail-page.dark-theme .timeline-item span,
  .project-detail-page.dark-theme .brand strong {
    color: var(--title-color) !important;
  }

  .project-detail-shell { max-width: 1180px; margin: 0 auto; padding: 28px 20px 40px; }
  .project-topbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 20px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand img { width: 36px; height: 36px; border-radius: 10px; object-fit: cover; }
  .brand strong { font-size: 1.5rem; letter-spacing: 0.04em; }
  .brand small { display: block; color: #64809c; font-size: 0.72rem; }
  .back-link { text-decoration: none; color: #123b5d; font-weight: 700; }
  .citizen-theme-toggle { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border); background: var(--card-bg); color: #f5b942; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9rem; padding: 0; line-height: 1; }
  .project-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 18px; padding: 22px; box-shadow: 0 2px 10px var(--shadow); }
  .eyebrow { font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: #647789; font-weight: 800; }
  .project-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-top: 8px; }
  .project-header h1 { margin: 0; font-size: clamp(2rem, 3vw, 2.8rem); letter-spacing: -0.04em; color: #17212b; }
  .status-chip { display: inline-flex; padding: 7px 10px; border-radius: 999px; font-size: 0.76rem; font-weight: 800; background: #fff0f0; color: #d54e4e; border: 1px solid #f0d0d0; }
  .meta-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 20px; }
  .meta-box { background: var(--card-soft); border: 1px solid var(--border); border-radius: 12px; padding: 14px; }
  .meta-label { display: block; color: #627684; font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 800; }
  .meta-value { display: block; margin-top: 8px; color: #17212b; font-size: 1.15rem; font-weight: 800; }
  .summary { margin-top: 22px; padding-top: 18px; border-top: 1px solid #ebf0f5; }
  .summary p { margin: 8px 0 0; color: var(--body-color); line-height: 1.7; }
  .timeline { margin-top: 22px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .timeline-item { background: var(--card-soft); border: 1px solid var(--border); border-radius: 12px; padding: 14px; }
  .timeline-item strong { display: block; color: #17212b; margin-bottom: 8px; }
  .timeline-item span { font-size: 0.76rem; color: #52677d; line-height: 1.6; }
  .report-project-btn {
    margin-top: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 16px;
    border-radius: 10px;
    border: 1px solid #123b5d;
    background: linear-gradient(135deg, #123b5d 0%, #295a87 100%);
    color: #fff;
    font-size: 0.82rem;
    font-weight: 800;
    text-decoration: none;
    cursor: pointer;
  }
  @media (max-width: 760px) { .meta-grid, .timeline { grid-template-columns: 1fr; } .project-header { flex-direction: column; } }
`;

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useCitizenTheme();
  const project = projectDetails[id] || {
    title: 'Project Details',
    id,
    location: 'Ludhiana, Punjab',
    contractor: 'Government contractor',
    budget: '₹0',
    progress: '0%',
    status: 'Review',
    summary: 'This project record is available for review in the TRINETRA citizen dashboard.',
    timeline: [['Latest update', 'The current project information is pending backend sync.']],
  };

  return (
    <div className={`project-detail-page ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <style>{styles}</style>
      <div className="project-detail-shell">
        <div className="project-topbar">
          <div className="brand">
            <img src="/trinetra-logo.jpg" alt="TRINETRA logo" />
            <div>
              <strong>TRINETRA</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CitizenThemeToggle />
            <Link to="/citizen/projects" className="back-link">← Back to Projects</Link>
          </div>
        </div>

        <section className="project-card">
          <div className="eyebrow">Project overview</div>
          <div className="project-header">
            <div>
              <h1>{project.title}</h1>
            </div>
            <span className="status-chip">{project.status}</span>
          </div>

          <div className="meta-grid">
            <div className="meta-box">
              <span className="meta-label">Project ID</span>
              <span className="meta-value">{project.id}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Location</span>
              <span className="meta-value">{project.location}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Budget</span>
              <span className="meta-value">{project.budget}</span>
            </div>
            <div className="meta-box">
              <span className="meta-label">Progress</span>
              <span className="meta-value">{project.progress}</span>
            </div>
          </div>

          <div className="summary">
            <div className="eyebrow">Summary</div>
            <p>{project.summary}</p>
          </div>

          <div className="summary">
            <div className="eyebrow">Contractor</div>
            <p>{project.contractor}</p>
          </div>

          <div className="summary">
            <div className="eyebrow">Milestone timeline</div>
            <div className="timeline">
              {project.timeline.map(([phase, note]) => (
                <div className="timeline-item" key={`${phase}-${note}`}>
                  <strong>{phase}</strong>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            className="report-project-btn"
            onClick={() => navigate(`/citizen/report?project=${encodeURIComponent(project.title)}&projectId=${encodeURIComponent(project.id)}`)}
          >
            Report issue for this project
          </button>
        </section>
      </div>
    </div>
  );
}

export default ProjectDetails;
