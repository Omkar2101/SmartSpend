/**
 * Home Page Component
 * Landing page with a clean Notion-like authentication layout
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { SignInButton, useUser } from '../components/common/MockAuth';
import ROUTES from '../routes/routes';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const { isSignedIn } = useUser();

  // Auto-redirect signed-in users to dashboard
  if (isSignedIn) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-hero">
          <span className="home-logo">💰</span>
          <h1>SmartSpend</h1>
          <p>Your AI-Powered Expense Management Workspace</p>
          
          <div className="home-features">
            <div className="feature">
              <span className="feature-icon">📊</span>
              <div className="feature-content">
                <h3>Interactive Dashboard</h3>
                <p>Track metrics, view transaction histories, and analyze monthly spend totals.</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">📨</span>
              <div className="feature-content">
                <h3>Gmail Integration Emulator</h3>
                <p>Sync mock email receipts from your inbox and automatically extract expenses using AI.</p>
              </div>
            </div>
            <div className="feature">
              <span className="feature-icon">🤖</span>
              <div className="feature-content">
                <h3>AI Finance Analyst</h3>
                <p>Chat with a simulated financial agent to get tailored budget advice and trends.</p>
              </div>
            </div>
          </div>

          <div className="home-cta">
            <SignInButton />
            <p>Sandbox mode: click to log in instantly with a mock profile</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
