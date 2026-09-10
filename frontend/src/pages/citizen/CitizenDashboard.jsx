import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCitizenTheme } from '../../context/CitizenThemeContext';
import CitizenThemeToggle from '../../components/common/CitizenThemeToggle';

const dashboardStyles = `
  .citizen-dashboard-page {
    --page-bg: #edf2f8;
    --shell-bg: #edf2f8;
    --sidebar-bg: #f4f7fb;
    --surface-bg: #f8fafd;
    --surface-strong: #ffffff;
    --card-bg: #ffffff;
    --card-alt: #f7f9fd;
    --card-soft: #eef5fe;
    --text-main: #1f2b3d;
    --text-soft: #53677f;
    --text-muted: #72839a;
    --border: rgba(115, 119, 127, 0.22);
    --shadow: rgba(14, 24, 38, 0.08);
    --primary: #123b5d;
    --primary-soft: #edf5ff;
    --success: #0d7d52;
    --success-soft: #edf9f4;
    --warning: #c5673a;
    --warning-soft: #fff2ee;
    --tag: #eaf0f7;
    --panel-bg: rgba(255, 255, 255, 0.8);
    background: var(--page-bg);
    min-height: 100vh;
    font-family: "Inter", "Segoe UI", sans-serif;
    color: var(--text-main);
    transition: background 0.25s ease, color 0.25s ease;
  }

  .citizen-dashboard-page.dark-theme {
    --page-bg: #0a1220;
    --shell-bg: #0d1725;
    --sidebar-bg: #101d2d;
    --surface-bg: #0f1b2d;
    --surface-strong: #15263c;
    --card-bg: #111f2f;
    --card-alt: #16293b;
    --card-soft: #1b2f46;
    --text-main: #edf4ff;
    --text-soft: #c9d8ee;
    --text-muted: #9dadc7;
    --border: rgba(162, 182, 210, 0.18);
    --shadow: rgba(2, 6, 12, 0.42);
    --primary: #8bb7ff;
    --primary-soft: rgba(139, 183, 255, 0.14);
    --success: #7fe0ae;
    --success-soft: rgba(127, 224, 174, 0.12);
    --warning: #ffb694;
    --warning-soft: rgba(255, 182, 148, 0.12);
    --tag: rgba(147, 167, 190, 0.12);
    --panel-bg: rgba(13, 23, 34, 0.82);
  }

  .citizen-dashboard-page.dark-theme {
    color: var(--text-main);
  }

  .citizen-dashboard-page.dark-theme .citizen-dashboard-shell,
  .citizen-dashboard-page.dark-theme .citizen-sidebar,
  .citizen-dashboard-page.dark-theme .topbar,
  .citizen-dashboard-page.dark-theme .feed-banner,
  .citizen-dashboard-page.dark-theme .stat-card,
  .citizen-dashboard-page.dark-theme .map-panel,
  .citizen-dashboard-page.dark-theme .panel-top,
  .citizen-dashboard-page.dark-theme .data-table,
  .citizen-dashboard-page.dark-theme .info-card,
  .citizen-dashboard-page.dark-theme .card,
  .citizen-dashboard-page.dark-theme .location-chip,
  .citizen-dashboard-page.dark-theme .mp-card,
  .citizen-dashboard-page.dark-theme .profile-panel,
  .citizen-dashboard-page.dark-theme .action-btn.light,
  .citizen-dashboard-page.dark-theme .search-box input,
  .citizen-dashboard-page.dark-theme .location-select,
  .citizen-dashboard-page.dark-theme .filter select,
  .citizen-dashboard-page.dark-theme .reset-btn,
  .citizen-dashboard-page.dark-theme .export-btn,
  .citizen-dashboard-page.dark-theme .switch-btn,
  .citizen-dashboard-page.dark-theme .help-pill,
  .citizen-dashboard-page.dark-theme .citizen-theme-toggle {
    background: var(--card-bg);
    border-color: var(--border);
    color: var(--text-main);
    box-shadow: 0 8px 18px var(--shadow);
  }

  .citizen-dashboard-page.dark-theme .citizen-dashboard-shell {
    background: var(--shell-bg);
  }

  .citizen-dashboard-page.dark-theme .citizen-sidebar {
    background: var(--sidebar-bg);
    border-color: var(--border);
  }

  .citizen-dashboard-page.dark-theme .citizen-brand strong,
  .citizen-dashboard-page.dark-theme .nav-item.active,
  .citizen-dashboard-page.dark-theme .help-number,
  .citizen-dashboard-page.dark-theme .header-copy h1,
  .citizen-dashboard-page.dark-theme .page-header h1,
  .citizen-dashboard-page.dark-theme .map-panel h2,
  .citizen-dashboard-page.dark-theme .table-head h3,
  .citizen-dashboard-page.dark-theme .info-card h4,
  .citizen-dashboard-page.dark-theme .card h5,
  .citizen-dashboard-page.dark-theme .project-title,
  .citizen-dashboard-page.dark-theme .stat-value,
  .citizen-dashboard-page.dark-theme .contractor-name,
  .citizen-dashboard-page.dark-theme .report-item .title,
  .citizen-dashboard-page.dark-theme .pin-card h4,
  .citizen-dashboard-page.dark-theme .profile-name,
  .citizen-dashboard-page.dark-theme .mp-name,
  .citizen-dashboard-page.dark-theme .feed-left strong,
  .citizen-dashboard-page.dark-theme .feed-left,
  .citizen-dashboard-page.dark-theme .topbar-left,
  .citizen-dashboard-page.dark-theme .profile-role,
  .citizen-dashboard-page.dark-theme .mp-label,
  .citizen-dashboard-page.dark-theme .status-text,
  .citizen-dashboard-page.dark-theme .stat-title,
  .citizen-dashboard-page.dark-theme .stat-label,
  .citizen-dashboard-page.dark-theme .table-wrap table th,
  .citizen-dashboard-page.dark-theme .table-wrap table td {
    color: var(--text-main);
  }

  .citizen-dashboard-page.dark-theme .nav-item,
  .citizen-dashboard-page.dark-theme .help-meta,
  .citizen-dashboard-page.dark-theme .header-copy p,
  .citizen-dashboard-page.dark-theme .eyebrow,
  .citizen-dashboard-page.dark-theme .project-sub,
  .citizen-dashboard-page.dark-theme .contractor-meta,
  .citizen-dashboard-page.dark-theme .meta,
  .citizen-dashboard-page.dark-theme .location-chip,
  .citizen-dashboard-page.dark-theme .footer-bar,
  .citizen-dashboard-page.dark-theme .search-box input::placeholder,
  .citizen-dashboard-page.dark-theme .filter select,
  .citizen-dashboard-page.dark-theme .feed-left {
    color: var(--text-soft);
  }

  .citizen-dashboard-page.dark-theme .nav-item.active {
    background: var(--primary-soft);
    box-shadow: inset 0 0 0 1px rgba(139, 183, 255, 0.28);
  }

  .citizen-dashboard-page.dark-theme .search-box input,
  .citizen-dashboard-page.dark-theme .location-select,
  .citizen-dashboard-page.dark-theme .filter select {
    background: rgba(15, 23, 38, 0.8);
    color: var(--text-main);
  }

  .citizen-dashboard-page.dark-theme .feed-banner {
    background: rgba(18, 31, 44, 0.95);
    border-color: var(--border);
    color: var(--text-soft);
  }

  .citizen-dashboard-page.dark-theme .feed-banner .feed-left {
    color: var(--text-soft);
  }

  .citizen-dashboard-page.dark-theme .feed-banner strong,
  .citizen-dashboard-page.dark-theme .feed-banner .feed-area,
  .citizen-dashboard-page.dark-theme .feed-banner .feed-info-icon {
    color: var(--text-main);
  }

  .citizen-dashboard-page.dark-theme .feed-status {
    background: rgba(127, 224, 174, 0.12);
    border-color: rgba(127, 224, 174, 0.22);
    color: #7fe0ae;
  }

  .citizen-dashboard-page.dark-theme .feed-dot {
    background: #7fe0ae;
  }

  .citizen-dashboard-page.dark-theme .stat-card,
  .citizen-dashboard-page.dark-theme .map-panel,
  .citizen-dashboard-page.dark-theme .data-table,
  .citizen-dashboard-page.dark-theme .info-card,
  .citizen-dashboard-page.dark-theme .card {
    background: var(--card-bg);
    border: 1px solid var(--border);
  }

  .citizen-dashboard-page.dark-theme .info-card {
    background: var(--card-bg);
    border-color: var(--border);
    box-shadow: 0 8px 18px var(--shadow);
  }

  .citizen-dashboard-page.dark-theme .contractor-item,
  .citizen-dashboard-page.dark-theme .report-item {
    background: rgba(17, 31, 47, 0.9);
    border-color: var(--border);
    color: var(--text-main);
  }

  .citizen-dashboard-page.dark-theme .contractor-name,
  .citizen-dashboard-page.dark-theme .contractor-score strong,
  .citizen-dashboard-page.dark-theme .report-item .title,
  .citizen-dashboard-page.dark-theme .report-item .meta,
  .citizen-dashboard-page.dark-theme .contractor-meta,
  .citizen-dashboard-page.dark-theme .contractor-score,
  .citizen-dashboard-page.dark-theme .info-card h4 {
    color: var(--text-main);
  }

  .citizen-dashboard-page.dark-theme .report-item .status {
    background: rgba(127, 224, 174, 0.12);
    border-color: rgba(127, 224, 174, 0.26);
    color: #7fe0ae;
  }

  .citizen-dashboard-page.dark-theme .action-btn.primary {
    background: linear-gradient(135deg, #1d67b4, #265b97);
    border-color: #3e7cc7;
    color: #f6fbff;
  }

  .citizen-dashboard-page.dark-theme .action-btn.light {
    background: rgba(22, 35, 52, 0.9);
  }

  .citizen-dashboard-page.dark-theme .data-table,
  .citizen-dashboard-page.dark-theme .table-head,
  .citizen-dashboard-page.dark-theme .table-wrap table thead th,
  .citizen-dashboard-page.dark-theme .table-wrap table td,
  .citizen-dashboard-page.dark-theme .table-wrap table td strong,
  .citizen-dashboard-page.dark-theme .project-id,
  .citizen-dashboard-page.dark-theme .project-title,
  .citizen-dashboard-page.dark-theme .project-sub,
  .citizen-dashboard-page.dark-theme .mini-link,
  .citizen-dashboard-page.dark-theme .mini-link.secondary {
    background: rgba(17, 31, 47, 0.94);
    border-color: var(--border);
    color: var(--text-main);
  }

  .citizen-dashboard-page.dark-theme .table-wrap table thead {
    background: rgba(17, 29, 45, 0.96);
  }

  .citizen-dashboard-page.dark-theme .table-wrap table tbody tr {
    background: rgba(17, 26, 38, 0.6);
  }

  .citizen-dashboard-page.dark-theme .panel-top,
  .citizen-dashboard-page.dark-theme .table-head,
  .citizen-dashboard-page.dark-theme .map-legend,
  .citizen-dashboard-page.dark-theme .data-table,
  .citizen-dashboard-page.dark-theme .foot-panel,
  .citizen-dashboard-page.dark-theme .foot-panel .card,
  .citizen-dashboard-page.dark-theme .footer-bar {
    background: rgba(17, 31, 47, 0.92);
    border-color: var(--border);
    color: var(--text-main);
  }

  .citizen-dashboard-page.dark-theme .panel-title-wrap h2,
  .citizen-dashboard-page.dark-theme .table-head h3,
  .citizen-dashboard-page.dark-theme .foot-panel h5,
  .citizen-dashboard-page.dark-theme .foot-panel p,
  .citizen-dashboard-page.dark-theme .footer-bar,
  .citizen-dashboard-page.dark-theme .table-head select,
  .citizen-dashboard-page.dark-theme .export-btn,
  .citizen-dashboard-page.dark-theme .filter select,
  .citizen-dashboard-page.dark-theme .reset-btn,
  .citizen-dashboard-page.dark-theme .section-switch .switch-btn,
  .citizen-dashboard-page.dark-theme .legend-item,
  .citizen-dashboard-page.dark-theme .map-legend {
    color: var(--text-main);
  }

  .citizen-dashboard-page.dark-theme .table-head select,
  .citizen-dashboard-page.dark-theme .filter select,
  .citizen-dashboard-page.dark-theme .export-btn,
  .citizen-dashboard-page.dark-theme .reset-btn,
  .citizen-dashboard-page.dark-theme .section-switch .switch-btn {
    background: rgba(15, 23, 38, 0.8);
    border-color: var(--border);
  }

  .citizen-dashboard-page.dark-theme .report-item,
  .citizen-dashboard-page.dark-theme .contractor-item,
  .citizen-dashboard-page.dark-theme .report-list,
  .citizen-dashboard-page.dark-theme .contractor-list {
    border-color: var(--border);
  }

  .citizen-dashboard-page.dark-theme .citizen-theme-toggle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    background: rgba(20, 32, 46, 0.9);
    color: #ffd66d;
    font-size: 0.9rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  }

  .citizen-dashboard-page.dark-theme .map-pin .pin-card {
    background: rgba(15, 26, 37, 0.96);
    border-color: rgba(160, 187, 217, 0.24);
    color: var(--text-main);
  }

  .citizen-dashboard-page.dark-theme .pin-card .tag-row span,
  .citizen-dashboard-page.dark-theme .progress-bar span,
  .citizen-dashboard-page.dark-theme .legend-swatch {
    box-shadow: none;
  }

  .citizen-dashboard-page.dark-theme .pin-tip {
    border-top-color: rgba(15, 26, 37, 0.96);
  }

  .citizen-dashboard-page.dark-theme .mini-link,
  .citizen-dashboard-page.dark-theme .link-row a,
  .citizen-dashboard-page.dark-theme .mini-link.secondary {
    color: #8bb7ff;
  }

  .citizen-dashboard-page.dark-theme .footer-bar {
    border-color: var(--border);
  }

  .citizen-dashboard-page.dark-theme .section-switch .switch-btn.active {
    background: linear-gradient(135deg, #1d3d5d, #112c46) !important;
    color: #f4f9ff !important;
    border-color: rgba(139, 183, 255, 0.4) !important;
    box-shadow: inset 0 0 0 1px rgba(139, 183, 255, 0.18);
  }

  .citizen-dashboard-page.dark-theme .section-switch .switch-btn {
    background: rgba(17, 28, 40, 0.9);
    color: var(--text-soft);
    border-color: var(--border);
  }

  .citizen-dashboard-shell {
    display: flex;
    min-height: 100vh;
    background: #edf2f8;
  }

  .citizen-sidebar {
    width: 240px;
    background: #f4f7fb;
    border-right: 1px solid #dfe7f2;
    display: flex;
    flex-direction: column;
    padding: 18px 16px 14px;
    box-sizing: border-box;
    transition: width 0.25s ease, padding 0.25s ease;
    overflow: hidden;
  }

  .citizen-sidebar.collapsed {
    width: 70px;
    padding-left: 10px;
    padding-right: 10px;
  }

  .citizen-sidebar.collapsed .brand-main {
    width: 100%;
    justify-content: center;
  }

  .citizen-sidebar.collapsed .citizen-brand strong,
  .citizen-sidebar.collapsed .nav-item-label,
  .citizen-sidebar.collapsed .citizen-helpline,
  .citizen-sidebar.collapsed .help-label,
  .citizen-sidebar.collapsed .help-number,
  .citizen-sidebar.collapsed .help-meta,
  .citizen-sidebar.collapsed .help-pill {
    display: none;
  }

  .citizen-sidebar.collapsed .citizen-brand {
    justify-content: center;
    padding-bottom: 12px;
  }

  .citizen-sidebar.collapsed .nav-item {
    justify-content: center;
    padding-left: 6px;
    padding-right: 6px;
  }

  .citizen-sidebar.collapsed .nav-item .icon {
    font-size: 1.1rem;
  }

  .citizen-brand {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 6px 4px 16px;
    margin-bottom: 18px;
  }

  .brand-main {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .citizen-brand img {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    object-fit: cover;
    box-shadow: 0 4px 12px rgba(24, 45, 73, 0.12);
    flex-shrink: 0;
  }

  .citizen-brand strong {
    display: block;
    font-size: 1.5rem;
    line-height: 1;
    letter-spacing: 0.04em;
    color: #1f2b3d;
    font-weight: 800;
  }

  .sidebar-toggle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 1px solid #dfeaf6;
    background: #ffffff;
    color: #435a76;
    box-shadow: 0 6px 14px rgba(25, 57, 90, 0.06);
    cursor: pointer;
    font-size: 0.7rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    flex-shrink: 0;
  }

  .sidebar-toggle.open {
    transform: rotate(180deg);
  }

  .citizen-brand span {
    display: block;
    margin-top: 3px;
    font-size: 0.72rem;
    color: #72839a;
    letter-spacing: 0.04em;
  }

  .side-nav {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 10px;
    border-radius: 10px;
    color: #4d6176;
    font-size: 0.88rem;
    font-weight: 600;
    background: transparent;
    transition: 0.2s ease;
  }

  .nav-item.active {
    background: #eaf0f7;
    color: #1d2d40;
    box-shadow: inset 0 0 0 1px #dfe9f4;
  }

  .nav-item .icon {
    width: 18px;
    text-align: center;
    color: #576e88;
    font-size: 1rem;
  }

  .citizen-helpline {
    margin-top: auto;
    padding-top: 18px;
    border-top: 1px solid #dfe7f2;
    color: #4e5e73;
  }

  .help-label {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6d7f97;
    margin-bottom: 10px;
  }

  .help-number {
    font-size: 1.05rem;
    font-weight: 700;
    color: #1f2d3d;
    margin-bottom: 8px;
  }

  .help-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
    color: #52677f;
  }

  .help-pill {
    padding: 3px 6px;
    background: #edf2f9;
    border-radius: 999px;
    font-size: 0.7rem;
    color: #536981;
    border: 1px solid #dfe8f3;
  }

  .citizen-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .topbar {
    background: #f8fafd;
    border-bottom: 1px solid #dfe8f3;
    padding: 12px 18px 10px;
    display: grid;
    grid-template-columns: minmax(210px, 320px) minmax(280px, 1fr) auto;
    align-items: center;
    gap: 16px;
  }

  .topbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.82rem;
    color: #53677f;
    min-width: 0;
  }

  .location-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    min-width: 150px;
    border: 1px solid #dfe9f3;
    background: #ffffff;
    border-radius: 10px;
    font-weight: 600;
    font-size: 0.82rem;
  }

  .location-select {
    border: 1px solid #dfe9f3;
    background: #ffffff;
    border-radius: 10px;
    padding: 7px 10px;
    font-size: 0.8rem;
    color: #2d3d4f;
    font-weight: 600;
    outline: none;
  }

  .topbar-right {
    display: grid;
    grid-template-columns: auto minmax(280px, 1fr) auto auto;
    align-items: center;
    gap: 12px;
    justify-content: end;
    min-width: 0;
  }

  .search-box {
    position: relative;
    width: min(100%, 500px);
    justify-self: center;
  }

  .search-box input {
    width: 100%;
    border: 1px solid #dfe8f4;
    background: #fff;
    border-radius: 10px;
    padding: 9px 14px 9px 40px;
    color: #485f79;
    font-size: 0.82rem;
    outline: none;
    min-height: 42px;
  }

  .search-box .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6f869a;
    font-size: 1rem;
  }

  .mp-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border: 1px solid #dfeaf6;
    background: linear-gradient(135deg, #edf5ff 0%, #ffffff 100%);
    border-radius: 14px;
    box-shadow: 0 8px 18px rgba(25, 57, 90, 0.06);
    min-width: 170px;
  }

  .mp-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 9px;
    background: #123b5d;
    color: #fff;
    font-size: 0.66rem;
    font-weight: 800;
    letter-spacing: 0.04em;
  }

  .mp-meta {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
  }

  .mp-label {
    color: #5f7183;
    font-size: 0.6rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 700;
  }

  .mp-name {
    color: #1d2d42;
    font-size: 0.78rem;
    font-weight: 800;
  }

  .profile-menu {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .profile-panel {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border: 1px solid #dfeaf6;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    box-shadow: 0 6px 18px rgba(25, 57, 90, 0.05);
    cursor: pointer;
    padding: 0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .profile-panel:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(25, 57, 90, 0.09);
  }

  .profile-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #123b5d 0%, #2e6b9f 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 1.05rem;
    font-weight: 800;
  }

  .profile-chevron-button {
    width: 20px;
    height: 20px;
    border: 1px solid #dfeaf6;
    border-radius: 50%;
    background: #ffffff;
    color: #39506a;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.7rem;
    padding: 0;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 4px 10px rgba(25, 57, 90, 0.04);
  }

  .profile-chevron-button:hover {
    box-shadow: 0 8px 16px rgba(25, 57, 90, 0.08);
  }

  .profile-chevron-button.open {
    transform: rotate(180deg);
  }

  .profile-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 220px;
    background: rgba(17, 31, 47, 0.98);
    border: 1px solid rgba(162, 182, 210, 0.2);
    border-radius: 14px;
    box-shadow: 0 16px 40px rgba(2, 6, 12, 0.35);
    padding: 14px 12px 12px;
    color: #edf4ff;
    z-index: 30;
  }

  .profile-dropdown-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(162, 182, 210, 0.18);
    margin-bottom: 8px;
  }

  .profile-dropdown .profile-avatar {
    width: 30px;
    height: 30px;
    font-size: 0.62rem;
  }

  .profile-name {
    color: #edf4ff;
    font-size: 0.82rem;
    font-weight: 800;
    line-height: 1.2;
  }

  .profile-role {
    color: #c9d8ee;
    font-size: 0.68rem;
    font-weight: 600;
    line-height: 1.3;
  }

  .profile-detail-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 8px;
    font-size: 0.7rem;
    color: #dfeaff;
  }

  .profile-detail-list span {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    color: #c9d8ee;
  }

  .profile-detail-list strong {
    color: #edf4ff;
  }

  .profile-chevron {
    display: none;
  }

  .content {
    padding: 0 18px 20px;
    overflow: auto;
  }
  .feed-info-icon {
    font-size: 1rem;
    color: #1d3b5e;
    line-height: 1;
  }

  .feed-area {
    color: #1d2d42;
    font-weight: 700;
  }

  .feed-banner strong {
    color: #1e3850;
  }

  .feed-status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #2d785f;
    background: #edfaf3;
    border: 1px solid #d9f1e5;
    border-radius: 999px;
    padding: 5px 9px;
    font-weight: 700;
    white-space: nowrap;
  }

  .feed-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2d785f;
    display: inline-block;
  }

  .page-header {
    margin-top: 18px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 18px;
    padding-bottom: 12px;
    border-bottom: 1px solid #dde6f1;
  }

  .eyebrow {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
    color: #72839a;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 8px;
    font-weight: 700;
  }

  .eyebrow .divider {
    color: #adb7c4;
  }

  .page-header h1 {
    margin: 0;
    font-size: clamp(1.9rem, 2vw, 2.4rem);
    line-height: 1.1;
    color: #1d2d40;
    letter-spacing: -0.04em;
  }

  .page-header p {
    margin: 8px 0 0;
    max-width: 720px;
    color: #64778b;
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 0.82rem;
    font-weight: 700;
    border: 1px solid #dfeaf4;
    cursor: pointer;
  }

  .action-btn.light {
    background: #ffffff;
    color: #1d2d40;
    padding: 9px 14px;
    min-width: 150px;
  }

  .action-btn.primary {
    background: #0d2d4b;
    color: #ffffff;
    border-color: #0d2d4b;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
    margin-top: 18px;
  }

  .stat-card {
    background: #ffffff;
    border: 1px solid #dde7f3;
    border-radius: 12px;
    padding: 14px 16px 12px;
    box-shadow: 0 2px 0 rgba(15, 41, 66, 0.02);
  }

  .stat-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
  }

  .stat-title {
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #65788b;
  }

  .stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    background: #eef5ff;
    color: #1f3f68;
    font-size: 1.05rem;
  }

  .stat-icon.green {
    background: #edfaf3;
    color: #2d785f;
  }

  .stat-icon.red {
    background: #fff2f2;
    color: #c45a5a;
  }

  .stat-value-row {
    display: flex;
    align-items: end;
    gap: 6px;
  }

  .stat-value {
    font-size: 2.1rem;
    line-height: 1;
    font-weight: 800;
    letter-spacing: -0.05em;
    color: #182d42;
  }

  .stat-label {
    font-size: 0.72rem;
    color: #64788b;
    padding-bottom: 5px;
    font-weight: 600;
  }

  .stat-footer {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 12px;
    padding-top: 10px;
    border-top: 1px solid #e6edf5;
    font-size: 0.74rem;
    color: #63788b;
  }

  .stat-footer .on-track {
    color: #2d785f;
    font-weight: 700;
  }

  .stat-footer .delayed {
    color: #d04d4d;
    font-weight: 700;
  }

  .map-panel {
    margin-top: 18px;
    background: #ffffff;
    border: 1px solid #dee8f2;
    border-radius: 14px;
    overflow: hidden;
  }

  .panel-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 14px 16px;
    border-bottom: 1px solid #e3ebf4;
    background: #f9fbff;
  }

  .panel-title-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .panel-title-wrap h2 {
    margin: 0;
    font-size: 1.05rem;
    color: #1e3350;
  }

  .section-switch {
    display: inline-flex;
    background: #eef3fb;
    border-radius: 10px;
    padding: 3px;
    border: 1px solid #dde8f4;
  }

  .section-switch .switch-btn {
    border: none;
    background: transparent;
    color: #516780;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 0.77rem;
    font-weight: 700;
    cursor: pointer;
  }

  .section-switch .switch-btn.active {
    background: #0d2d4b;
    color: #fff;
  }

  .filter-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .filter {
    position: relative;
  }

  .filter select {
    appearance: none;
    background: #fff;
    border: 1px solid #dfeaf2;
    color: #2d3d52;
    border-radius: 9px;
    padding: 8px 30px 8px 12px;
    height: 34px;
    font-size: 0.74rem;
    font-weight: 600;
    outline: none;
  }

  .filter .caret {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #60748a;
    font-size: 0.9rem;
  }

  .reset-btn {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    border: 1px solid #dfeaf2;
    background: #fff;
    color: #516780;
  }

  .map-stage {
    position: relative;
    height: 425px;
    background: linear-gradient(180deg, #edf3f8 0%, #eef4f7 100%);
    overflow: hidden;
  }

  .map-stage svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }

  .map-pin {
    position: absolute;
    transform: translate(-50%, -100%);
    z-index: 2;
  }

  .pin-tip {
    width: 18px;
    height: 18px;
    background: #d93f3f;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 0 2px rgba(217, 63, 63, 0.14);
  }

  .pin-card {
    position: absolute;
    left: 24px;
    top: -18px;
    width: 260px;
    background: #fff;
    border: 1px solid #efc1c1;
    border-radius: 12px;
    box-shadow: 0 10px 24px rgba(24, 40, 60, 0.12);
    padding: 10px 10px 8px;
    font-size: 0.72rem;
    color: #495b72;
  }

  .pin-card .tag-row {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
    align-items: center;
  }

  .pin-card .red-tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 7px;
    background: #fff1f1;
    color: #d95d5d;
    border: 1px solid #efc8c8;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
  }

  .pin-card h4 {
    margin: 0 0 8px;
    font-size: 0.82rem;
    line-height: 1.3;
    color: #1d2d42;
  }

  .pin-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 10px;
    padding: 8px 0;
    border-top: 1px solid #e7edf5;
    border-bottom: 1px solid #e7edf5;
    margin-bottom: 8px;
  }

  .pin-meta strong {
    display: block;
    color: #1d2d42;
    font-size: 0.74rem;
  }

  .pin-progress {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
    font-size: 0.7rem;
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    border-radius: 999px;
    background: #edf1f7;
    overflow: hidden;
    margin-top: 6px;
  }

  .progress-bar > span {
    display: block;
    height: 100%;
    width: 48%;
    background: linear-gradient(90deg, #dd5d5d 0%, #efb0a5 100%);
    border-radius: inherit;
  }

  .pin-card .link-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
    color: #6c7f97;
  }

  .pin-card .link-row a {
    color: #143f64;
    font-weight: 700;
    text-decoration: none;
  }

  .map-legend {
    position: absolute;
    bottom: 12px;
    right: 12px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #dde8f3;
    border-radius: 10px;
    padding: 8px 10px;
    font-size: 0.7rem;
    color: #52677f;
  }

  .legend-item {
    display: inline-flex;
    align-items: center;
    gap: 7px;
  }

  .legend-swatch {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  .data-table {
    margin-top: 18px;
    background: #fff;
    border: 1px solid #dee8f2;
    border-radius: 14px;
    overflow: hidden;
  }

  .table-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
    border-bottom: 1px solid #e3ebf4;
    background: #f9fbff;
  }

  .table-head h3 {
    margin: 0;
    font-size: 1.08rem;
    color: #1d2d42;
  }

  .table-head .right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .table-head select {
    appearance: none;
    background: #fff;
    border: 1px solid #ddeaf4;
    border-radius: 9px;
    height: 34px;
    padding: 0 28px 0 10px;
    color: #4d5f77;
    font-size: 0.74rem;
    font-weight: 600;
  }

  .export-btn {
    border: 1px solid #ddeaf4;
    background: #fff;
    color: #1d2d42;
    border-radius: 9px;
    padding: 8px 11px;
    font-size: 0.74rem;
    font-weight: 700;
  }

  .table-wrap {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 980px;
  }

  th, td {
    padding: 12px 12px;
    border-bottom: 1px solid #edf2f8;
    text-align: left;
    vertical-align: top;
    font-size: 0.74rem;
    color: #495d75;
  }

  th {
    background: #f8fafe;
    color: #5c6e7f;
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-weight: 800;
  }

  .project-cell {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .project-id {
    font-weight: 800;
    color: #1d2d42;
  }

  .project-title {
    font-weight: 700;
    color: #3a536d;
  }

  .project-sub {
    color: #6d8197;
  }

  .pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 7px;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    border: 1px solid transparent;
  }

  .pill.delayed {
    background: #fff1f1;
    color: #c44848;
    border-color: #f2d0d1;
  }

  .pill.on-track {
    background: #effaf4;
    color: #2a7f5b;
    border-color: #d5eddf;
  }

  .pill.in-progress {
    background: #fff7eb;
    color: #b27a35;
    border-color: #f4e4c7;
  }

  .pill.under-review {
    background: #eef3ff;
    color: #486ea0;
    border-color: #d6e3fb;
  }

  .action-links {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .mini-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 7px 10px;
    border-radius: 8px;
    background: #edf4ff;
    color: #123b5d;
    text-decoration: none;
    font-weight: 800;
    font-size: 0.68rem;
    border: 1px solid #dfeaf6;
  }

  .mini-link.primary {
    background: linear-gradient(135deg, #123b5d 0%, #2e6b9f 100%);
    color: #fff;
    border-color: transparent;
  }

  .mini-link.secondary {
    color: #4c5d71;
  }

  .bottom-grid {
    display: grid;
    grid-template-columns: 1.35fr 1fr;
    gap: 18px;
    margin-top: 18px;
  }

  .info-card {
    background: #fff;
    border: 1px solid #dde7f2;
    border-radius: 14px;
    overflow: hidden;
  }

  .info-card .inner {
    padding: 14px 16px;
  }

  .info-card h4 {
    margin: 0;
    font-size: 0.98rem;
    color: #1d2d42;
  }

  .contractor-list,
  .report-list {
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .contractor-item,
  .report-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    border: 1px solid #ecf0f6;
    border-radius: 10px;
    padding: 10px 10px;
    background: #fbfcff;
  }

  .contractor-name {
    font-weight: 700;
    color: #1d2d42;
  }

  .contractor-meta {
    color: #677e96;
    font-size: 0.7rem;
    margin-top: 4px;
  }

  .contractor-score {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    color: #4a6179;
  }

  .contractor-score strong {
    font-size: 1rem;
    color: #1d2d42;
  }

  .report-item .title {
    font-weight: 700;
    color: #1d2d42;
    margin-bottom: 4px;
  }

  .report-item .meta {
    color: #6d8197;
    font-size: 0.7rem;
  }

  .report-item .status {
    font-size: 0.7rem;
    font-weight: 700;
    color: #2d785f;
    background: #edfaf3;
    border: 1px solid #d6eddc;
    border-radius: 999px;
    padding: 4px 7px;
    white-space: nowrap;
  }

  .foot-panel {
    margin-top: 18px;
    background: #fff;
    border: 1px solid #dde7f2;
    border-radius: 14px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    overflow: hidden;
  }

  .foot-panel .card {
    padding: 16px 18px;
    border-right: 1px solid #edf2f8;
  }

  .foot-panel .card:last-child {
    border-right: none;
  }

  .foot-panel h5 {
    margin: 0 0 10px;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #6b7a8d;
  }

  .foot-panel p {
    margin: 0;
    color: #53677f;
    line-height: 1.5;
    font-size: 0.76rem;
  }

  .footer-bar {
    margin-top: 18px;
    border-top: 1px solid #dfe8f4;
    padding-top: 14px;
    display: flex;
    justify-content: space-between;
    gap: 20px;
    align-items: center;
    color: #64809a;
    font-size: 0.74rem;
  }

  @media (max-width: 1180px) {
    .citizen-sidebar {
      width: 200px;
    }

    .stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .bottom-grid,
    .foot-panel {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 880px) {
    .citizen-dashboard-shell {
      flex-direction: column;
    }

    .citizen-sidebar {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #dfe7f2;
    }

    .page-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .topbar {
      flex-wrap: wrap;
    }

    .search-box {
      width: 100%;
    }
  }
`;

const navItems = [
  { label: 'Home', icon: '⌂', to: '/citizen' },
  { label: 'Projects', icon: '▣', to: '/citizen/projects' },
  { label: 'Contractors', icon: '▤', to: '/citizen/contractors' },
  { label: 'Reports & Feedback', icon: '✎', to: '/citizen/feedback' },
];

const areaOptions = [
  'Ludhiana, Punjab',
  'Sahnewal Block',
  'Gill Rural',
  'Civil Lines Zone',
  'Ward 12',
];

const stats = [
  { title: 'Ongoing Projects', value: '24', label: 'Active Works', footer: ['17 on track', '7 delayed'], tone: 'on-track', icon: '◫' },
  { title: 'Completed Works', value: '58', label: 'Delivered', footer: ['Expenditure Verified:', '₹38.40 Cr'], tone: 'neutral', icon: '✓' },
  { title: 'Delayed Projects', value: '07', label: 'Past Target', footer: ['Avg Delay: 4.2 mos', '₹8.90 Cr at risk'], tone: 'delayed', icon: '!' },
  { title: 'Citizen Reports', value: '13', label: 'Active Queries', footer: ['9 under inquiry', '4 resolved (May)'], tone: 'on-track', icon: '⚑' },
];

const tableRows = [
  {
    id: 'PB-LDH-2023-041',
    projectId: 'MPLADS-2025-0142',
    title: 'Rural Road Improvement: Gill Rd to NH44 Link',
    area: 'Gill Rural & Industrial',
    contractor: 'Satluj Infra Ltd',
    budget: '₹1.28 Cr',
    progress: '48%',
    target: '72%',
    status: 'Delayed',
    statusClass: 'delayed',
    actions: ['View', 'Report'],
  },
  {
    id: 'PB-LDH-2023-072',
    projectId: 'MPLADS-2025-0187',
    title: 'Senior Secondary School Upgrade',
    area: 'Model Town',
    contractor: 'Apex Builders',
    budget: '₹64.5 Lakh',
    progress: '85%',
    target: '90%',
    status: 'On Track',
    statusClass: 'on-track',
    actions: ['View', 'Report'],
  },
  {
    id: 'PB-LDH-2023-118',
    projectId: 'MPLADS-2025-0211',
    title: 'Drinking Water Reservoir & Pipeline',
    area: 'Ward 24',
    contractor: 'Doaba Water Tech',
    budget: '₹42.5 Lakh',
    progress: '52%',
    target: '70%',
    status: 'Delayed',
    statusClass: 'delayed',
    actions: ['View', 'Report'],
  },
  {
    id: 'PB-LDH-2023-221',
    projectId: 'MPLADS-2025-0410',
    title: 'Community Health Centre Diagnostic Wing',
    area: 'Sahnewal Block',
    contractor: 'Sahnewal Block',
    budget: '₹92.0 Lakh',
    progress: '90%',
    target: '94%',
    status: 'In Progress',
    statusClass: 'in-progress',
    actions: ['View', 'Report'],
  },
  {
    id: 'PB-LDH-2023-301',
    projectId: 'MPLADS-2025-0317',
    title: 'High-Efficiency Solar & LED Lighting',
    area: 'Civil Lines Zone',
    contractor: 'GreenGrid Power',
    budget: '₹31.2 Lakh',
    progress: '15%',
    target: '30%',
    status: 'Under Review',
    statusClass: 'under-review',
    actions: ['View', 'Report'],
  },
];

const contractorList = [
  { name: 'Satluj Infrastructure Pvt. Ltd', score: '58 / 100', meta: 'Delayed & Inquiry' },
  { name: 'Apex Builders & Engineers', score: '88 / 100', meta: 'Verified & Compliant' },
  { name: 'Doaba Water Tech Systems', score: '52 / 100', meta: 'Under Review' },
];

const publicReports = [
  { title: 'Road Work Disrupted Near NH44', meta: 'Reported 08 Apr 2024', status: 'Open' },
  { title: 'Water Supply Issue in Ward 24', meta: 'Reported 04 Apr 2024', status: 'Investigating' },
  { title: 'Municipal Lighting not Operational', meta: 'Reported 09 May 2024', status: 'Resolved' },
];

function CitizenDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState('Ludhiana, Punjab');
  const [searchText, setSearchText] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const { theme } = useCitizenTheme();

  const handleDownloadReport = () => {
    const reportText = `TRINETRA Public Transparency Report\nArea: ${selectedArea}\nDate: ${new Date().toLocaleDateString('en-IN')}\n\nThis is a frontend prototype report generated locally for demonstration purposes.`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'trinetra-transparency-report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`citizen-dashboard-page ${theme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <style>{dashboardStyles}</style>

      <div className="citizen-dashboard-shell">
        <aside className={`citizen-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="citizen-brand">
            <div className="brand-main">
              <img src="/trinetra-logo.jpg" alt="TRINETRA logo" />
              <div>
                <strong>TRINETRA</strong>
              </div>
            </div>

            <button
              type="button"
              className={`sidebar-toggle ${sidebarCollapsed ? '' : 'open'}`}
              aria-label={sidebarCollapsed ? 'Open sidebar' : 'Close sidebar'}
              aria-expanded={!sidebarCollapsed}
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              {sidebarCollapsed ? '›' : '‹'}
            </button>
          </div>

          <nav className="side-nav" aria-label="Sidebar navigation">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;

              return (
                <Link key={item.label} to={item.to} className={`nav-item ${isActive ? 'active' : ''}`}>
                  <span className="icon">{item.icon}</span>
                  <span className="nav-item-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="citizen-helpline">
            <div className="help-label">Citizen Helpline</div>
            <div className="help-number">1800-11-2024</div>
            <div className="help-meta">
              <span>Toll-Free • 09:00 - 18:00 IST</span>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="help-pill">English</span>
              <span className="help-pill">हिंदी</span>
              <span className="help-pill">NIC Compliant</span>
            </div>
          </div>
        </aside>

        <main className="citizen-main">
          <header className="topbar">
            <div className="topbar-left">
              <div className="location-chip">📍 Ludhiana, Punjab</div>
              <button className="action-btn light" type="button">Change Area</button>
            </div>

            <div className="topbar-right">
              <CitizenThemeToggle />

              <div className="search-box">
                <span className="search-icon">⌕</span>
                <input type="text" placeholder="Search projects, locations or project IDs" />
              </div>

              <div className="mp-card">
                <span className="mp-badge">MP</span>
                <div className="mp-meta">
                  <span className="mp-label">Current MP</span>
                  <span className="mp-name">Ravneet Singh Bittu</span>
                </div>
              </div>

              <div className="profile-panel-wrap" style={{ position: 'relative' }}>
                <div className="profile-menu">
                  <button
                    className="profile-panel"
                    type="button"
                    aria-label="User profile"
                    onClick={() => setProfileOpen(false)}
                  >
                    <div className="profile-avatar">👤</div>
                  </button>

                  <button
                    type="button"
                    className={`profile-chevron-button ${profileOpen ? 'open' : ''}`}
                    aria-label={profileOpen ? 'Close account details' : 'Open account details'}
                    aria-expanded={profileOpen}
                    onClick={() => setProfileOpen((prev) => !prev)}
                  >
                    ▾
                  </button>
                </div>

                {profileOpen && (
                  <div className="profile-dropdown" role="menu" aria-label="User account details">
                    <div className="profile-dropdown-header">
                      <div className="profile-avatar">👤</div>
                      <div>
                        <div className="profile-name">Ludhiana Guest</div>
                        <div className="profile-role">Citizen ID: PB-07-1042</div>
                      </div>
                    </div>

                    <div className="profile-detail-list">
                      <span><label>Area</label><strong>Ludhiana</strong></span>
                      <span><label>State</label><strong>Punjab</strong></span>
                      <span><label>Role</label><strong>Citizen</strong></span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="content">
            <section className="page-header">
              <div>
                <div className="eyebrow">
                  <span>NIC-MPLADS Oversight Portal</span>
                  <span className="divider">•</span>
                  <span>Constituency Code: PB-07</span>
                </div>
                <h1>Ludhiana Parliamentary Constituency</h1>
                <p>
                  Real-time citizen monitoring ledger for MPLADS sanctioned works, fiscal disbursals,
                  site geotagging, and contractor accountability.
                </p>
              </div>

              <div className="header-actions">
                <button className="action-btn light" type="button" onClick={handleDownloadReport}>
                  ⬇ Download Transparency Report (PDF)
                </button>
                <button className="action-btn primary" type="button" onClick={() => navigate('/citizen/report')}>
                  ⚑ Report an Issue / Work Anomaly
                </button>
              </div>
            </section>

            <section className="stats-grid">
              {stats.map((card) => (
                <div key={card.title} className="stat-card">
                  <div className="stat-head">
                    <div className="stat-title">{card.title}</div>
                    <div className={`stat-icon ${card.tone === 'delayed' ? 'red' : card.tone === 'on-track' ? 'green' : ''}`}>
                      {card.icon}
                    </div>
                  </div>

                  <div className="stat-value-row">
                    <div className="stat-value">{card.value}</div>
                    <div className="stat-label">{card.label}</div>
                  </div>

                  <div className="stat-footer">
                    {card.footer.map((entry, index) => (
                      <span key={`${card.title}-${index}`} className={index === 0 && card.tone === 'delayed' ? 'delayed' : index === 0 && card.tone === 'on-track' ? 'on-track' : ''}>
                        {entry}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>

            <section className="data-table">
              <div className="table-head">
                <h3>Ongoing Projects in Ludhiana</h3>
                <div className="right">
                  <div className="filter">
                    <select defaultValue="Sort by: Progress Gap (Highest First)">
                      <option>Sort by: Progress Gap (Highest First)</option>
                      <option>Sort by: Highest Budget</option>
                      <option>Sort by: Expected Completion</option>
                    </select>
                    <span className="caret">▾</span>
                  </div>
                  <button className="export-btn" type="button">Export CSV</button>
                </div>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Project Identifier &amp; Work Details</th>
                      <th>Executing Agency &amp; Contractor</th>
                      <th>Sanctioned Budget</th>
                      <th>Execution Progress</th>
                      <th>Target Completion</th>
                      <th>Status</th>
                      <th>Transparency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableRows.map((row) => (
                      <tr key={row.id}>
                        <td>
                          <div className="project-cell">
                            <span className="project-id">{row.id}</span>
                            <span className="project-title">{row.title}</span>
                            <span className="project-sub">{row.area}</span>
                          </div>
                        </td>
                        <td>
                          <div className="project-cell">
                            <span className="project-title">{row.contractor}</span>
                            <span className="project-sub">Primary Agency</span>
                          </div>
                        </td>
                        <td>
                          <div className="project-cell">
                            <span className="project-title">{row.budget}</span>
                            <span className="project-sub">Status: Verified</span>
                          </div>
                        </td>
                        <td>
                          <div className="project-cell">
                            <span className="project-title">{row.progress}</span>
                            <span className="project-sub">Planned: {row.target}</span>
                          </div>
                        </td>
                        <td>
                          <div className="project-cell">
                            <span className="project-title">{row.target}</span>
                            <span className="project-sub">Expected: 2024</span>
                          </div>
                        </td>
                        <td>
                          <span className={`pill ${row.statusClass}`}>{row.status}</span>
                        </td>
                        <td>
                          <div className="action-links">
                            {row.actions.map((action) => {
                              const isView = action === 'View';
                              if (isView) {
                                return (
                                  <Link key={action} to={`/citizen/projects/${row.projectId}`} className="mini-link primary">
                                    {action}
                                  </Link>
                                );
                              }
                              return (
                                <a key={action} href="#" className="mini-link secondary">{action}</a>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bottom-grid">
              <div className="info-card">
                <div className="inner">
                  <h4>Contractor Transparency</h4>
                  <div className="contractor-list">
                    {contractorList.map((person) => (
                      <div key={person.name} className="contractor-item">
                        <div>
                          <div className="contractor-name">{person.name}</div>
                          <div className="contractor-meta">{person.meta}</div>
                        </div>
                        <div className="contractor-score">
                          <strong>{person.score}</strong>
                          <span>score</span>
                          <Link to={`/citizen/contractors/${encodeURIComponent(person.name)}`} className="mini-link primary" style={{ marginTop: '6px' }}>
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="info-card">
                <div className="inner">
                  <h4>Recent Public Reports</h4>
                  <div className="report-list">
                    {publicReports.map((report) => (
                      <div key={report.title} className="report-item">
                        <div>
                          <div className="title">{report.title}</div>
                          <div className="meta">{report.meta}</div>
                        </div>
                        <div className="status">{report.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="foot-panel">
              <div className="card">
                <h5>Sanctioned Project Info</h5>
                <p>
                  Ongoing &amp; sanctioned works projects in Ludhiana are tracked with public data, contractor verification,
                  and updated progress transparency for citizens.
                </p>
              </div>

              <div className="card">
                <h5>Public Archives</h5>
                <p>
                  Certified work completion status, geotagged implementation updates, and verified dashboard records are
                  archived monthly for public review and audit.
                </p>
              </div>
            </section>

            <section className="map-panel">
              <div className="panel-top">
                <div className="panel-title-wrap">
                  <span style={{ color: '#1d3b5e', fontSize: '1.1rem' }}>⌖</span>
                  <h2>Area Infrastructure Map</h2>
                </div>

                <div className="section-switch">
                  <button className="switch-btn active" type="button">Map View</button>
                  <button className="switch-btn" type="button">List View</button>
                </div>

                <div className="filter-row">
                  <div className="filter">
                    <select defaultValue="All Sectors (24)">
                      <option>All Sectors (24)</option>
                      <option>Roads &amp; Connectivity</option>
                      <option>Water &amp; Sanitation</option>
                    </select>
                    <span className="caret">▾</span>
                  </div>

                  <div className="filter">
                    <select defaultValue="All Execution Statuses">
                      <option>All Execution Statuses</option>
                      <option>On Track (17)</option>
                      <option>Delayed / Behind (7)</option>
                    </select>
                    <span className="caret">▾</span>
                  </div>

                  <div className="filter">
                    <select defaultValue="All Blocks &amp; Wards">
                      <option>All Blocks &amp; Wards</option>
                      <option>Ludhiana West</option>
                      <option>Sahnewal Rural Block</option>
                    </select>
                    <span className="caret">▾</span>
                  </div>

                  <button className="reset-btn" type="button" aria-label="Reset filters">↺</button>
                </div>
              </div>

              <div className="map-stage">
                <svg viewBox="0 0 1000 420" preserveAspectRatio="none" aria-hidden="true">
                  <defs>
                    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
                      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#ccd9ea" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="1000" height="420" fill="url(#grid)" opacity="0.5" />
                  <path d="M-20 150 C150 170, 260 240, 500 250 S840 230, 1040 270" stroke="#8ab2d5" strokeWidth="9" fill="none" opacity="0.55" />
                  <path d="M120 0 L450 220 L860 420" stroke="#d4deea" strokeWidth="12" fill="none" />
                  <path d="M-40 300 L440 220 L980 170" stroke="#d4deea" strokeWidth="8" fill="none" />
                  <path d="M420 220 L360 420" stroke="#d4deea" strokeWidth="8" fill="none" />
                  <text x="340" y="185" fontSize="12" fill="#6b8197" fontWeight="700">SIDHWAN CANAL BRANCH</text>
                  <text x="560" y="310" fontSize="11" fill="#6f7f97" fontWeight="700" transform="rotate(35 560 310)">NH-44 (GT ROAD) TO DELHI</text>
                  <text x="200" y="260" fontSize="11" fill="#6f7f97" fontWeight="700" transform="rotate(-10 200 260)">FEROZEPUR ROAD (NH-5)</text>
                  <text x="440" y="172" fontSize="11" fill="#616f80" fontWeight="700">LUDHIANA CENTRAL</text>
                  <text x="170" y="120" fontSize="11" fill="#617086" fontWeight="700">CIVIL LINES ZONE</text>
                  <text x="180" y="330" fontSize="11" fill="#617086" fontWeight="700">MODEL TOWN / MODEL GRAM</text>
                  <text x="760" y="180" fontSize="11" fill="#617086" fontWeight="700">SAHNEWAL BLOCK</text>
                  <text x="300" y="390" fontSize="11" fill="#617086" fontWeight="700">GILL RURAL CIRCLE</text>
                </svg>

                <div style={{ position: 'absolute', left: '20px', top: '20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.92)', border: '1px solid #dfe9f4', borderRadius: '10px', padding: '8px 10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ fontWeight: '800', color: '#1d2d42', fontSize: '0.7rem' }}>N</div>
                    <div style={{ fontSize: '1rem', color: '#304763' }}>⤢</div>
                  </div>
                  <div style={{ borderLeft: '1px solid #dfe9f4', paddingLeft: '8px', fontSize: '0.7rem', color: '#5d7389' }}>
                    <div>Scale: 1:25,000</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <span style={{ display: 'inline-block', width: '40px', height: '3px', background: '#1d2d42', borderRadius: '999px' }} />
                      <span>2.0 km</span>
                    </div>
                  </div>
                </div>

                <div className="map-pin" style={{ left: '46%', top: '58%' }}>
                  <div className="pin-card">
                    <div className="tag-row">
                      <span className="red-tag">Delayed • 24% Behind</span>
                      <span>ID: PB-LDH-2023-041</span>
                    </div>
                    <h4>Rural Road Improvement: Gill Rd to NH44 Link</h4>
                    <div className="pin-meta">
                      <div>
                        <span>Sanctioned:</span>
                        <strong>₹1.28 Cr (MPLADS)</strong>
                      </div>
                      <div>
                        <span>Contractor:</span>
                        <strong>Satluj Infra Ltd</strong>
                      </div>
                    </div>
                    <div className="pin-progress">
                      <span>Actual Progress: <strong>48%</strong></span>
                      <span>Planned: <strong>72%</strong></span>
                    </div>
                    <div className="progress-bar"><span /></div>
                    <div className="link-row">
                      <span>3 Citizen Reports</span>
                      <a href="#">Inspect Details →</a>
                    </div>
                  </div>
                  <div className="pin-tip" />
                </div>

                <div className="map-legend">
                  <span className="legend-item"><span className="legend-swatch" style={{ background: '#1d2d42' }} />On Track</span>
                  <span className="legend-item"><span className="legend-swatch" style={{ background: '#d96c51' }} />Delayed / Stalled</span>
                  <span className="legend-item"><span className="legend-swatch" style={{ background: '#7aa4d1' }} />Public Report</span>
                </div>
              </div>
            </section>

            <footer className="footer-bar">
              <div>Official state monitoring dashboard for MPLADS projects.</div>
              <div>Portal • 24x7 citizen oversight data</div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CitizenDashboard;