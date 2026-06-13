/**
 * Sidebar Component
 * Notion-style navigation sidebar with workspace management
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ROUTES from '../../routes/routes';
import mockDb from '../../utils/mockDb';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('smartspend_theme');
    const isDark = savedTheme ? savedTheme === 'dark' : true;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const isActive = (path: string): boolean => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('smartspend_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('smartspend_theme', 'light');
    }
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all mock data to original defaults? This will erase custom expenses.')) {
      mockDb.reset();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Workspace Profile Header */}
      <div className="sidebar-header" onClick={() => window.location.href = ROUTES.PROFILE}>
        <div className="workspace-icon">S</div>
        <div className="workspace-info">
          <span className="workspace-title">Omkar's Workspace</span>
          <span className="workspace-role">SmartSpend Pro</span>
        </div>
      </div>

      {/* Notion Search Simulator */}
      <div className="sidebar-search-container">
        <div className="sidebar-search-box" onClick={() => alert('Search workspace: Type keyword to filter database.')}>
          <span>🔍</span>
          <span>Search workspace...</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav">
        <div className="nav-section-title">Workspace</div>
        <ul className="nav-list">
          <li>
            <Link
              to={ROUTES.DASHBOARD}
              className={`nav-link ${isActive(ROUTES.DASHBOARD) ? 'active' : ''}`}
            >
              <span className="nav-link-emoji">📊</span>
              <span>Dashboard</span>
            </Link>
          </li>

          <li>
            <Link
              to={ROUTES.EXPENSES}
              className={`nav-link ${isActive(ROUTES.EXPENSES) ? 'active' : ''}`}
            >
              <span className="nav-link-emoji">💸</span>
              <span>Expenses</span>
            </Link>
          </li>

          <li>
            <Link
              to={ROUTES.BUDGETS}
              className={`nav-link ${isActive(ROUTES.BUDGETS) ? 'active' : ''}`}
            >
              <span className="nav-link-emoji">📈</span>
              <span>Budgets</span>
            </Link>
          </li>

          <li>
            <Link
              to={ROUTES.CATEGORIES}
              className={`nav-link ${isActive(ROUTES.CATEGORIES) ? 'active' : ''}`}
            >
              <span className="nav-link-emoji">🏷️</span>
              <span>Categories</span>
            </Link>
          </li>
        </ul>

        <div className="nav-section-title">Integrations</div>
        <ul className="nav-list">
          <li>
            <Link
              to={ROUTES.EMAILS}
              className={`nav-link ${isActive(ROUTES.EMAILS) ? 'active' : ''}`}
            >
              <span className="nav-link-emoji">📧</span>
              <span>Emails Inbox</span>
            </Link>
          </li>

          <li>
            <Link
              to={ROUTES.GMAIL}
              className={`nav-link ${isActive(ROUTES.GMAIL) ? 'active' : ''}`}
            >
              <span className="nav-link-emoji">📨</span>
              <span>Gmail Setup</span>
            </Link>
          </li>

          <li>
            <Link
              to={ROUTES.INSIGHTS}
              className={`nav-link ${isActive(ROUTES.INSIGHTS) ? 'active' : ''}`}
            >
              <span className="nav-link-emoji">🤖</span>
              <span>AI Insights</span>
            </Link>
          </li>
        </ul>

        <div className="nav-divider" />

        <div className="nav-section-title">Account</div>
        <ul className="nav-list">
          <li>
            <Link
              to={ROUTES.PROFILE}
              className={`nav-link ${isActive(ROUTES.PROFILE) ? 'active' : ''}`}
            >
              <span className="nav-link-emoji">👤</span>
              <span>Profile</span>
            </Link>
          </li>

          <li>
            <Link
              to={ROUTES.SETTINGS}
              className={`nav-link ${isActive(ROUTES.SETTINGS) ? 'active' : ''}`}
            >
              <span className="nav-link-emoji">⚙️</span>
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Sidebar Footer Controls */}
      <div className="sidebar-footer">
        <button className="sidebar-footer-btn" onClick={toggleTheme}>
          <span>{isDarkMode ? '☀️' : '🌙'}</span>
          <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="sidebar-footer-btn" onClick={handleResetData} style={{ color: 'var(--accent-red)' }}>
          <span>🔄</span>
          <span>Reset Database</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
