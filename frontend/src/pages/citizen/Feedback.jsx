import { Link } from 'react-router-dom';
import CitizenThemeToggle from '../../components/common/CitizenThemeToggle';
import { useCitizenTheme } from '../../context/CitizenThemeContext';

const feedbackItems = [
  { type: 'Satisfaction', value: '4.7 / 5', note: 'Citizen response score' },
  { type: 'Likely to recommend', value: '91%', note: 'Public trust index' },
  { type: 'Average response time', value: '2.4 days', note: 'Issue resolution speed' },
];

const styles = `
  .feedback-page {
    --page-bg: #edf2f8;
    --card-bg: #ffffff;
    --soft-bg: #f8fafc;
    --title-color: #132437;
    --body-color: #566a7d;
    --border: #dde7f1;
    --shadow: rgba(17, 33, 54, 0.04);
    min-height: 100vh; background: var(--page-bg); font-family: "Inter", "Segoe UI", sans-serif; color: var(--title-color);
  }
  .feedback-page.dark-theme {
    --page-bg: #0a1220;
    --card-bg: #111f2f;
    --soft-bg: #15263a;
    --title-color: #edf4ff;
    --body-color: #dfeaf8;
    --border: rgba(162, 182, 210, 0.18);
    --shadow: rgba(2, 6, 12, 0.42);
    background: var(--page-bg); color: var(--title-color);
  }

  .feedback-page.dark-theme {
    color: var(--title-color);
  }

  .feedback-page.dark-theme .feedback-card,
  .feedback-page.dark-theme .stat-box,
  .feedback-page.dark-theme .field input,
  .feedback-page.dark-theme .field select,
  .feedback-page.dark-theme .field textarea,
  .feedback-page.dark-theme .secondary-btn,
  .feedback-page.dark-theme .primary-btn,
  .feedback-page.dark-theme .brand small,
  .feedback-page.dark-theme .nav-link {
    background: #131f2d !important;
    border-color: rgba(148, 167, 190, 0.22) !important;
    color: var(--title-color) !important;
  }

  .feedback-shell { max-width: 1100px; margin: 0 auto; padding: 28px 20px 40px; }
  .feedback-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand img { width: 34px; height: 34px; border-radius: 10px; object-fit: cover; }
  .brand strong { display: block; font-size: 1.5rem; letter-spacing: 0.04em; }
  .brand small { display: block; color: #6b7c90; font-size: 0.72rem; }
  .nav-link { text-decoration: none; color: #123b5d; font-weight: 700; }
  .citizen-theme-toggle { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border); background: var(--card-bg); color: #f5b942; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9rem; padding: 0; line-height: 1; }
  .feedback-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 18px; padding: 22px; box-shadow: 0 2px 10px var(--shadow); }
  .feedback-card h1 { margin: 0 0 10px; font-size: clamp(2rem, 3vw, 2.8rem); letter-spacing: -0.04em; }
  .feedback-card p { margin: 0; color: var(--body-color); }
  .stats-grid { margin-top: 18px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
  .stat-box { background: var(--soft-bg); border: 1px solid var(--border); border-radius: 12px; padding: 18px; }
  .stat-label { font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: #647789; font-weight: 800; }
  .stat-value { margin-top: 10px; font-size: 2rem; letter-spacing: -0.04em; font-weight: 800; color: #17212b; }
  .stat-note { margin-top: 6px; color: #5a6979; font-size: 0.78rem; }
  .feedback-form { margin-top: 22px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .field { display: flex; flex-direction: column; gap: 8px; }
  .field label { font-size: 0.76rem; letter-spacing: 0.08em; text-transform: uppercase; color: #647789; font-weight: 800; }
  .field input, .field select, .field textarea { width: 100%; box-sizing: border-box; border: 1px solid #dfe7f1; border-radius: 10px; padding: 10px 12px; background: #f8fafc; color: #1b2d42; font: inherit; }
  .field textarea { min-height: 120px; resize: vertical; }
  .actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 18px; }
  .secondary-btn, .primary-btn { border-radius: 10px; padding: 10px 14px; font-weight: 700; cursor: pointer; }
  .secondary-btn { background: #fff; border: 1px solid #dfe7f1; color: #1f2e3f; }
  .primary-btn { background: #123b5d; color: #fff; border: 1px solid #123b5d; }
  @media (max-width: 760px) { .stats-grid, .feedback-form { grid-template-columns: 1fr; } .feedback-header { flex-direction: column; align-items: flex-start; } }
`;

function Feedback() {
  const { theme } = useCitizenTheme();

  return (
    <div className={`feedback-page ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <style>{styles}</style>
      <div className="feedback-shell">
        <div className="feedback-header">
          <div className="brand">
            <img src="/trinetra-logo.jpg" alt="TRINETRA logo" />
            <div>
              <strong>TRINETRA</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CitizenThemeToggle />
            <Link to="/citizen" className="nav-link">← Back to dashboard</Link>
          </div>
        </div>

        <section className="feedback-card">
          <h1>Reports &amp; Feedback</h1>
          <p>Share public feedback, satisfaction ratings, and service improvement suggestions.</p>

          <div className="stats-grid">
            {feedbackItems.map((item) => (
              <div className="stat-box" key={item.type}>
                <div className="stat-label">{item.type}</div>
                <div className="stat-value">{item.value}</div>
                <div className="stat-note">{item.note}</div>
              </div>
            ))}
          </div>

          <form className="feedback-form">
            <div className="field">
              <label>Feedback type</label>
              <select defaultValue="Project experience">
                <option>Project experience</option>
                <option>Site quality</option>
                <option>Transparency</option>
                <option>Complaints</option>
              </select>
            </div>

            <div className="field">
              <label>Project / area</label>
              <input type="text" placeholder="Ward 12 / Rural Road Improvement" />
            </div>

            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Comment</label>
              <textarea placeholder="Describe your observations, suggestions, or concerns." />
            </div>
          </form>

          <div className="actions">
            <button type="button" className="secondary-btn">Save draft</button>
            <button type="submit" className="primary-btn">Submit feedback</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Feedback;
