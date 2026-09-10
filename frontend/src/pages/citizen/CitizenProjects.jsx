import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CitizenThemeToggle from '../../components/common/CitizenThemeToggle';
import { useCitizenTheme } from '../../context/CitizenThemeContext';

const projects = [
  {
    id: 'MPLADS-2025-0142',
    name: 'Rural Road Improvement',
    location: 'Ward 12, Ludhiana',
    category: 'Road',
    contractor: 'ABC Infrastructure Pvt. Ltd.',
    budget: '₹42.5 lakh',
    progress: 48,
    planned: 72,
    status: 'Delayed',
    updated: '2 days ago',
    flag: 'red',
  },
  {
    id: 'MPLADS-2025-0187',
    name: 'Government School Infrastructure Upgrade',
    location: 'Village Bhamian',
    category: 'Education',
    contractor: 'Punjab BuildWorks',
    budget: '₹68 lakh',
    progress: 72,
    planned: 78,
    status: 'On Track',
    updated: '1 day ago',
    flag: 'green',
  },
  {
    id: 'MPLADS-2025-0211',
    name: 'Drinking Water Pipeline Improvement',
    location: 'Ward 7',
    category: 'Drinking Water',
    contractor: 'Northern Civil Works',
    budget: '₹1.28 crore',
    progress: 61,
    planned: 70,
    status: 'In Progress',
    updated: '4 days ago',
    flag: 'amber',
  },
  {
    id: 'MPLADS-2025-0264',
    name: 'Primary Health Centre Renovation',
    location: 'Sahnewal Block',
    category: 'Health',
    contractor: 'Aarav Medical Infra',
    budget: '₹94 lakh',
    progress: 83,
    planned: 86,
    status: 'On Track',
    updated: '1 day ago',
    flag: 'green',
  },
  {
    id: 'MPLADS-2025-0317',
    name: 'Street Lighting Network Expansion',
    location: 'Civil Lines Zone',
    category: 'Street Lighting',
    contractor: 'GreenGrid Power',
    budget: '₹31.2 lakh',
    progress: 21,
    planned: 40,
    status: 'Under Review',
    updated: '5 days ago',
    flag: 'amber',
  },
  {
    id: 'MPLADS-2025-0379',
    name: 'Drainage Channel Rehabilitation',
    location: 'Ward 24',
    category: 'Drainage',
    contractor: 'Doaba Infrastructure',
    budget: '₹56 lakh',
    progress: 64,
    planned: 68,
    status: 'Ongoing',
    updated: '3 days ago',
    flag: 'amber',
  },
  {
    id: 'MPLADS-2025-0410',
    name: 'Community Hall Modernisation',
    location: 'Gill Rural',
    category: 'Community Infrastructure',
    contractor: 'Punjab Civic Works',
    budget: '₹72 lakh',
    progress: 88,
    planned: 90,
    status: 'Completed',
    updated: '6 days ago',
    flag: 'green',
  },
  {
    id: 'MPLADS-2025-0488',
    name: 'Sewer Network Augmentation',
    location: 'Model Town',
    category: 'Drainage',
    contractor: 'Northen Build Services',
    budget: '₹1.14 crore',
    progress: 55,
    planned: 68,
    status: 'Sanctioned',
    updated: '7 days ago',
    flag: 'amber',
  },
];

const navItems = [
  { label: 'Home', icon: '⌂', to: '/citizen' },
  { label: 'Projects', icon: '▣', to: '/citizen/projects' },
  { label: 'Contractors', icon: '▤', to: '/citizen/contractors' },
  { label: 'Reports & Feedback', icon: '✎', to: '/citizen/feedback' },
];

const statusOptions = ['All Statuses', 'Ongoing', 'On Track', 'Delayed', 'Completed', 'Sanctioned', 'Under Review'];
const categoryOptions = ['All Categories', 'Road', 'Education', 'Drinking Water', 'Health', 'Street Lighting', 'Drainage', 'Community Infrastructure', 'Other'];
const areaOptions = ['All Areas', 'Ludhiana West', 'Ward 12', 'Village Bhamian', 'Sahnewal Block', 'Civil Lines Zone'];

const projectStyles = `
  .projects-shell {
    --page-bg: #f7f9fb;
    --sidebar-bg: #f4f7fa;
    --panel-bg: #ffffff;
    --panel-soft: #f9fbfd;
    --surface-bg: #f8fafc;
    --title-color: #17212b;
    --body-color: #3b546c;
    --muted-color: #66727d;
    --border: #dfe6ee;
    --shadow: rgba(17, 33, 54, 0.04);
    display: flex;
    min-height: 100vh;
    background: var(--page-bg);
    color: var(--title-color);
    font-family: "Inter", "Segoe UI", sans-serif;
  }

  .projects-shell.dark-theme {
    --page-bg: #0a1220;
    --sidebar-bg: #101a2b;
    --panel-bg: #111f2f;
    --panel-soft: #15263a;
    --surface-bg: #0f1b2d;
    --title-color: #edf4ff;
    --body-color: #dfeaf8;
    --muted-color: #b2c3d9;
    --border: rgba(162, 182, 210, 0.18);
    --shadow: rgba(2, 6, 12, 0.42);
    background: var(--page-bg);
    color: var(--title-color);
  }

  .projects-shell.dark-theme {
    color: var(--title-color);
  }

  .projects-shell.dark-theme .projects-sidebar,
  .projects-shell.dark-theme .projects-topbar,
  .projects-shell.dark-theme .projects-panel,
  .projects-shell.dark-theme .projects-header,
  .projects-shell.dark-theme .projects-toolbar,
  .projects-shell.dark-theme .projects-search input,
  .projects-shell.dark-theme .projects-search-large input,
  .projects-shell.dark-theme .projects-location,
  .projects-shell.dark-theme .projects-topbar-button,
  .projects-shell.dark-theme .projects-profile,
  .projects-shell.dark-theme .projects-filter-box select,
  .projects-shell.dark-theme .projects-primary-btn,
  .projects-shell.dark-theme .projects-secondary-btn,
  .projects-shell.dark-theme .projects-ghost-btn,
  .projects-shell.dark-theme .projects-helpline-pill,
  .projects-shell.dark-theme .projects-filter-box,
  .projects-shell.dark-theme .projects-search,
  .projects-shell.dark-theme .projects-search-large {
    background: #131f2d !important;
    border-color: rgba(148, 167, 190, 0.22) !important;
    color: var(--title-color) !important;
  }

  .projects-shell.dark-theme .projects-header h1,
  .projects-shell.dark-theme .projects-header p,
  .projects-shell.dark-theme .projects-brand strong,
  .projects-shell.dark-theme .projects-brand span,
  .projects-shell.dark-theme .projects-nav-item,
  .projects-shell.dark-theme .projects-nav-item .icon,
  .projects-shell.dark-theme .projects-helpline-label,
  .projects-shell.dark-theme .projects-helpline-number,
  .projects-shell.dark-theme .projects-helpline-meta,
  .projects-shell.dark-theme .results-text,
  .projects-shell.dark-theme .results-text strong,
  .projects-shell.dark-theme .projects-view-toggle button,
  .projects-shell.dark-theme .project-name,
  .projects-shell.dark-theme .project-sub,
  .projects-shell.dark-theme td,
  .projects-shell.dark-theme th {
    color: var(--title-color) !important;
  }

  .projects-shell.dark-theme .projects-nav-item.active {
    background: rgba(139, 183, 255, 0.12) !important;
    color: var(--title-color) !important;
    box-shadow: inset 0 0 0 1px rgba(139, 183, 255, 0.24) !important;
  }

  .projects-shell.dark-theme .projects-view-toggle {
    background: rgba(17, 31, 47, 0.9);
    border-color: var(--border);
  }

  .projects-shell.dark-theme .projects-view-toggle button.active {
    background: rgba(139, 183, 255, 0.14);
    color: var(--title-color);
  }

  .projects-shell.dark-theme .projects-table-wrap,
  .projects-shell.dark-theme table,
  .projects-shell.dark-theme th,
  .projects-shell.dark-theme td {
    background: #111f2f !important;
    border-color: rgba(148, 167, 190, 0.22) !important;
  }

  .projects-sidebar {
    width: 236px;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    padding: 18px 16px 14px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .projects-brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 6px 4px 16px;
    margin-bottom: 18px;
  }

  .projects-brand img {
    width: 34px;
    height: 34px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid rgba(18, 59, 93, 0.12);
    background: #fff;
  }

  .projects-brand strong {
    display: block;
    font-size: 1.55rem;
    line-height: 1;
    letter-spacing: 0.04em;
    color: var(--title-color);
    font-weight: 800;
  }

  .projects-brand span {
    display: block;
    margin-top: 3px;
    color: #66727d;
    font-size: 0.7rem;
    letter-spacing: 0.04em;
  }

  .projects-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .projects-nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 10px;
    border-radius: 10px;
    color: var(--body-color);
    font-size: 0.88rem;
    font-weight: 600;
    background: transparent;
  }

  .projects-nav-item.active {
    background: #ecf1f6;
    color: #17212b;
    box-shadow: inset 0 0 0 1px #dde6f0;
  }

  .projects-nav-item .icon {
    width: 18px;
    text-align: center;
    font-size: 1rem;
    color: #56708c;
  }

  .projects-helpline {
    margin-top: auto;
    border-top: 1px solid #dfe6ee;
    padding-top: 16px;
  }

  .projects-helpline-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #6b7886;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .projects-helpline-number {
    font-size: 1.04rem;
    font-weight: 800;
    color: #17212b;
    margin-bottom: 8px;
  }

  .projects-helpline-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    color: #5a6977;
    font-size: 0.72rem;
  }

  .projects-helpline-pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #edf3fa;
    border: 1px solid #dde7f2;
    border-radius: 999px;
    color: #4f647b;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 4px 8px;
    margin-top: 8px;
  }

  .projects-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .projects-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 12px 18px 10px;
    background: var(--surface-bg);
    border-bottom: 1px solid var(--border);
  }

  .projects-topbar-left,
  .projects-topbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .projects-location {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px;
    border: 1px solid #dfe7f1;
    background: #fff;
    border-radius: 10px;
    font-size: 0.8rem;
    color: #52647a;
    font-weight: 600;
  }

  .projects-topbar-button {
    border: 1px solid #dde8f3;
    background: #fff;
    color: #1e2d3d;
    border-radius: 10px;
    padding: 8px 12px;
    font-size: 0.78rem;
    font-weight: 700;
  }

  .projects-search {
    position: relative;
    width: 360px;
  }

  .projects-search input {
    width: 100%;
    border: 1px solid #dde7f1;
    background: #fff;
    border-radius: 10px;
    height: 38px;
    padding: 0 14px 0 38px;
    outline: none;
    color: #1d2d42;
    font-size: 0.8rem;
  }

  .projects-search .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6a7f95;
    font-size: 1rem;
  }

  .projects-profile {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border-radius: 999px;
    background: var(--panel-soft);
    border: 1px solid var(--border);
    color: var(--title-color);
    font-size: 0.76rem;
    font-weight: 700;
  }

  .citizen-theme-toggle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--panel-bg);
    color: #f5b942;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.9rem;
    line-height: 1;
  }

  .projects-content {
    padding: 16px 20px 24px;
    overflow: auto;
  }

  .projects-panel {
    background: var(--panel-bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 16px var(--shadow);
  }

  .projects-header {
    padding: 18px 20px 12px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    border-bottom: 1px solid #e5edf5;
    background: #fbfcfe;
  }

  .projects-header h1 {
    margin: 0;
    font-size: clamp(1.9rem, 2vw, 2.4rem);
    letter-spacing: -0.04em;
    color: var(--title-color);
    font-weight: 800;
  }

  .projects-header p {
    margin: 8px 0 0;
    color: #66727d;
    font-size: 0.9rem;
  }

  .projects-header-right {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .projects-primary-btn,
  .projects-secondary-btn,
  .projects-ghost-btn {
    border-radius: 10px;
    padding: 9px 12px;
    font-size: 0.78rem;
    font-weight: 700;
    cursor: pointer;
  }

  .projects-primary-btn {
    background: #123b5d;
    color: #fff;
    border: 1px solid #123b5d;
  }

  .projects-secondary-btn {
    background: #fff;
    color: #1f2e3f;
    border: 1px solid #dfe8f1;
  }

  .projects-ghost-btn {
    background: #f4f7fb;
    color: #1f2e3f;
    border: 1px solid #dce8f4;
  }

  .projects-toolbar {
    padding: 14px 20px 12px;
    border-bottom: 1px solid var(--border);
    background: var(--panel-soft);
  }

  .projects-search-large {
    position: relative;
    width: 100%;
  }

  .projects-search-large input {
    width: 100%;
    height: 48px;
    border: 1px solid #dfe7f0;
    background: #fff;
    border-radius: 12px;
    padding: 0 16px 0 46px;
    font-size: 0.92rem;
    color: #1b2d42;
    outline: none;
    box-sizing: border-box;
  }

  .projects-search-large .search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #61748a;
    font-size: 1.1rem;
  }

  .projects-filter-bar {
    display: grid;
    grid-template-columns: repeat(7, minmax(140px, 1fr));
    gap: 10px;
    margin-top: 14px;
  }

  .projects-filter-box {
    position: relative;
  }

  .projects-filter-box select {
    width: 100%;
    height: 38px;
    border: 1px solid #dfe7f1;
    border-radius: 10px;
    background: #fff;
    appearance: none;
    padding: 0 28px 0 10px;
    color: #24384d;
    font-size: 0.74rem;
    font-weight: 600;
    outline: none;
    box-sizing: border-box;
  }

  .projects-filter-box .caret {
    position: absolute;
    right: 9px;
    top: 50%;
    transform: translateY(-50%);
    color: #5d7187;
    font-size: 0.8rem;
    pointer-events: none;
  }

  .projects-filter-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 14px;
  }

  .projects-results-zone {
    padding: 16px 20px 18px;
  }

  .projects-results-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    margin-bottom: 12px;
  }

  .results-text {
    font-size: 0.82rem;
    color: #5d6d7d;
  }

  .results-text strong {
    color: #17212b;
    font-size: 0.84rem;
  }

  .projects-view-toggle {
    display: inline-flex;
    border: 1px solid #dfe7f1;
    background: #f7f9fb;
    border-radius: 10px;
    padding: 4px;
  }

  .projects-view-toggle button {
    border: none;
    background: transparent;
    padding: 7px 12px;
    border-radius: 8px;
    color: #55677b;
    font-size: 0.76rem;
    font-weight: 700;
    cursor: pointer;
  }

  .projects-view-toggle button.active {
    background: #123b5d;
    color: #fff;
  }

  .projects-map-box {
    background: linear-gradient(180deg, #eef4f8 0%, #edf1f6 100%);
    border: 1px solid #dfe8f2;
    border-radius: 12px;
    height: 180px;
    position: relative;
    overflow: hidden;
    margin-bottom: 16px;
  }

  .projects-map-box svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .project-marker {
    position: absolute;
    width: 12px;
    height: 12px;
    background: #123b5d;
    border: 2px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 3px rgba(18, 59, 93, 0.12);
  }

  .project-marker.red {
    background: #d84c4c;
  }

  .project-marker.green {
    background: #2b7f5c;
  }

  .project-marker.amber {
    background: #c48f2c;
  }

  .projects-table-wrap {
    overflow-x: auto;
    border: 1px solid #e4ecf5;
    border-radius: 12px;
  }

  table {
    width: 100%;
    min-width: 1060px;
    border-collapse: collapse;
    background: #fff;
  }

  th,
  td {
    padding: 12px 12px;
    text-align: left;
    border-bottom: 1px solid #edf2f7;
    font-size: 0.76rem;
    color: #3b546c;
    vertical-align: middle;
  }

  th {
    background: #f8fafc;
    color: #5d6e7f;
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 800;
  }

  td strong {
    color: #17212b;
  }

  .project-name-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .project-name {
    color: #17212b;
    font-weight: 700;
  }

  .project-sub {
    color: #66727d;
    font-size: 0.7rem;
  }

  .status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    padding: 5px 8px;
    border: 1px solid transparent;
    font-size: 0.7rem;
    font-weight: 700;
  }

  .status-green {
    background: #eefaf4;
    color: #2b7f5c;
    border-color: #d7f0e3;
  }

  .status-amber {
    background: #fff7ea;
    color: #b77b28;
    border-color: #efdebb;
  }

  .status-red {
    background: #fff0f0;
    color: #d54e4e;
    border-color: #f0d0d0;
  }

  .progress-box {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 110px;
  }

  .progress-meta {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 0.69rem;
    color: #5d6d7d;
  }

  .progress-bar {
    height: 8px;
    width: 100%;
    background: #edf2f6;
    border-radius: 999px;
    overflow: hidden;
  }

  .progress-bar > span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: #123b5d;
  }

  .progress-bar.red > span {
    background: linear-gradient(90deg, #cf5b5b 0%, #e7a4a4 100%);
  }

  .progress-bar.green > span {
    background: linear-gradient(90deg, #2b7f5c 0%, #7dc7a2 100%);
  }

  .progress-bar.amber > span {
    background: linear-gradient(90deg, #c48f2c 0%, #ead3a5 100%);
  }

  .view-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;
    padding: 8px 12px;
    border-radius: 9px;
    background: linear-gradient(135deg, #123b5d 0%, #2e6b9f 100%);
    color: #ffffff !important;
    text-decoration: none;
    font-weight: 800;
    font-size: 0.72rem;
    box-shadow: 0 8px 18px rgba(18, 59, 93, 0.18);
  }

  .projects-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding-top: 16px;
    color: #5b6a77;
    font-size: 0.76rem;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pagination-controls button {
    border: 1px solid #dfe8f2;
    background: #fff;
    color: #1d2d42;
    border-radius: 8px;
    padding: 7px 10px;
    font-size: 0.76rem;
    font-weight: 700;
  }

  .pagination-controls button.active {
    background: #123b5d;
    border-color: #123b5d;
    color: #fff;
  }

  @media (max-width: 1180px) {
    .projects-filter-bar {
      grid-template-columns: repeat(3, minmax(140px, 1fr));
    }
  }

  @media (max-width: 900px) {
    .projects-shell {
      flex-direction: column;
    }

    .projects-sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #dfe6ee;
    }

    .projects-topbar {
      flex-wrap: wrap;
    }

    .projects-search {
      width: 100%;
    }

    .projects-filter-bar {
      grid-template-columns: repeat(2, minmax(140px, 1fr));
    }
  }
`;

function CitizenProjects() {
  const location = useLocation();
  const { theme } = useCitizenTheme();
  const [searchText, setSearchText] = useState('');
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [viewMode, setViewMode] = useState('map');

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        !searchText ||
        project.name.toLowerCase().includes(searchText.toLowerCase()) ||
        project.id.toLowerCase().includes(searchText.toLowerCase()) ||
        project.location.toLowerCase().includes(searchText.toLowerCase()) ||
        project.contractor.toLowerCase().includes(searchText.toLowerCase());

      const matchesArea =
        selectedArea === 'All Areas' ||
        project.location.toLowerCase().includes(selectedArea.toLowerCase()) ||
        project.location.toLowerCase().includes(selectedArea.replace('Ward ', 'ward ').toLowerCase());

      const matchesStatus =
        selectedStatus === 'All Statuses' || project.status === selectedStatus;

      const matchesCategory =
        selectedCategory === 'All Categories' || project.category === selectedCategory;

      return matchesSearch && matchesArea && matchesStatus && matchesCategory;
    });
  }, [searchText, selectedArea, selectedStatus, selectedCategory]);

  const resetFilters = () => {
    setSearchText('');
    setSelectedArea('All Areas');
    setSelectedStatus('All Statuses');
    setSelectedCategory('All Categories');
  };

  return (
    <div className={`projects-shell ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <style>{projectStyles}</style>

      <aside className="projects-sidebar">
        <div className="projects-brand">
          <img src="/trinetra-logo.jpg" alt="TRINETRA logo" />
          <div>
            <strong>TRINETRA</strong>
        
          </div>
        </div>

        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'flex-start' }}>
          <CitizenThemeToggle />
        </div>

        <nav className="projects-nav" aria-label="Citizen navigation">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;

            return (
              <Link key={item.label} to={item.to} className={`projects-nav-item ${isActive ? 'active' : ''}`}>
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="projects-helpline">
          <div className="projects-helpline-label">Citizen Helpline</div>
          <div className="projects-helpline-number">1800-11-2024</div>
          <div className="projects-helpline-meta">
            <span>Toll-Free • 09:00 - 18:00 IST</span>
          </div>
          <div className="projects-helpline-pill">NIC Compliant</div>
        </div>
      </aside>

      <main className="projects-main">
        <header className="projects-topbar">
          <div className="projects-topbar-left">
            <div className="projects-location">📍 Ludhiana, Punjab</div>
            <button className="projects-topbar-button" type="button">Change Area</button>
          </div>

          <div className="projects-topbar-right">
            <div className="projects-search">
              <span className="search-icon">⌕</span>
              <input type="text" placeholder="Search projects, locations or project IDs" />
            </div>
            <button className="projects-topbar-button" type="button">🔔</button>
            <div className="projects-profile">👤 Ludhiana Guest</div>
          </div>
        </header>

        <div className="projects-content">
          <section className="projects-panel">
            <div className="projects-header">
              <div>
                <h1>Public Projects</h1>
                <p>Explore ongoing, completed and sanctioned public infrastructure works in your selected area.</p>
              </div>

              <div className="projects-header-right">
                <button className="projects-secondary-btn" type="button">Export CSV</button>
                <button className="projects-primary-btn" type="button">+ Add Filter</button>
              </div>
            </div>

            <div className="projects-toolbar">
              <div className="projects-search-large">
                <span className="search-icon">⌕</span>
                <input type="text" placeholder="Search by project name, project ID, location or contractor" />
              </div>

              <div className="projects-filter-bar">
                <div className="projects-filter-box">
                  <select defaultValue="Area / Location">
                    <option disabled>Area / Location</option>
                    <option>Ludhiana West</option>
                    <option>Ward 12</option>
                    <option>Village Bhamian</option>
                    <option>Sahnewal Block</option>
                  </select>
                  <span className="caret">▾</span>
                </div>

                <div className="projects-filter-box">
                  <select defaultValue="Project Status">
                    <option disabled>Project Status</option>
                    {statusOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <span className="caret">▾</span>
                </div>

                <div className="projects-filter-box">
                  <select defaultValue="Project Category">
                    <option disabled>Project Category</option>
                    {categoryOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                  <span className="caret">▾</span>
                </div>

                <div className="projects-filter-box">
                  <select defaultValue="Year">
                    <option disabled>Year</option>
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
                  </select>
                  <span className="caret">▾</span>
                </div>

                <div className="projects-filter-box">
                  <select defaultValue="Department">
                    <option disabled>Department</option>
                    <option>Public Works</option>
                    <option>Education</option>
                    <option>Health</option>
                    <option>Water Supply</option>
                  </select>
                  <span className="caret">▾</span>
                </div>

                <div className="projects-filter-box">
                  <select defaultValue="Contractor">
                    <option disabled>Contractor</option>
                    <option>ABC Infrastructure Pvt. Ltd.</option>
                    <option>Punjab BuildWorks</option>
                    <option>GreenGrid Power</option>
                  </select>
                  <span className="caret">▾</span>
                </div>

                <div className="projects-filter-box">
                  <select defaultValue="Budget Range">
                    <option disabled>Budget Range</option>
                    <option>Below ₹25 lakh</option>
                    <option>₹25 lakh - ₹1 crore</option>
                    <option>Above ₹1 crore</option>
                  </select>
                  <span className="caret">▾</span>
                </div>
              </div>

              <div className="projects-filter-actions">
                <button className="projects-primary-btn" type="button" onClick={() => {}}>
                  Apply Filters
                </button>
                <button className="projects-ghost-btn" type="button" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="projects-results-zone">
              <div className="projects-results-head">
                <div className="results-text">
                  <strong>{filteredProjects.length} projects found</strong>
                </div>

                <div className="projects-view-toggle">
                  <button className={viewMode === 'map' ? 'active' : ''} type="button" onClick={() => setViewMode('map')}>
                    Map View
                  </button>
                  <button className={viewMode === 'list' ? 'active' : ''} type="button" onClick={() => setViewMode('list')}>
                    List View
                  </button>
                </div>
              </div>

              {viewMode === 'map' && (
                <div className="projects-map-box" aria-label="Project map preview">
                <svg viewBox="0 0 1000 180" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0,80 C170,10 300,120 500,90 S760,20 1000,90" fill="none" stroke="#d2ddea" strokeWidth="8" />
                  <path d="M120,0 L350,160 L560,90 L830,150 L1000,20" fill="none" stroke="#d5dfec" strokeWidth="9" />
                  <path d="M50,130 L350,30 L610,150 L900,50" fill="none" stroke="#dce5f0" strokeWidth="6" />
                  <circle cx="185" cy="80" r="16" fill="rgba(18,59,93,0.08)" />
                  <circle cx="610" cy="110" r="26" fill="rgba(18,59,93,0.08)" />
                  <circle cx="820" cy="65" r="22" fill="rgba(18,59,93,0.08)" />
                </svg>

                  <div className="project-marker red" style={{ left: '42%', top: '50%' }} />
                  <div className="project-marker green" style={{ left: '58%', top: '35%' }} />
                  <div className="project-marker amber" style={{ left: '76%', top: '58%' }} />
                  <div className="project-marker" style={{ left: '24%', top: '62%' }} />
                </div>
              )}

              <div className="projects-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Project ID</th>
                      <th>Project</th>
                      <th>Location</th>
                      <th>Category</th>
                      <th>Contractor</th>
                      <th>Sanctioned Budget</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Last Updated</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((project) => {
                      const progressClass = project.flag === 'red' ? 'red' : project.flag === 'green' ? 'green' : 'amber';

                      return (
                        <tr key={project.id}>
                          <td><strong>{project.id}</strong></td>
                          <td>
                            <div className="project-name-block">
                              <span className="project-name">{project.name}</span>
                              <span className="project-sub">Public Infrastructure Work</span>
                            </div>
                          </td>
                          <td>{project.location}</td>
                          <td>{project.category}</td>
                          <td>{project.contractor}</td>
                          <td><strong>{project.budget}</strong></td>
                          <td>
                            <div className="progress-box">
                              <div className="progress-meta">
                                <span>Actual {project.progress}%</span>
                                <span>Planned {project.planned}%</span>
                              </div>
                              <div className={`progress-bar ${progressClass}`}>
                                <span style={{ width: `${project.progress}%` }} />
                              </div>
                            </div>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${
                                project.status === 'On Track' || project.status === 'Completed'
                                  ? 'status-green'
                                  : project.status === 'Delayed'
                                    ? 'status-red'
                                    : 'status-amber'
                              }`}
                            >
                              {project.status}
                            </span>
                          </td>
                          <td>{project.updated}</td>
                          <td>
                            <Link to={`/citizen/projects/${project.id}`} className="view-link">
                              View Project
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="projects-pagination">
                <div>Data shown from available public project records.</div>
                <div className="pagination-controls">
                  <button type="button">Previous</button>
                  <button className="active" type="button">1</button>
                  <button type="button">2</button>
                  <button type="button">3</button>
                  <button type="button">Next</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default CitizenProjects;
