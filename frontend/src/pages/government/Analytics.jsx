import { useEffect, useMemo, useState } from 'react';
import GovernmentLayout from '../../components/government/GovernmentLayout';
import StatusBadge from '../../components/government/StatusBadge';
import { LineBarChart, StackedBudget } from '../../components/government/charts';
import { getAnalytics } from '../../services/governmentService';

function Analytics() {
  const [filters, setFilters] = useState({
    from: '2026-04-01',
    to: '2026-09-10',
    region: 'All',
    department: 'All',
    type: 'All',
    status: 'All',
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getAnalytics(filters)
      .then((result) => {
        if (!alive) return;
        setData(result);
        setError('');
      })
      .catch(() => setError('Unable to load analytics.'))
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [filters]);

  const regionRows = useMemo(() => {
    if (!data) return [];
    if (filters.region === 'All') return data.regionalPerformance;
    return data.regionalPerformance.filter((row) => row.district === filters.region);
  }, [data, filters.region]);

  const deptRows = useMemo(() => {
    if (!data) return [];
    if (filters.department === 'All') return data.departmentPerformance;
    return data.departmentPerformance.filter((row) => row.department === filters.department);
  }, [data, filters.department]);

  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <GovernmentLayout>
      <section className="gov-page-head">
        <div>
          <h1>Analytics</h1>
          <p>Understand project performance, spending and regional trends.</p>
        </div>
      </section>

      <div className="gov-toolbar" aria-label="Analytics filters">
        <div className="gov-field">
          <label htmlFor="a-from">From</label>
          <input id="a-from" type="date" value={filters.from} onChange={(event) => update('from', event.target.value)} />
        </div>
        <div className="gov-field">
          <label htmlFor="a-to">To</label>
          <input id="a-to" type="date" value={filters.to} onChange={(event) => update('to', event.target.value)} />
        </div>
        <div className="gov-field">
          <label htmlFor="a-region">Region</label>
          <select id="a-region" value={filters.region} onChange={(event) => update('region', event.target.value)}>
            <option>All</option>
            {(data?.districts || []).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="gov-field">
          <label htmlFor="a-dept">Department</label>
          <select id="a-dept" value={filters.department} onChange={(event) => update('department', event.target.value)}>
            <option>All</option>
            {(data?.departmentPerformance || []).map((item) => (
              <option key={item.department}>{item.department}</option>
            ))}
          </select>
        </div>
        <div className="gov-field">
          <label htmlFor="a-type">Project type</label>
          <select id="a-type" value={filters.type} onChange={(event) => update('type', event.target.value)}>
            <option>All</option>
            {(data?.categories || []).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="gov-field">
          <label htmlFor="a-status">Status</label>
          <select id="a-status" value={filters.status} onChange={(event) => update('status', event.target.value)}>
            <option>All</option>
            {(data?.statuses || ['Ongoing', 'Completed', 'Sanctioned']).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? <div className="gov-loading">Loading analytics…</div> : null}
      {error ? <div className="gov-error">{error}</div> : null}

      {data ? (
        <>
          <section className="gov-kpi-strip" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
            {data.kpis.map((kpi) => (
              <article key={kpi.key} className="gov-kpi">
                <div className="gov-kpi-label">{kpi.label}</div>
                <strong>{kpi.value}</strong>
                <div className="gov-kpi-trend">{kpi.hint}</div>
              </article>
            ))}
          </section>

          <section className="gov-grid-2">
            <div className="gov-panel">
              <div className="gov-panel-head">
                <h2>Project performance</h2>
              </div>
              <div className="gov-panel-body">
                <div className="gov-chart-legend">
                  <span>
                    <i style={{ background: '#c5673a' }} />
                    Expected completion
                  </span>
                  <span>
                    <i style={{ background: '#123b5d' }} />
                    Actual completion
                  </span>
                </div>
                <LineBarChart series={data.performanceSeries} />
              </div>
            </div>

            <div className="gov-panel">
              <div className="gov-panel-head">
                <h2>Budget analysis</h2>
              </div>
              <div className="gov-panel-body">
                <StackedBudget data={data.budgetAnalysis} />
              </div>
            </div>
          </section>

          <section className="gov-panel">
            <div className="gov-panel-head">
              <h2>Regional performance</h2>
            </div>
            <div className="gov-table-wrap">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>District</th>
                    <th>Projects</th>
                    <th>Avg Progress</th>
                    <th>Avg Delay</th>
                    <th>Budget Utilization</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {regionRows.map((row) => (
                    <tr key={row.district}>
                      <td>{row.district}</td>
                      <td>{row.projects}</td>
                      <td>{row.avgProgress}%</td>
                      <td>{row.avgDelay} days</td>
                      <td>{row.utilization}%</td>
                      <td>
                        <StatusBadge value={row.risk} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="gov-panel">
            <div className="gov-panel-head">
              <h2>Department performance</h2>
            </div>
            <div className="gov-table-wrap">
              <table className="gov-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Projects</th>
                    <th>Completion</th>
                    <th>Delay</th>
                    <th>Budget utilization</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {deptRows.map((row) => (
                    <tr key={row.department}>
                      <td>{row.department}</td>
                      <td>{row.projects}</td>
                      <td>{row.completion}%</td>
                      <td>{row.delay} days</td>
                      <td>{row.utilization}%</td>
                      <td>
                        <StatusBadge value={row.risk} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="gov-panel-flat">
            <h2 className="gov-section-title">Trinetra Insights</h2>
            <div className="gov-insight">
              {data.insights.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </GovernmentLayout>
  );
}

export default Analytics;
