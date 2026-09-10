import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CitizenThemeToggle from '../../components/common/CitizenThemeToggle';
import { useCitizenTheme } from '../../context/CitizenThemeContext';

const MAX_PROOF_SIZE = 100 * 1024;

const styles = `
  .report-page {
    --page-bg: #edf2f8;
    --card-bg: #ffffff;
    --soft-bg: #f9fbfd;
    --title-color: #14253b;
    --body-color: #566a7d;
    --border: #dde7f1;
    --shadow: rgba(17, 33, 54, 0.04);
    min-height: 100vh; background: var(--page-bg); font-family: "Inter", "Segoe UI", sans-serif; color: var(--title-color);
  }
  .report-page.dark-theme {
    --page-bg: #0a1220;
    --card-bg: #111f2f;
    --soft-bg: #15263a;
    --title-color: #edf4ff;
    --body-color: #dfeaf8;
    --border: rgba(162, 182, 210, 0.18);
    --shadow: rgba(2, 6, 12, 0.42);
    background: var(--page-bg); color: var(--title-color);
  }

  .report-page.dark-theme {
    color: var(--title-color);
  }

  .report-page.dark-theme .report-card,
  .report-page.dark-theme .proof-box,
  .report-page.dark-theme .field input,
  .report-page.dark-theme .field select,
  .report-page.dark-theme .field textarea,
  .report-page.dark-theme .secondary-btn,
  .report-page.dark-theme .primary-btn,
  .report-page.dark-theme .upload-btn.secondary,
  .report-page.dark-theme .brand small,
  .report-page.dark-theme .nav-link {
    background: #131f2d !important;
    border-color: rgba(148, 167, 190, 0.22) !important;
    color: var(--title-color) !important;
  }

  .report-shell { max-width: 980px; margin: 0 auto; padding: 28px 20px 40px; }
  .report-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand img { width: 34px; height: 34px; border-radius: 10px; object-fit: cover; }
  .brand strong { display: block; font-size: 1.5rem; letter-spacing: 0.04em; }
  .brand small { display: block; color: #6b7c90; font-size: 0.72rem; }
  .report-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 18px; padding: 22px; box-shadow: 0 2px 10px var(--shadow); }
  .report-card h1 { margin: 0 0 12px; font-size: clamp(2rem, 3vw, 2.7rem); letter-spacing: -0.05em; }
  .report-card p { color: var(--body-color); margin: 0 0 18px; }
  .report-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
  .field { display: flex; flex-direction: column; gap: 8px; }
  .field label { font-size: 0.76rem; letter-spacing: 0.08em; text-transform: uppercase; color: #647789; font-weight: 800; }
  .field input, .field select, .field textarea { width: 100%; box-sizing: border-box; border: 1px solid #dfe7f1; border-radius: 10px; padding: 10px 12px; background: #f8fafc; color: #1b2d42; font: inherit; }
  .field textarea { min-height: 120px; resize: vertical; }
  .proof-box { margin-top: 18px; padding: 16px; border: 1px solid var(--border); border-radius: 12px; background: var(--soft-bg); }
  .proof-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
  .proof-header strong { font-size: 0.76rem; letter-spacing: 0.08em; text-transform: uppercase; color: #647789; }
  .proof-header span { color: #5b6d7d; font-size: 0.76rem; }
  .proof-actions { display: flex; gap: 12px; flex-wrap: wrap; }
  .upload-btn { position: relative; display: inline-flex; align-items: center; justify-content: center; padding: 10px 14px; border-radius: 10px; border: 1px solid #123b5d; background: #123b5d; color: #fff; font-weight: 700; cursor: pointer; overflow: hidden; }
  .upload-btn.secondary { background: #fff; border-color: #dfe7f1; color: #1f2e3f; }
  .upload-btn input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  .proof-file, .proof-hint, .proof-error { margin-top: 10px; font-size: 0.8rem; }
  .proof-file { color: #1d3651; font-weight: 700; }
  .proof-hint { color: #5b6d7d; }
  .proof-error { color: #bf3a3a; font-weight: 700; }
  .actions { display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 18px; }
  .secondary-btn, .primary-btn { border-radius: 10px; padding: 10px 14px; font-weight: 700; cursor: pointer; }
  .secondary-btn { background: #fff; border: 1px solid #dfe7f1; color: #1f2e3f; }
  .primary-btn { background: #123b5d; color: #fff; border: 1px solid #123b5d; }
  .nav-link { text-decoration: none; color: #123b5d; font-weight: 700; }
  .citizen-theme-toggle { width: 30px; height: 30px; border-radius: 50%; border: 1px solid var(--border); background: var(--card-bg); color: #f5b942; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-size: 0.9rem; padding: 0; line-height: 1; }
  @media (max-width: 700px) { .report-grid { grid-template-columns: 1fr; } .report-header { flex-direction: column; align-items: flex-start; } }
`;

function ReportIssue() {
  const [searchParams] = useSearchParams();
  const [proof, setProof] = useState(null);
  const [proofError, setProofError] = useState('');
  const { theme } = useCitizenTheme();
  const projectName = searchParams.get('project') || '';
  const projectId = searchParams.get('projectId') || '';

  const handleProofChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setProof(null);
      setProofError('');
      return;
    }

    if (file.size > MAX_PROOF_SIZE) {
      setProof(null);
      setProofError('The selected file exceeds the 100 KB size limit. Please upload a smaller proof image or document.');
      event.target.value = '';
      return;
    }

    setProof(file);
    setProofError('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!proof) {
      setProofError('Please upload proof before submitting your report.');
      return;
    }

    if (proof.size > MAX_PROOF_SIZE) {
      setProofError('The selected file exceeds the 100 KB size limit. Please upload a smaller proof image or document.');
      return;
    }

    alert('Report submitted successfully.');
  };

  return (
    <div className={`report-page ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <style>{styles}</style>
      <div className="report-shell">
        <div className="report-header">
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

        <section className="report-card">
          <h1>Report an Issue</h1>
          <p>
            {projectName ? `Submitting a complaint for ${projectName}.` : 'Submit civic issues with location details, urgency, and photo evidence for review.'}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="report-grid">
              <div className="field">
                <label>Issue title</label>
                <input type="text" defaultValue={projectName ? `Issue in ${projectName}` : ''} placeholder="e.g. Water pipeline leakage" required />
              </div>

              <div className="field">
                <label>Area / Ward</label>
                <input type="text" defaultValue={projectId ? `Project ID: ${projectId}` : ''} placeholder="Ward 12, Ludhiana" required />
              </div>

              <div className="field">
                <label>Category</label>
                <select defaultValue="Water & Sanitation">
                  <option>Water &amp; Sanitation</option>
                  <option>Roads &amp; Connectivity</option>
                  <option>Street Lighting</option>
                  <option>Waste Management</option>
                </select>
              </div>

              <div className="field">
                <label>Urgency</label>
                <select defaultValue="Medium">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>

              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Location / landmark</label>
                <input type="text" placeholder="Near bus stand, market road, school gate" required />
              </div>

              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <label>Description</label>
                <textarea placeholder="Describe the issue, visible damage, impact on citizens, and time observed." required />
              </div>
            </div>

            <div className="proof-box">
              <div className="proof-header">
                <strong>Proof upload</strong>
                <span>Max file size: 100 KB</span>
              </div>

              <div className="proof-actions">
                <label className="upload-btn">
                  <input type="file" accept="image/*,.pdf" capture="environment" onChange={handleProofChange} />
                  📷 Take Photo
                </label>

                <label className="upload-btn secondary">
                  <input type="file" accept="image/*,.pdf" onChange={handleProofChange} />
                  📁 Upload File
                </label>
              </div>

              {proof ? (
                <div className="proof-file">
                  {proof.name} ({(proof.size / 1024).toFixed(1)} KB)
                </div>
              ) : (
                <div className="proof-hint">Attach a photo or document as proof of the issue.</div>
              )}

              {proofError && <div className="proof-error">{proofError}</div>}
            </div>

            <div className="actions">
              <button type="button" className="secondary-btn">Save Draft</button>
              <button type="submit" className="primary-btn">Submit report</button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

export default ReportIssue;
