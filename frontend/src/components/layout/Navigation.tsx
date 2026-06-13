/**
 * Navigation Component
 * Top breadcrumb navigation bar with sidebar toggle and user button
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton } from '../common/MockAuth';
import ROUTES from '../../routes/routes';
import './Navigation.css';

interface NavigationProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const location = useLocation();
  const path = location.pathname;

  // Generate breadcrumb links based on path
  const getBreadcrumbs = () => {
    const items = [{ label: 'SmartSpend', path: ROUTES.DASHBOARD }];

    if (path.startsWith(ROUTES.DASHBOARD)) {
      items.push({ label: 'Dashboard', path: ROUTES.DASHBOARD });
    } else if (path.startsWith('/expenses')) {
      items.push({ label: 'Expenses', path: ROUTES.EXPENSES });
      if (path.endsWith('/new')) {
        items.push({ label: 'New Expense', path: ROUTES.EXPENSES_NEW });
      } else if (path.endsWith('/edit')) {
        items.push({ label: 'Edit Expense', path: path });
      } else if (path !== ROUTES.EXPENSES) {
        items.push({ label: 'Details', path: path });
      }
    } else if (path.startsWith(ROUTES.BUDGETS)) {
      items.push({ label: 'Budgets', path: ROUTES.BUDGETS });
    } else if (path.startsWith(ROUTES.CATEGORIES)) {
      items.push({ label: 'Categories', path: ROUTES.CATEGORIES });
    } else if (path.startsWith(ROUTES.EMAILS)) {
      items.push({ label: 'Emails Inbox', path: ROUTES.EMAILS });
    } else if (path.startsWith('/integrations')) {
      items.push({ label: 'Integrations', path: ROUTES.GMAIL });
      if (path.includes('gmail')) {
        items.push({ label: 'Gmail Setup', path: ROUTES.GMAIL });
      }
    } else if (path.startsWith(ROUTES.INSIGHTS)) {
      items.push({ label: 'AI Insights', path: ROUTES.INSIGHTS });
    } else if (path.startsWith(ROUTES.PROFILE)) {
      items.push({ label: 'Profile', path: ROUTES.PROFILE });
    } else if (path.startsWith(ROUTES.SETTINGS)) {
      items.push({ label: 'Settings', path: ROUTES.SETTINGS });
    }

    return items;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="navigation">
      <div className="nav-left">
        {/* Toggle Sidebar button */}
        <button
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isSidebarOpen ? '◀' : '▶'}
        </button>

        {/* Dynamic Breadcrumbs */}
        <div className="breadcrumbs">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.path + index}>
              {index > 0 && <span className="breadcrumb-separator">/</span>}
              <Link
                to={item.path}
                className={`breadcrumb-item ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="nav-right">
        {/* Mock Notification Bell */}
        <button 
          className="nav-notify-btn"
          onClick={() => alert('No new notifications. Your workspace is up to date!')}
          title="Notifications"
        >
          🔔
        </button>

        {/* Mock User Button */}
        <UserButton />
      </div>
    </header>
  );
};

export default Navigation;
