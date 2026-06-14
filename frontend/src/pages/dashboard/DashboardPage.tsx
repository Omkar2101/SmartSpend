/**
 * Dashboard Page Component
 * Notion-style dashboard showing expense overview, budget progress, and integrations
 */

import React from 'react';
import { useCurrentUser, useExpenseStats, useInvoices } from '../../hooks/useApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { Link } from 'react-router-dom';
import ROUTES from '../../routes/routes';
import { useAuth } from "@clerk/clerk-react";
import './DashboardPage.css';

// Map categories to accent colors
const CATEGORY_COLORS: Record<string, string> = {
  'Food & Drinks': 'var(--accent-orange)',
  'Transportation': 'var(--accent-blue)',
  'Hosting & Cloud': 'var(--accent-purple)',
  'Software Tools': 'var(--accent-pink)',
  'Shopping': 'var(--accent-yellow)',
  'Utilities': 'var(--accent-gray)',
};

export const DashboardPage: React.FC = () => {
  const { data: user, isLoading: userLoading, error: userError } = useCurrentUser();
  const { data: stats, isLoading: statsLoading } = useExpenseStats();
   const { getToken } = useAuth();
  const syncEmails = async () => {
    const token = await getToken();
    console.log("token going to backend:",token);
    

    await fetch(
        "http://localhost:5000/api/v1/emails/sync",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};
  const { data: invoices, isLoading: invoicesLoading } = useInvoices(
    {},
    { page: 1, limit: 5 }
  );

  if (userLoading || statsLoading || invoicesLoading) {
    return <LoadingSpinner text="Loading your workspace dashboard..." />;
  }

  if (userError) {
    return (
      <div className="page-container">
        <Alert
          type="error"
          message="Failed to load workspace information. Please try resetting the database."
        />
      </div>
    );
  }

  // Get total budget from static default categories
  const totalBudget = 40000; // sum of categories budget: 8k + 4k + 12k + 5k + 6k + 3k
  const currentMonthSpend = stats?.monthlyExpenses || 0;
  const budgetPercentage = Math.min(Math.round((currentMonthSpend / totalBudget) * 100), 100);

  return (
    <div className="page-container">
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name || 'Omkar'}! 👋</h1>
          <p className="page-header-desc">Here is the spending summary for your current workspace</p>
        </div>

        {/* Callout Info Banner */}
        <div className="notion-callout">
          <span className="notion-callout-emoji">🎯</span>
          <div className="notion-callout-text">
            <strong>Monthly Budget Alert:</strong> You have consumed ₹{currentMonthSpend.toFixed(2)} of your total monthly budget of ₹{totalBudget}. You are at <strong>{budgetPercentage}%</strong> of your allocation limit.
          </div>
        </div>

        {/* Metrics Row */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Lifetime Spend</h3>
            <p className="stat-value">
              ₹ {stats?.totalExpenses?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>

          <div className="stat-card">
            <h3>This Month's Spending</h3>
            <p className="stat-value">
              ₹ {stats?.monthlyExpenses?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>

          <div className="stat-card">
            <h3>Active Budget Categories</h3>
            <p className="stat-value">
              {stats?.categoriesBreakdown
                ? Object.keys(stats.categoriesBreakdown).length
                : 0}
            </p>
          </div>

          <div className="stat-card">
            <h3>Expense Transactions</h3>
            <p className="stat-value">{invoices?.length || 0}</p>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="dashboard-sections">
          
          {/* Category Breakdown (Progress bars) */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Category Breakdown</h2>
              <Link to={ROUTES.CATEGORIES}>Manage Categories</Link>
            </div>
            <div className="category-breakdown">
              {stats?.categoriesBreakdown && Object.keys(stats.categoriesBreakdown).length > 0 ? (
                Object.entries(stats.categoriesBreakdown).map(([category, amount]) => {
                  // Standard budget limits (fallback)
                  const categoryLimits: Record<string, number> = {
                    'Food & Drinks': 8000,
                    'Transportation': 4000,
                    'Hosting & Cloud': 12000,
                    'Software Tools': 5000,
                    'Shopping': 6000,
                    'Utilities': 3000
                  };
                  const budget = categoryLimits[category] || 5000;
                  const ratio = Math.min((amount / budget) * 100, 100);
                  const color = CATEGORY_COLORS[category] || 'var(--accent-blue)';

                  return (
                    <div key={category} className="category-item">
                      <div className="category-item-info">
                        <span className="category-name">{category}</span>
                        <span className="category-amount">
                          ₹{amount.toFixed(2)} <span style={{ opacity: 0.5, fontWeight: 400 }}>/ ₹{budget}</span>
                        </span>
                      </div>
                      <div className="category-bar-bg">
                        <div 
                          className="category-bar-fill"
                          style={{
                            width: `${ratio}%`,
                            backgroundColor: color
                          }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="empty-state">No category metrics calculated yet.</p>
              )}
            </div>
          </div>

          {/* Recent Expenses List */}
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Expenses</h2>
              <Link to={ROUTES.EXPENSES_NEW}>+ Add Expense</Link>
            </div>
            <div className="recent-expenses">
              {invoices && invoices.length > 0 ? (
                <table className="expenses-table">
                  <thead>
                    <tr>
                      <th>Vendor</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.slice(0, 5).map((invoice) => (
                      <tr key={invoice.id}>
                        <td>
                          <Link to={`${ROUTES.EXPENSES}/${invoice.id}`}>
                            {invoice.vendor}
                          </Link>
                        </td>
                        <td>
                          <span 
                            className="notion-tag"
                            style={{
                              backgroundColor: `${CATEGORY_COLORS[invoice.category || ''] || 'var(--accent-blue)'}14`,
                              color: CATEGORY_COLORS[invoice.category || ''] || 'var(--accent-blue)',
                              border: `1px solid ${CATEGORY_COLORS[invoice.category || ''] || 'var(--accent-blue)'}30`
                            }}
                          >
                            {invoice.category || 'Uncategorized'}
                          </span>
                        </td>
                        <td className="amount">
                          ₹{invoice.totalAmount.toFixed(2)}
                        </td>
                        <td style={{ color: 'var(--text-secondary)' }}>
                          {new Date(invoice.invoiceDate || invoice.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="empty-state">
                  No expense records in workspace.{' '}
                  <Link to={ROUTES.EXPENSES_NEW}>Create your first entry</Link>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic CTA Cards using Notion colored banners */}
        <div className="dashboard-cta">
          <div className="cta-card cta-card-purple">
            <h3>🤖 AI Financial Analyst</h3>
            <p>Get immediate advice on how to reduce software costs and optimize your food budgets.</p>
            <Link to={ROUTES.INSIGHTS} className="cta-link">
              Ask AI Agent →
            </Link>
          </div>

          <div className="cta-card cta-card-blue">
            <h3>📨 Gmail Sync Agent</h3>
            <p>Automatically import and parse bills directly from your inbox using secure email sync.</p>
            <Link to={ROUTES.GMAIL} className="cta-link">
              Manage Gmail Integration →
            </Link>
          </div>
           <div className="cta-card cta-card-blue">
            <h3>📨 Gmail Sync Agent</h3>
            <p>Automatically import and parse bills directly from your inbox using secure email sync.</p>
           <button onClick={syncEmails}>
            Sync Gmail
           </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
