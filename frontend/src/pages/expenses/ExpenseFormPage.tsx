/**
 * Expense Form Page Component
 * Create or edit an expense entry in the workspace
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInvoice, useCreateInvoice, useUpdateInvoice } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ROUTES from '../../routes/routes';
import type { CreateInvoiceRequest } from '../../types';
import mockDb from '../../utils/mockDb';
import './ExpenseFormPage.css';

export const ExpenseFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const { data: invoice, isLoading } = useInvoice(isEditMode ? id || null : null);
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();

  const [formData, setFormData] = useState<CreateInvoiceRequest>({
    vendor: '',
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    totalAmount: 0,
    currency: 'INR',
    category: '',
    rawText: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  // Load active categories from mock DB
  useEffect(() => {
    const list = mockDb.getCategories().map(c => c.name);
    setCategoriesList(list);
    
    // Set default category if empty
    if (list.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: list[0] }));
    }
  }, []);

  // Update form data when invoice finishes loading in Edit mode
  useEffect(() => {
    if (invoice) {
      setFormData({
        vendor: invoice.vendor || '',
        invoiceNumber: invoice.invoiceNumber || '',
        invoiceDate: invoice.invoiceDate || new Date(invoice.createdAt).toISOString().split('T')[0],
        totalAmount: invoice.totalAmount || 0,
        currency: invoice.currency || 'INR',
        category: invoice.category || (categoriesList[0] || 'Uncategorized'),
        rawText: invoice.rawText || '',
      });
    }
  }, [invoice, categoriesList]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.vendor.trim()) {
      setError('Vendor field is required');
      return;
    }

    if (formData.totalAmount <= 0) {
      setError('Total amount must be greater than zero');
      return;
    }

    try {
      if (isEditMode && id) {
        await updateInvoice.mutateAsync({
          invoiceId: id,
          data: formData,
        });
        setSuccess('Expense updated successfully');
      } else {
        await createInvoice.mutateAsync(formData);
        setSuccess('Expense created successfully');
      }

      setTimeout(() => {
        navigate(ROUTES.EXPENSES);
      }, 1200);
    } catch (err) {
      setError('Failed to save expense. Please check input parameters.');
      console.error(err);
    }
  };

  if (isLoading && isEditMode) {
    return <LoadingSpinner text="Retrieving expense details for editing..." />;
  }

  return (
    <div className="page-container">
      <div className="expense-form-page">
        <div className="page-header">
          <div>
            <h1>{isEditMode ? '📝 Edit Expense' : '➕ Add Expense'}</h1>
            <p className="page-header-desc">
              {isEditMode ? 'Modify metadata for this transaction entry' : 'Log a new payment receipt inside the workspace'}
            </p>
          </div>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}

        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        )}

        <form onSubmit={handleSubmit} className="expense-form">
          
          {/* Vendor Name */}
          <div className="form-group">
            <label htmlFor="vendor">Vendor Name *</label>
            <input
              type="text"
              id="vendor"
              required
              value={formData.vendor}
              onChange={(e) =>
                setFormData({ ...formData, vendor: e.target.value })
              }
              placeholder="e.g., Starbucks Coffee, Amazon Web Services, Uber"
            />
          </div>

          <div className="form-row">
            {/* Invoice Number */}
            <div className="form-group">
              <label htmlFor="invoiceNumber">Invoice Number / ID</label>
              <input
                type="text"
                id="invoiceNumber"
                value={formData.invoiceNumber || ''}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceNumber: e.target.value })
                }
                placeholder="e.g., INV-00421"
              />
            </div>

            {/* Invoice Date */}
            <div className="form-group">
              <label htmlFor="invoiceDate">Transaction Date</label>
              <input
                type="date"
                id="invoiceDate"
                value={formData.invoiceDate || ''}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-row">
            {/* Total Amount */}
            <div className="form-group">
              <label htmlFor="totalAmount">Total Amount (₹) *</label>
              <input
                type="number"
                id="totalAmount"
                required
                step="0.01"
                min="0.01"
                value={formData.totalAmount || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalAmount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0.00"
              />
            </div>

            {/* Currency Choice */}
            <div className="form-group">
              <label htmlFor="currency">Currency Code</label>
              <select
                id="currency"
                value={formData.currency || 'INR'}
                onChange={(e) =>
                  setFormData({ ...formData, currency: e.target.value })
                }
              >
                <option>INR</option>
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
          </div>

          {/* Category Selector */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.category || ''}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="Uncategorized">Uncategorized</option>
            </select>
          </div>

          {/* Notes / Raw Text */}
          <div className="form-group">
            <label htmlFor="rawText">Description & Notes</label>
            <textarea
              id="rawText"
              value={formData.rawText || ''}
              onChange={(e) =>
                setFormData({ ...formData, rawText: e.target.value })
              }
              placeholder="Paste raw invoice text, items list, or transaction receipts details here..."
              rows={4}
            ></textarea>
          </div>

          {/* Form Controls */}
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(ROUTES.EXPENSES)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createInvoice.isPending || updateInvoice.isPending}
            >
              {isEditMode ? 'Update Record' : 'Save Record'}
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ExpenseFormPage;
