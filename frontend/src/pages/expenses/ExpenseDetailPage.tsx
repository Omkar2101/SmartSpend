/**
 * Expense Detail Page Component
 * Detailed view of an individual expense transaction
 */

import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInvoice } from '../../hooks/useApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import ROUTES from '../../routes/routes';
import './ExpenseDetailPage.css';

// Map categories to color keywords
const CATEGORY_COLORS: Record<string, string> = {
  'Food & Drinks': 'orange',
  'Transportation': 'blue',
  'Hosting & Cloud': 'purple',
  'Software Tools': 'pink',
  'Shopping': 'yellow',
  'Utilities': 'gray',
};

export const ExpenseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoice, isLoading, error } = useInvoice(id || null);

  if (isLoading) {
    return <LoadingSpinner text="Retrieving receipt details..." />;
  }

  if (error || !invoice) {
    return (
      <div className="page-container">
        <Alert
          type="error"
          message="Failed to retrieve expense. The record may have been deleted."
        />
        <Button variant="secondary" onClick={() => navigate(ROUTES.EXPENSES)}>
          Back to list
        </Button>
      </div>
    );
  }

  const categoryName = invoice.category || 'Uncategorized';
  const colorKey = CATEGORY_COLORS[categoryName] || 'gray';

  return (
    <div className="page-container">
      <div className="expense-detail">
        <div className="detail-header">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🧾</span> {invoice.vendor}
            </h1>
            <p className="page-header-desc">Detailed metadata and raw text for this invoice</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to={`${ROUTES.EXPENSES}/${invoice.id}/edit`}>
              <Button variant="primary">Edit Details</Button>
            </Link>
            <Button variant="secondary" onClick={() => navigate(ROUTES.EXPENSES)}>
              ← Back to list
            </Button>
          </div>
        </div>

        <div className="detail-card">
          <div className="properties-list">
            
            {/* Amount */}
            <div className="property-row">
              <span className="property-label">💵 Total Amount</span>
              <span className="property-value amount">
                ₹{invoice.totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Category */}
            <div className="property-row">
              <span className="property-label">🏷️ Category</span>
              <span className="property-value">
                <span className={`notion-tag notion-tag-${colorKey}`}>
                  {categoryName}
                </span>
              </span>
            </div>

            {/* Date */}
            <div className="property-row">
              <span className="property-label">📅 Date</span>
              <span className="property-value" style={{ color: 'var(--text-secondary)' }}>
                {invoice.invoiceDate
                  ? new Date(invoice.invoiceDate).toLocaleDateString()
                  : new Date(invoice.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Invoice Number */}
            <div className="property-row">
              <span className="property-label">🔢 Invoice Number</span>
              <span className="property-value" style={{ fontFamily: 'monospace', fontSize: '13px' }}>
                {invoice.invoiceNumber || '—'}
              </span>
            </div>

            {/* Database entry timestamp */}
            <div className="property-row">
              <span className="property-label">🕒 Logged At</span>
              <span className="property-value" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                {new Date(invoice.createdAt).toLocaleString()}
              </span>
            </div>

          </div>

          {/* Raw Text Notes */}
          {invoice.rawText && (
            <div className="receipt-section">
              <h3>Raw receipt / Invoice text</h3>
              <div className="raw-text">{invoice.rawText}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailPage;
