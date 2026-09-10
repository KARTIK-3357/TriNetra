import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GovernmentLayout from '../../components/government/GovernmentLayout';
import StatusBadge from '../../components/government/StatusBadge';
import { DonutChart, HorizontalBars } from '../../components/government/charts';
import { getProjectById, getRiskProjects, runRiskScan } from '../../services/governmentService';

function AIRiskMonitor() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('id');

  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const load = () => {
    setLoading(true);
    getRiskProjects()
      .then((result) => {
        setSummary(result.summary);
        setItems(result.items);
        setError('');
      })
      .catch(() => setError('Unable to load risk monitor.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return undefined;
    }
    let active = true;
    getProjectById(selectedId).then((project) => {
      if (active) setDetail(project);
    });
    return () => {
      active = false;
    };
  }, [selectedId]);

  const segments = useMemo(() => {
    if (!summary) return [];
    return [
      { label: 'High', value: summary.high, color: '#b42318' },
      { label: 'Medium', value: summary.medium, color: '#c5673a' },
      { label: 'Low', value: summary.low, color: '#0d7d52' },
    ];
  }, [summary]);

  const handleScan = async () => {
    setScanning(true);
    setMessage('');
    try {
      const result = await runRiskScan();
      setSummary(result.summary);
      setItems(result.items);
      setMessage(result.message);
    } catch (err) {
      setError('Risk scan could not be completed.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <GovernmentLayout>
      <section className="gov-page-head">
        <div>
          <h1>AI Risk Monitor</h1>
          <p>Identify projects requiring administrative attention using project, financial and progress indicators.</p>
        </div>
        <button type="button" className="gov-btn primary" onClick={handleScan} disabled={scanning}>
          Run New Scan
        </button>
      </section>

      {loading ? <div className="gov-loading">Loading risk indicators…</div> : null}
      {error ? <div className="gov-error">{error}</div> : null}
      {message ? <div className="gov-insight"><p>{message}</p></div> : null}

      {summary ? (
        <section className="gov-kpi-strip" aria-label="Scan summary">
          <article className="gov-kpi"><div className="gov-kpi-label">Projects Scanned</div><strong>{summary.scanned}</strong><div className="gov-kpi-trend">Portfolio coverage</div></article>
          <article className="gov-kpi danger"><div className="gov-kpi-label">High Risk</div><strong>{summary.high}</strong><div className="gov-kpi-trend"><span className="gov-status-dot" />Administrative review</div></article>
          <article className="gov-kpi warn"><div className="gov-kpi-label">Medium Risk</div><strong>{summary.medium}</strong><div className="gov-kpi-trend"><span className="gov-status-dot" />Watch list</div></article>
          <article className="gov-kpi good"><div className="gov-kpi-label">Low Risk</div><strong>{summary.low}</strong><div className="gov-kpi-trend"><span className="gov-status-dot" />Routine monitoring</div></article>
          <article className="gov-kpi info" style={{ gridColumn: 'span 2' }}>
            <div className="gov-kpi-label">Last Scan</div>
            <strong style={{ fontSize: '1.05rem' }}>{summary.lastScan}</strong>
            <div className="gov-kpi-trend">Engine: progress · finance · complaints</div>
          </article>
        </section>
      ) : null}

      <section className="gov-relative gov-grid-2">
        {scanning ? (
          <div className="gov-scan-overlay">
            <div className="gov-scan-box">
              <div className="gov-spinner" />
              <strong>Running risk scan</strong>
              <p style={{ margin: '8px 0 0', color: '#53677f', fontSize: '0.82rem' }}>
                Recalculating schedule variance, budget utilization and complaint signals.
              </p>
            </div>
          </div>
        ) : null}

        <div className="gov-panel">
          <div className="gov-panel-head">
            <h2>Risk distribution</h2>
          </div>
          <div className="gov-panel-body gov-split">
            <DonutChart segments={segments} />
            <ul className="gov-legend">
              {segments.map((item) => (
                <li key={item.label}>
                  <span>
                    <i style={{ background: item.color }} />
                    {item.label}
                  </span>
                  <strong>{item.value}</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="gov-panel-flat">
          <h2 className="gov-section-title" style={{ marginTop: 12 }}>Scan control</h2>
          <p style={{ color: '#53677f', fontSize: '0.86rem' }}>
            Analysis is triggered by an officer action. This is not a chatbot. Results remain in the project workflow
            for administrative review.
          </p>
          <button type="button" className="gov-btn" onClick={handleScan} disabled={scanning}>
            Analyze Selected Projects
          </button>
        </div>
      </section>

      <section className="gov-panel">
        <div className="gov-panel-head">
          <h2>Risk project table</h2>
        </div>
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Location</th>
                <th>Progress</th>
                <th>Schedule Variance</th>
                <th>Budget Variance</th>
                <th>Citizen Complaints</th>
                <th>Risk Score</th>
                <th>Risk Level</th>
                <th>Last Scan</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id} className={selectedId === row.id ? 'is-selected' : ''}>
                  <td>{row.project}</td>
                  <td>{row.location}</td>
                  <td>{row.progress}%</td>
                  <td>{row.scheduleVariance}</td>
                  <td>{row.budgetVariance}</td>
                  <td>{row.complaints}</td>
                  <td>{row.score}</td>
                  <td>
                    <StatusBadge value={row.level} kind={row.level.toLowerCase()} />
                  </td>
                  <td>{row.lastScan}</td>
                  <td>
                    <button type="button" className="gov-btn" onClick={() => setParams({ id: row.id })}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {detail ? (
        <section className="gov-grid-2">
          <div className="gov-panel">
            <div className="gov-panel-head">
              <h2>Risk factors · {detail.name}</h2>
              <span>Score {detail.aiRisk.score} / 100</span>
            </div>
            <div className="gov-panel-body">
              <HorizontalBars items={detail.aiRisk.factors} max={24} />
            </div>
          </div>
          <div className="gov-panel">
            <div className="gov-panel-head">
              <h2>AI explanation</h2>
            </div>
            <div className="gov-panel-body">
              <p style={{ marginTop: 0, lineHeight: 1.55 }}>{detail.aiRisk.explanation}</p>
              <p style={{ color: '#72839a', fontSize: '0.8rem' }}>Last AI scan {detail.aiRisk.lastScan}</p>
              <div className="gov-action-row">
                <button
                  type="button"
                  className="gov-btn primary"
                  onClick={() => navigate(`/government/investigations?project=${detail.id}`)}
                >
                  Investigate Project
                </button>
                <button type="button" className="gov-btn" onClick={() => navigate(`/government/projects?id=${detail.id}`)}>
                  View Project
                </button>
                <button type="button" className="gov-btn" onClick={() => navigate('/government/analytics')}>
                  View Analytics
                </button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="gov-empty">Select a project to inspect contributing risk factors.</div>
      )}
    </GovernmentLayout>
  );
}

export default AIRiskMonitor;
