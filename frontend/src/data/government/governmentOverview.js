/** Portfolio-level demo metrics for GET /government/overview. */

export const officerProfile = {
  name: 'Dr. Meera Sharma',
  designation: 'Joint Secretary (Works)',
  department: 'PWD, Uttar Pradesh',
  region: 'Lucknow Division',
  officerId: 'GOV-UP-2041',
};

export const portfolioKpis = [
  { key: 'total', label: 'Total Projects', value: '124', trend: '+6 this quarter', tone: 'neutral' },
  { key: 'ongoing', label: 'Ongoing', value: '78', trend: '+3 vs last month', tone: 'info' },
  { key: 'completed', label: 'Completed', value: '31', trend: '+4 this quarter', tone: 'good' },
  { key: 'delayed', label: 'Delayed', value: '15', trend: '-2 vs last month', tone: 'warn' },
  { key: 'risk', label: 'At Risk', value: '9', trend: '+1 this week', tone: 'danger' },
  { key: 'budget', label: 'Budget Under Monitoring', value: '₹4.82 Cr', trend: '₹0.18 Cr released', tone: 'neutral' },
];

export const statusOverview = [
  { key: 'ongoing', label: 'Ongoing', value: 78, color: '#123b5d' },
  { key: 'completed', label: 'Completed', value: 31, color: '#0d7d52' },
  { key: 'delayed', label: 'Delayed', value: 15, color: '#c5673a' },
  { key: 'risk', label: 'At Risk', value: 9, color: '#b42318' },
];

export const regionalMonitoring = [
  { district: 'Lucknow', projects: 18, ongoing: 12, delayed: 2, atRisk: 1, budget: '₹82 Cr', completion: 71 },
  { district: 'Varanasi', projects: 15, ongoing: 9, delayed: 3, atRisk: 2, budget: '₹64 Cr', completion: 63 },
  { district: 'Kanpur', projects: 21, ongoing: 14, delayed: 4, atRisk: 1, budget: '₹91 Cr', completion: 76 },
  { district: 'Prayagraj', projects: 13, ongoing: 8, delayed: 2, atRisk: 2, budget: '₹57 Cr', completion: 59 },
  { district: 'Ghaziabad', projects: 16, ongoing: 11, delayed: 2, atRisk: 2, budget: '₹73 Cr', completion: 64 },
  { district: 'Meerut', projects: 14, ongoing: 10, delayed: 2, atRisk: 1, budget: '₹48 Cr', completion: 69 },
];

export const recentActivity = [
  {
    id: 'ACT-901',
    timestamp: 'Today, 11:18 AM',
    project: 'Urban Road Improvement Phase II',
    projectId: 'TRN-24001',
    activity: 'Road widening project updated',
    status: 'Updated',
  },
  {
    id: 'ACT-902',
    timestamp: 'Today, 10:05 AM',
    project: 'Government School Construction — Cluster B',
    projectId: 'TRN-24004',
    activity: 'Government school construction progress submitted',
    status: 'Submitted',
  },
  {
    id: 'ACT-903',
    timestamp: 'Yesterday, 4:42 PM',
    project: 'Ganga Bridge Approach Roads',
    projectId: 'TRN-24003',
    activity: 'Bridge project marked delayed',
    status: 'Delayed',
  },
  {
    id: 'ACT-904',
    timestamp: 'Yesterday, 1:20 PM',
    project: 'District Hospital Expansion',
    projectId: 'TRN-24002',
    activity: 'Contractor submitted weekly progress',
    status: 'Review',
  },
  {
    id: 'ACT-905',
    timestamp: '08 Sep, 6:12 PM',
    project: 'Municipal Market Redevelopment',
    projectId: 'TRN-24008',
    activity: 'Citizen complaint escalated',
    status: 'Escalated',
  },
  {
    id: 'ACT-906',
    timestamp: '08 Sep, 11:40 AM',
    project: 'Primary Health Centre Upgrade',
    projectId: 'TRN-24007',
    activity: 'Project inspection completed',
    status: 'Verified',
  },
];

export const attentionItems = [
  {
    id: 'ATT-1',
    severity: 'High',
    project: 'District Hospital Expansion',
    projectId: 'TRN-24002',
    reason: '3 projects exceeded expected timeline',
    action: 'Review schedule variance',
  },
  {
    id: 'ATT-2',
    severity: 'High',
    project: 'Municipal Market Redevelopment',
    projectId: 'TRN-24008',
    reason: '2 projects show unusual expenditure patterns',
    action: 'Review financial progress',
  },
  {
    id: 'ATT-3',
    severity: 'Medium',
    project: 'Storm Water Drain Rehabilitation',
    projectId: 'TRN-24005',
    reason: '4 contractor progress reports require verification',
    action: 'Verify field reports',
  },
  {
    id: 'ATT-4',
    severity: 'High',
    project: 'Ganga Bridge Approach Roads',
    projectId: 'TRN-24003',
    reason: '1 project requires field investigation',
    action: 'Open investigation',
  },
];

export const intelligenceNotes = [
  '9 projects currently show elevated risk indicators.',
  '3 projects require immediate administrative review.',
];

export const notifications = [
  { id: 'N-1', title: 'Investigation INV-1024 awaiting review', time: '32 min ago', unread: true },
  { id: 'N-2', title: 'Risk scan completed for 124 projects', time: 'Today, 10:42 AM', unread: true },
  { id: 'N-3', title: 'Contractor update pending on TRN-24005', time: 'Yesterday', unread: false },
];
