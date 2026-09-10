import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GovernmentLayout from '../../components/government/GovernmentLayout';
import StatusBadge from '../../components/government/StatusBadge';
import { DonutChart } from '../../components/government/charts';
import { getGovernmentOverview } from '../../services/governmentService';

function GovernmentDashboard() {
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, error: '', data: null });
  const [region, setRegion] = useState('All districts');
  const [asOn, setAsOn] = useState('2026-09-10');

  useEffect(() => {
    let active = true;
    getGovernmentOverview()
      .then((data) => {
        if (active) setState({ loading: false, error: '', data });
      })
      .catch(() => {
        if (active) setState({ loading: false, error: 'Unable to load government overview.', data: null });
      });
    return () => {
      active = false;
    };
  }, []);

  const data = state.data;
  const regions = data?.regionalMonitoring || [];
  const visibleRegions = region === 'All districts' ? regions : regions.filter((row) => row.district === region);

  return (
    <GovernmentLayout>
      <section className="gov-page-head">
        <div>
          <h1>Government Overview</h1>
          <p>Monitor project progress, financial performance, risks and field activity.</p>
        </div>
      </section>

      <div className="gov-filter-strip" aria-label="Date and region filters">
        <div className="gov-field">
          <label htmlFor="gov-as-on">As on</label>
          <input id="gov-as-on" type="date" value={asOn} onChange={(event) => setAsOn(event.target.value)} />
        </div>
        <div className="gov-field">
          <label htmlFor="gov-region">Region</label>
          <select id="gov-region" value={region} onChange={(event) => setRegion(event.target.value)}>
            <option>All districts</option>
            {regions.map((row) => (
              <option key={row.district}>{row.district}</option>
            ))}
          </select>
        </div>
      </div>

      {state.loading ? <div className="gov-loading">Loading command center…</div> : null}
      {state.error ? <div className="gov-error">{state.error}</div> : null}

      {data ? (
        <>
          <section className="gov-kpi-strip" aria-label="Portfolio indicators">
            {data.kpis.map((kpi) => (
              <article key={kpi.key} className={`gov-kpi ${kpi.tone}`}>
                <div className="gov-kpi-label">{kpi.label}</div>
                <strong>{kpi.value}</strong>
                <div className="gov-kpi-trend">
                  <span className="gov-status-dot" />
                  {kpi.trend}
                </div>
              </article>
            ))}
          </section>

          <section className="gov-grid-2">
            <div className="gov-panel">
              <div className="gov-panel-head">
                <h2>Project status overview</h2>
              </div>
              <div className="gov-panel-body gov-split">
                <DonutChart segments={data.statusOverview} />
                <ul className="gov-legend">
                  {data.statusOverview.map((item) => (
                    <li key={item.key}>
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
              <div className="gov-panel-head" style={{ paddingLeft: 0, border: 0 }}>
                <h2>Trinetra Intelligence</h2>
              </div>
              <div className="gov-insight">
                {data.intelligenceNotes.map((note) => (
                  <p key={note}>{note}</p>
                ))}
                <button type="button" className="gov-btn primary" onClick={() => navigate('/government/risk-monitor')}>
                  Open AI Risk Monitor
                </button>
              </div>
            </div>
          </section>

          <section className="gov-panel">
            <div className="gov-panel-head">
              <h2>Regional project monitoring</h2>
              <span>{visibleRegions.length} districts</span>
            </div>
            <div className="gov-table-wrap">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Projects</th>
                    <th>Ongoing</th>
                    <th>Delayed</th>
                    <th>At Risk</th>
                    <th>Budget</th>
                    <th>Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleRegions.map((row) => (
                    <tr key={row.district}>
                      <td>{row.district}</td>
                      <td>{row.projects}</td>
                      <td>{row.ongoing}</td>
                      <td>{row.delayed}</td>
                      <td>{row.atRisk}</td>
                      <td>{row.budget}</td>
                      <td>
                        <div className="gov-progress">
                          <span className="track">
                            <i style={{ width: `${row.completion}%` }} />
                          </span>
                          {row.completion}%
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="gov-grid-2">
            <div className="gov-panel">
              <div className="gov-panel-head">
                <h2>Recent project activity</h2>
              </div>
              <div className="gov-panel-body">
                <ul className="gov-activity">
                  {data.recentActivity.map((item) => (
                    <li key={item.id}>
                      <time>{item.timestamp}</time>
                      <div>
                        <strong>{item.activity}</strong>
                        <div style={{ color: '#72839a', marginTop: 2 }}>{item.project}</div>
                      </div>
                      <StatusBadge value={item.status} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="gov-panel">
              <div className="gov-panel-head">
                <h2>Attention required</h2>
              </div>
              <div className="gov-panel-body">
                <div className="gov-alert-list">
                  {data.attentionItems.map((item) => (
                    <article key={item.id} className="gov-alert">
                      <StatusBadge value={item.severity} />
                      <div>
                        <strong>{item.reason}</strong>
                        <div style={{ color: '#72839a', marginTop: 4, fontSize: '0.78rem' }}>
                          {item.project} · {item.action}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="gov-btn"
                        onClick={() =>
                          navigate(
                            item.action.includes('investigation')
                              ? '/government/investigations'
                              : `/government/projects?id=${item.projectId}`,
                          )
                        }
                      >
                        Review
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </GovernmentLayout>
  );
}

export default GovernmentDashboard;
