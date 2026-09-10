/** Analytics demo data for GET /government/analytics. */

export const analyticsKpis = [
  { key: 'completion', label: 'Average Project Completion', value: '68%', hint: 'Physical progress across selected filters' },
  { key: 'delay', label: 'Average Delay', value: '12 days', hint: 'Against approved work programme' },
  { key: 'utilization', label: 'Budget Utilization', value: '74%', hint: 'Spent against allocated budget' },
  { key: 'ontime', label: 'Projects Completed On Time', value: '71%', hint: 'Closed works within original completion' },
];

export const performanceSeries = [
  { month: 'Apr', expected: 42, actual: 38 },
  { month: 'May', expected: 48, actual: 44 },
  { month: 'Jun', expected: 55, actual: 49 },
  { month: 'Jul', expected: 61, actual: 53 },
  { month: 'Aug', expected: 67, actual: 59 },
  { month: 'Sep', expected: 72, actual: 64 },
];

export const budgetAnalysis = {
  allocated: 482,
  released: 351,
  spent: 318,
  remaining: 164,
};

export const regionalPerformance = [
  { district: 'Lucknow', projects: 18, avgProgress: 71, avgDelay: 8, utilization: 76, risk: 'Medium' },
  { district: 'Varanasi', projects: 15, avgProgress: 63, avgDelay: 16, utilization: 81, risk: 'High' },
  { district: 'Kanpur', projects: 21, avgProgress: 76, avgDelay: 7, utilization: 72, risk: 'Low' },
  { district: 'Prayagraj', projects: 13, avgProgress: 59, avgDelay: 18, utilization: 69, risk: 'High' },
  { district: 'Ghaziabad', projects: 16, avgProgress: 64, avgDelay: 14, utilization: 78, risk: 'Medium' },
  { district: 'Meerut', projects: 14, avgProgress: 69, avgDelay: 6, utilization: 70, risk: 'Low' },
];

export const departmentPerformance = [
  { department: 'PWD', projects: 44, completion: 67, delay: 11, utilization: 75, risk: 'Medium' },
  { department: 'Education', projects: 21, completion: 78, delay: 5, utilization: 71, risk: 'Low' },
  { department: 'Health', projects: 18, completion: 61, delay: 15, utilization: 80, risk: 'High' },
  { department: 'Urban Development', projects: 23, completion: 58, delay: 17, utilization: 77, risk: 'High' },
  { department: 'Rural Development', projects: 18, completion: 72, delay: 8, utilization: 68, risk: 'Low' },
];

export const trinetraInsights = [
  'Road infrastructure projects in the selected region are progressing 8% slower than the departmental average.',
  'Budget utilization is increasing faster than physical completion in 6 projects.',
  'Projects with repeated contractor reporting delays have a higher probability of schedule slippage.',
];
