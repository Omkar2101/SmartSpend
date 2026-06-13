/**
 * Main Layout Component
 * Layout for authenticated users with navigation sidebar
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/layout/Navigation';
import Sidebar from '../components/layout/Sidebar';
import './MainLayout.css';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  // Sync dark mode class on initial render from localStorage
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('smartspend_theme');
    const isDark = savedTheme ? savedTheme === 'dark' : true;
    if (isDark) {
      document.documentElement.classList.add('dark');
      if (!savedTheme) {
        localStorage.setItem('smartspend_theme', 'dark');
      }
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="main-layout">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main-content">
        <Navigation 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          isSidebarOpen={sidebarOpen} 
        />
        <div className="main-content-scrollable">
          <div className="page-container">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
