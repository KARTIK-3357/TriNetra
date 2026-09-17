import { useState } from 'react';
import GovernmentLayout from '../../components/government/GovernmentLayout';
import { api } from '../../services/api';

const initialForm = {
  category: 'Road', mp_name: '', state: '', district: '', agency_name: '', status: 'In Progress',
  sanction_date: '', expected_completion: '', estimated_cost: '', sanctioned_amount: '', released_amount: '',
  expenditure: '', progress_percentage: '', latitude: '', longitude: '',
};

const fields = [
  ['category', 'Work category', 'text'], ['mp_name', 'MP name', 'text'], ['state', 'State', 'text'], ['district', 'District', 'text'], ['agency_name', 'Executing agency', 'text'],
  ['sanction_date', 'Sanction date', 'date'], ['expected_completion', 'Expected completion', 'date'],
  ['estimated_cost', 'Estimated cost (₹)', 'number'], ['sanctioned_amount', 'Sanctioned amount (₹)', 'number'], ['released_amount', 'Released amount (₹)', 'number'], ['expenditure', 'Expenditure (₹)', 'number'],
  ['progress_percentage', 'Progress (%)', 'number'], ['latitude', 'Latitude', 'number'], ['longitude', 'Longitude', 'number'],
];

function AiAssessment() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const calculate = async (event) => {
    event.preventDefault();
    setLoading(true); setError(''); setResult(null);
    try {
      setResult(await api.post('/government/ai-assessment', form));
    } catch (requestError) {
      setError(requestError.message || 'Risk assessment could not be calculated.');
    } finally { setLoading(false); }
  };

  return (
    <GovernmentLayout>
      <section className="gov-page-head">
        <div><h1>AI Risk Assessment</h1><p>Enter the current project information to calculate anomaly and delivery risk.</p></div>
      </section>
      <form onSubmit={calculate} className="gov-panel" style={{ padding: 22 }}>
        <div className="gov-panel-head" style={{ padding: '0 0 16px' }}><h2>Project assessment inputs</h2><span>All fields are required by the model</span></div>
        <div className="gov-meta-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))' }}>
          {fields.map(([key, label, type]) => <label key={key} className="gov-field" style={{ margin: 0 }}>
            <span>{label}</span>
            <input required min={type === 'number' ? '0' : undefined} step={key === 'latitude' || key === 'longitude' ? 'any' : undefined} type={type} value={form[key]} onChange={(event) => update(key, event.target.value)} />
          </label>)}
          <label className="gov-field" style={{ margin: 0 }}><span>Work status</span>
            <select value={form.status} onChange={(event) => update('status', event.target.value)}><option>In Progress</option><option>Sanctioned</option><option>Completed</option><option>Delayed</option></select>
          </label>
        </div>
        <div className="gov-action-row" style={{ marginTop: 22 }}>
          <button className="gov-btn primary" type="submit" disabled={loading}>{loading ? 'Calculating risk…' : 'Calculate risk'}</button>
          <button className="gov-btn ghost" type="button" onClick={() => { setForm(initialForm); setResult(null); setError(''); }}>Clear form</button>
        </div>
        {error ? <p className="gov-error" style={{ marginTop: 16 }}>{error}</p> : null}
      </form>
      {result ? <section className="gov-grid-2" style={{ marginTop: 20 }}>
        <article className="gov-panel" style={{ padding: 22 }}>
          <div className="gov-kpi-label">Net risk</div>
          <strong style={{ fontSize: '3rem', color: result.level === 'High' ? '#b42318' : result.level === 'Medium' ? '#c5673a' : '#0d7d52' }}>{result.netRisk}%</strong>
          <p style={{ marginBottom: 0 }}>Overall level: <strong>{result.level}</strong></p>
        </article>
        <article className="gov-panel" style={{ padding: 22 }}>
          <h2 style={{ marginTop: 0 }}>Assessment results</h2>
          <div className="gov-legend">{result.results.map((item) => <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e4eaf1' }}>
            <span>{item.label}</span><strong style={{ color: item.detected ? '#b42318' : '#0d7d52' }}>{item.detected ? 'Detected' : 'Not detected'} · {item.probability}%</strong>
          </div>)}</div>
        </article>
      </section> : null}
    </GovernmentLayout>
  );
}

export default AiAssessment;
