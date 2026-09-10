import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GovernmentLayout from '../../components/government/GovernmentLayout';
import StatusBadge from '../../components/government/StatusBadge';
import Icon from '../../components/government/Icon';
import { districts as fallbackDistricts, projectStatuses as fallbackStatuses, projectTypes as fallbackTypes, riskLevels } from '../../data/government/governmentProjects';
import { getGovernmentProjects, getProjectById } from '../../services/governmentService';
import { projectService } from '../../services/projectService';

const PAGE_SIZE = 8;

function sortRows(rows, key, direction) {
  const copy = [...rows];
  copy.sort((a, b) => {
    const left = a[key];
    const right = b[key];
    if (typeof left === 'number' && typeof right === 'number') {
      return direction === 'asc' ? left - right : right - left;
    }
    return direction === 'asc'
      ? String(left).localeCompare(String(right))
      : String(right).localeCompare(String(left));
  });
  return copy;
}

function GovernmentProjects() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('id');

  const [filters, setFilters] = useState({
    search: '',
    district: 'All',
    type: 'All',
    status: 'All',
    risk: 'All',
    from: '',
    to: '',
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState({ key: 'id', direction: 'asc' });
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState('');
  const [metadata, setMetadata] = useState({ districts: fallbackDistricts, categories: fallbackTypes, statuses: fallbackStatuses });

  useEffect(() => {
    projectService.getMetadata().then(setMetadata).catch(() => {});
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getGovernmentProjects(filters)
      .then((result) => {
        if (!active) return;
        setRows(result.items);
        setError('');
        setPage(1);
      })
      .catch(() => {
        if (active) setError('Unable to load projects.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters]);

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

  const sorted = useMemo(() => sortRows(rows, sort.key, sort.direction), [rows, sort]);
  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const visible = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      district: 'All',
      type: 'All',
      status: 'All',
      risk: 'All',
      from: '',
      to: '',
    });
  };

  const toggleSort = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const openProject = (id) => {
    setParams({ id });
  };

  const closeDetail = () => {
    setParams({});
  };

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  return (
    <GovernmentLayout>
      <section className="gov-page-head">
        <div>
          <h1>Projects</h1>
          <p>Monitor ongoing government infrastructure projects across regions.</p>
        </div>
      </section>

      <div className="gov-toolbar" aria-label="Project filters">
        <div className="gov-search">
          <Icon name="search" />
          <input
            type="search"
            placeholder="Search project"
            value={filters.search}
            onChange={(event) => updateFilter('search', event.target.value)}
            aria-label="Search project"
          />
        </div>
        <div className="gov-field">
          <label htmlFor="dist">District</label>
          <select id="dist" value={filters.district} onChange={(event) => updateFilter('district', event.target.value)}>
            <option>All</option>
            {(metadata.districts || fallbackDistricts).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="gov-field">
          <label htmlFor="ptype">Project type</label>
          <select id="ptype" value={filters.type} onChange={(event) => updateFilter('type', event.target.value)}>
            <option>All</option>
            {(metadata.categories || fallbackTypes).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="gov-field">
          <label htmlFor="pstatus">Status</label>
          <select id="pstatus" value={filters.status} onChange={(event) => updateFilter('status', event.target.value)}>
            <option>All</option>
            {(metadata.statuses || fallbackStatuses).map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="gov-field">
          <label htmlFor="prisk">Risk level</label>
          <select id="prisk" value={filters.risk} onChange={(event) => updateFilter('risk', event.target.value)}>
            <option>All</option>
            {riskLevels.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className="gov-field">
          <label htmlFor="from">From</label>
          <input id="from" type="date" value={filters.from} onChange={(event) => updateFilter('from', event.target.value)} />
        </div>
        <div className="gov-field">
          <label htmlFor="to">To</label>
          <input id="to" type="date" value={filters.to} onChange={(event) => updateFilter('to', event.target.value)} />
        </div>
        <button type="button" className="gov-btn" onClick={resetFilters} style={{ marginTop: 18 }}>
          Reset
        </button>
      </div>

      {loading ? <div className="gov-loading">Loading projects…</div> : null}
      {error ? <div className="gov-error">{error}</div> : null}

      {!loading && !sorted.length ? <div className="gov-empty">No projects match the selected filters.</div> : null}

      {sorted.length ? (
        <section className="gov-panel">
          <div className="gov-table-wrap">
            <table className="gov-table">
              <thead>
                <tr>
                  {[
                    ['id', 'Project ID'],
                    ['name', 'Project Name'],
                    ['location', 'Location'],
                    ['department', 'Department'],
                    ['contractor', 'Contractor'],
                    ['budgetLabel', 'Budget'],
                    ['progress', 'Progress'],
                    ['status', 'Status'],
                    ['risk', 'Risk'],
                    ['lastUpdate', 'Last Update'],
                  ].map(([key, label]) => (
                    <th key={key} className="sortable" onClick={() => toggleSort(key)}>
                      {label}
                    </th>
                  ))}
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((project) => (
                  <tr key={project.id} className={selectedId === project.id ? 'is-selected' : ''}>
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                    <td>{project.location}</td>
                    <td>{project.department}</td>
                    <td>{project.contractor}</td>
                    <td>{project.budgetLabel}</td>
                    <td>
                      <div className="gov-progress">
                        <span className="track">
                          <i style={{ width: `${project.progress}%` }} />
                        </span>
                        {project.progress}%
                      </div>
                    </td>
                    <td>
                      <StatusBadge value={project.status} />
                    </td>
                    <td>
                      <StatusBadge value={project.risk} />
                    </td>
                    <td>{project.lastUpdate}</td>
                    <td>
                      <button type="button" className="gov-btn" onClick={() => openProject(project.id)}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="gov-pager">
            <span>
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length}
            </span>
            <div>
              <button type="button" className="gov-btn ghost" disabled={page === 1} onClick={() => setPage((value) => value - 1)}>
                Previous
              </button>
              <button
                type="button"
                className="gov-btn ghost"
                disabled={page === pageCount}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {selectedId && detail ? (
        <>
          <div className="gov-drawer-backdrop" onClick={closeDetail} />
          <aside className="gov-drawer" role="dialog" aria-label="Project details">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <h2>{detail.name}</h2>
                <p style={{ margin: 0, color: '#72839a', fontSize: '0.82rem' }}>{detail.id} · {detail.authority}</p>
              </div>
              <button type="button" className="gov-btn ghost" onClick={closeDetail} aria-label="Close details">
                Close
              </button>
            </div>

            <h3 className="gov-section-title">Project overview</h3>
            <div className="gov-meta-grid">
              <div><span>Project ID</span><strong>{detail.id}</strong></div>
              <div><span>Department</span><strong>{detail.department}</strong></div>
              <div><span>Location</span><strong>{detail.location}</strong></div>
              <div><span>Contractor</span><strong>{detail.contractor}</strong></div>
              <div><span>Start date</span><strong>{detail.startDate}</strong></div>
              <div><span>Expected completion</span><strong>{detail.expectedCompletion}</strong></div>
              <div><span>Budget</span><strong>{detail.budgetLabel}</strong></div>
              <div><span>Amount spent</span><strong>₹{detail.spentCr} Cr</strong></div>
              <div><span>Physical progress</span><strong>{detail.progress}%</strong></div>
              <div><span>Status / Risk</span><strong>{detail.status} · {detail.risk}</strong></div>
            </div>

            <h3 className="gov-section-title">Progress timeline</h3>
            <ul className="gov-steps">
              {detail.timeline.map((step) => (
                <li key={step.label} className={`${step.done ? 'done' : ''} ${step.current ? 'current' : ''}`}>
                  <strong>{step.label}</strong>
                  <div>{step.date}</div>
                </li>
              ))}
            </ul>

            <h3 className="gov-section-title">Financial section</h3>
            <div className="gov-finance">
              <div><span>Allocated</span><strong>₹{detail.allocatedCr} Cr</strong></div>
              <div><span>Released</span><strong>₹{detail.releasedCr} Cr</strong></div>
              <div><span>Spent</span><strong>₹{detail.spentCr} Cr</strong></div>
              <div><span>Remaining</span><strong>₹{detail.remainingCr} Cr</strong></div>
            </div>

            <h3 className="gov-section-title">Contractor updates</h3>
            <ul className="gov-list-plain">
              {detail.contractorUpdates.map((update) => (
                <li key={`${update.week}-${update.date}`}>
                  <strong>{update.week}</strong> · {update.date} · {update.status}
                  <div>{update.note}</div>
                </li>
              ))}
            </ul>

            <h3 className="gov-section-title">Citizen feedback</h3>
            {detail.citizenFeedback.length ? (
              <ul className="gov-list-plain">
                {detail.citizenFeedback.map((item) => (
                  <li key={item.id}>
                    <strong>{item.id}</strong> · {item.date} · {item.status}
                    <div>{item.summary}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="gov-empty" style={{ padding: 8 }}>No recent complaints or reviews on file.</p>
            )}

            <h3 className="gov-section-title">AI risk summary</h3>
            <p style={{ margin: '0 0 8px', fontSize: '0.86rem' }}>
              Current risk {detail.aiRisk.score} / 100 · Last AI scan {detail.aiRisk.lastScan}
            </p>
            <p style={{ margin: 0, color: '#53677f', fontSize: '0.82rem' }}>{detail.aiRisk.explanation}</p>

            <div className="gov-action-row">
              <button
                type="button"
                className="gov-btn primary"
                onClick={() => navigate(`/government/investigations?project=${detail.id}`)}
              >
                Start Investigation
              </button>
              <button type="button" className="gov-btn" onClick={() => showToast('Update requested from contractor (demo).')}>
                Request Update
              </button>
              <button type="button" className="gov-btn" onClick={() => navigate('/government/analytics')}>
                View Analytics
              </button>
            </div>
          </aside>
        </>
      ) : null}

      {toast ? <div className="gov-toast" role="status">{toast}</div> : null}
    </GovernmentLayout>
  );
}

export default GovernmentProjects;
