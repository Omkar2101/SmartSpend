/**
 * Expenses Page Component
 * List all workspace expenses with live search and category badges
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useInvoices, useDeleteInvoice } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ROUTES from '../../routes/routes';
import './ExpensesPage.css';

// Map categories to color keywords
const CATEGORY_COLORS: Record<string, string> = {
  'Food & Drinks': 'orange',
  'Transportation': 'blue',
  'Hosting & Cloud': 'purple',
  'Software Tools': 'pink',
  'Shopping': 'yellow',
  'Utilities': 'gray',
};

export const ExpensesPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: '',
    vendor: '',
  });
  
  const { data: invoices, isLoading, error } = useInvoices(filters);
  const deleteInvoice = useDeleteInvoice();
  const [successMessage, setSuccessMessage] = useState('');

  if (isLoading) {
    return <LoadingSpinner text="Loading expenses list..." />;
  }

  if (error) {
    return (
      <div className="page-container">
        <Alert
          type="error"
          message="Failed to load expenses database."
        />
      </div>
    );
  }

  const handleDelete = async (invoiceId: string) => {
    if (confirm('Are you sure you want to delete this expense record from the workspace?')) {
      try {
        await deleteInvoice.mutateAsync(invoiceId);
        setSuccessMessage('Expense deleted successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        console.error('Error deleting expense:', err);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="expenses-page">
        <div className="page-header">
          <div>
            <h1>💸 Expenses</h1>
            <p className="page-header-desc">Database containing all workspace receipts and charges</p>
          </div>
          <Link to={ROUTES.EXPENSES_NEW}>
            <Button variant="primary">+ Add Expense</Button>
          </Link>
        </div>

        {successMessage && (
          <Alert
            type="success"
            message={successMessage}
            onClose={() => setSuccessMessage('')}
          />
        )}

        {/* Filter bar */}
        <div className="filters-section">
          <input
            type="text"
            placeholder="🔍 Filter by vendor..."
            value={filters.vendor}
            onChange={(e) =>
              setFilters({ ...filters, vendor: e.target.value })
            }
            className="filter-input"
          />
          <input
            type="text"
            placeholder="🏷️ Filter by category..."
            value={filters.category}
            onChange={(e) =>
              setFilters({ ...filters, category: e.target.value })
            }
            className="filter-input"
          />
        </div>

        {/* Table of expenses */}
        <div className="expenses-list">
          {invoices && invoices.length > 0 ? (
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => {
                  const categoryName = invoice.category || 'Uncategorized';
                  const colorKey = CATEGORY_COLORS[categoryName] || 'gray';

                  return (
                    <tr key={invoice.id}>
                      <td>
                        <Link to={`${ROUTES.EXPENSES}/${invoice.id}`} style={{ fontWeight: 600 }}>
                          {invoice.vendor}
                        </Link>
                      </td>
                      <td>
                        <span className={`notion-tag notion-tag-${colorKey}`}>
                          {categoryName}
                        </span>
                      </td>
                      <td className="amount">
                        ₹ {invoice.totalAmount.toFixed(2)}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {invoice.invoiceDate
                          ? new Date(invoice.invoiceDate).toLocaleDateString()
                          : new Date(invoice.createdAt).toLocaleDateString()}
                      </td>
                      <td className="actions" style={{ justifyContent: 'flex-end' }}>
                        <Link to={`${ROUTES.EXPENSES}/${invoice.id}/edit`}>
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(invoice.id)}
                          isLoading={deleteInvoice.isPending}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No transactions match your search filter.</p>
              <Link to={ROUTES.EXPENSES_NEW}>
                <Button variant="primary">Add Your First Expense</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpensesPage;
