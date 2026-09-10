import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import GovernmentLayout from '../../components/government/GovernmentLayout';
import StatusBadge from '../../components/government/StatusBadge';
import ConfirmDialog from '../../components/government/ConfirmDialog';
import { getInvestigationById, getInvestigations, getProjectById } from '../../services/governmentService';

const actionCatalog = {
  clarify: {
    title: 'Request contractor clarification',
    message: 'A clarification request will be recorded against this investigation and notified to the contractor (demo).',
    confirmLabel: 'Send request',
    success: 'Clarification requested.',
  },
  inspect: {
    title: 'Schedule inspection',
    message: 'A field inspection slot will be proposed to the district works cell (demo).',
    confirmLabel: 'Schedule',
    success: 'Inspection scheduled.',
  },
  review: {
    title: 'Mark under review',
    message: 'The investigation status will be set to Under Review.',
    confirmLabel: 'Mark under review',
    success: 'Marked under review.',
  },
  escalate: {
    title: 'Escalate investigation',
    message: 'This file will be escalated to the departmental review board (demo).',
    confirmLabel: 'Escalate',
    tone: 'danger',
    success: 'Investigation escalated.',
  },
  close: {
    title: 'Close investigation',
    message: 'Closing will archive this file. This is a demonstration action only.',
    confirmLabel: 'Close investigation',
    tone: 'danger',
    success: 'Investigation closed.',
  },
};

function Investigation() {
  const [params, setParams] = useSearchParams();
  const selectedId = params.get('id');
  const projectHint = params.get('project');

  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState('');
  const [localStatus, setLocalStatus] = useState({});

  useEffect(() => {
    let alive = true;
    getInvestigations()
      .then((result) => {
        if (!alive) return;
        setItems(result.items);
        const preferred =
          result.items.find((item) => item.id === selectedId) ||
          result.items.find((item) => item.projectId === projectHint) ||
          result.items[0];
        if (preferred) setParams({ id: preferred.id }, { replace: true });
      })
      .catch(() => setError('Unable to load investigations.'))
      .finally(() => setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedId) return undefined;
    let alive = true;
    getInvestigationById(selectedId).then((item) => {
      if (!alive || !item) return;
      setActive(item);
      getProjectById(item.projectId).then((record) => {
        if (alive) setProject(record);
      });
    });
    return () => {
      alive = false;
    };
  }, [selectedId]);

  const displayItems = useMemo(
    () => items.map((item) => ({ ...item, status: localStatus[item.id] || item.status })),
    [items, localStatus],
  );

  const runAction = (key) => {
    const spec = actionCatalog[key];
    setConfirm({
      key,
      ...spec,
    });
  };

  const onConfirm = () => {
    if (!active || !confirm) return;
    if (confirm.key === 'review') {
      setLocalStatus((current) => ({ ...current, [active.id]: 'Under Review' }));
    }
    if (confirm.key === 'close') {
      setLocalStatus((current) => ({ ...current, [active.id]: 'Closed' }));
    }
    if (confirm.key === 'escalate') {
      setLocalStatus((current) => ({ ...current, [active.id]: 'Escalated' }));
    }
    setToast(confirm.success);
    setConfirm(null);
    window.setTimeout(() => setToast(''), 2200);
  };

  return (
    <GovernmentLayout>
      <section className="gov-page-head">
        <div>
          <h1>Investigations</h1>
          <p>Review projects requiring administrative verification.</p>
        </div>
      </section>

      {loading ? <div className="gov-loading">Loading investigations…</div> : null}
      {error ? <div className="gov-error">{error}</div> : null}

      <section className="gov-panel">
        <div className="gov-table-wrap">
          <table className="gov-table">
            <thead>
              <tr>
                <th>Investigation ID</th>
                <th>Project</th>
                <th>Reason</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Opened</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displayItems.map((item) => (
                <tr key={item.id} className={selectedId === item.id ? 'is-selected' : ''}>
                  <td>{item.id}</td>
                  <td>{item.project}</td>
                  <td>{item.reason}</td>
                  <td>
                    <StatusBadge value={item.priority} />
                  </td>
                  <td>{item.assignedTo}</td>
                  <td>{item.opened}</td>
                  <td>
                    <StatusBadge value={item.status} />
                  </td>
                  <td>
                    <button type="button" className="gov-btn" onClick={() => setParams({ id: item.id })}>
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {active ? (
        <section className="gov-grid-2">
          <div>
            <div className="gov-panel" style={{ marginBottom: 16 }}>
              <div className="gov-panel-head">
                <h2>{active.id} · {active.project}</h2>
                <StatusBadge value={localStatus[active.id] || active.status} />
              </div>
              <div className="gov-panel-body">
                <h3 className="gov-section-title" style={{ marginTop: 0 }}>Why investigation was triggered</h3>
                <p style={{ marginTop: 0 }}>{active.trigger}</p>
                {project ? (
                  <div className="gov-meta-grid">
                    <div><span>Project ID</span><strong>{project.id}</strong></div>
                    <div><span>Location</span><strong>{project.location}</strong></div>
                    <div><span>Department</span><strong>{project.department}</strong></div>
                    <div><span>Contractor</span><strong>{project.contractor}</strong></div>
                    <div><span>Physical progress</span><strong>{project.progress}%</strong></div>
                    <div><span>Risk score</span><strong>{project.aiRisk.score} / 100</strong></div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="gov-panel" style={{ marginBottom: 16 }}>
              <div className="gov-panel-head">
                <h2>Timeline</h2>
              </div>
              <div className="gov-panel-body">
                <ol className="gov-timeline">
                  {active.timeline.map((entry) => (
                    <li key={`${entry.date}-${entry.event}`}>
                      <time>{entry.date}</time>
                      {entry.event}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="gov-panel">
              <div className="gov-panel-head">
                <h2>Evidence</h2>
              </div>
              <div className="gov-panel-body">
                <div className="gov-evidence">
                  <article>
                    <h3>Progress reports</h3>
                    <p>{active.evidence.progressReports} indexed. Additional files can be attached after backend integration.</p>
                  </article>
                  <article>
                    <h3>Inspection reports</h3>
                    <p>
                      {active.evidence.inspectionReports
                        ? `${active.evidence.inspectionReports} record(s) on file.`
                        : 'No inspection report uploaded yet.'}
                    </p>
                  </article>
                  <article>
                    <h3>Financial records</h3>
                    <p>{active.evidence.financialRecords} RA / release notes referenced. Source documents pending.</p>
                  </article>
                  <article>
                    <h3>Citizen feedback</h3>
                    <p>{active.evidence.citizenFeedback} linked complaints. Full threads available on the citizen portal.</p>
                  </article>
                  <article>
                    <h3>Uploaded documents</h3>
                    <p>No documents uploaded in this demo workspace.</p>
                  </article>
                  <article>
                    <h3>Site images</h3>
                    <p>No geotagged site images attached.</p>
                  </article>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="gov-panel" style={{ marginBottom: 16 }}>
              <div className="gov-panel-head">
                <h2>Risk indicators</h2>
              </div>
              <div className="gov-panel-body">
                {project ? (
                  <ul className="gov-list-plain">
                    {project.aiRisk.factors.map((factor) => (
                      <li key={factor.label}>
                        {factor.label}
                        <strong style={{ float: 'right' }}>+{factor.value}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="gov-empty">Loading indicators…</p>
                )}
              </div>
            </div>

            <div className="gov-panel">
              <div className="gov-panel-head">
                <h2>Government actions</h2>
              </div>
              <div className="gov-panel-body">
                <div className="gov-action-row" style={{ marginTop: 0 }}>
                  <button type="button" className="gov-btn" onClick={() => runAction('clarify')}>
                    Request Contractor Clarification
                  </button>
                  <button type="button" className="gov-btn" onClick={() => runAction('inspect')}>
                    Schedule Inspection
                  </button>
                  <button type="button" className="gov-btn" onClick={() => runAction('review')}>
                    Mark Under Review
                  </button>
                  <button type="button" className="gov-btn" onClick={() => runAction('escalate')}>
                    Escalate
                  </button>
                  <button type="button" className="gov-btn danger" onClick={() => runAction('close')}>
                    Close Investigation
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="gov-empty">No investigation selected.</div>
      )}

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        tone={confirm?.tone}
        onCancel={() => setConfirm(null)}
        onConfirm={onConfirm}
      />

      {toast ? <div className="gov-toast" role="status">{toast}</div> : null}
    </GovernmentLayout>
  );
}

export default Investigation;
