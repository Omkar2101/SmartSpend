/**
 * Categories Page Component
 * Workspace tags and categories management panel
 */

import React, { useState, useEffect } from 'react';
import mockDb, { type MockCategory } from '../../utils/mockDb';
import { useInvoices } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './CategoriesPage.css';

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Drinks': 'orange',
  'Transportation': 'blue',
  'Hosting & Cloud': 'purple',
  'Software Tools': 'pink',
  'Shopping': 'yellow',
  'Utilities': 'gray',
};

const COLOR_PALETTE = ['gray', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'red'];

export const CategoriesPage: React.FC = () => {
  const { data: invoices, isLoading: loadingInvoices, refetch } = useInvoices();
  
  const [categories, setCategories] = useState<MockCategory[]>([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState('gray');
  const [newCatBudget, setNewCatBudget] = useState('5000');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadCategories = () => {
    setCategories(mockDb.getCategories());
  };

  useEffect(() => {
    loadCategories();
  }, [invoices]);

  if (loadingInvoices) {
    return <LoadingSpinner text="Counting transaction categories..." />;
  }

  // Calculate invoice counts per category
  const categoryCounts: Record<string, number> = {};
  invoices?.forEach(inv => {
    const category = inv.category || 'Uncategorized';
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const name = newCatName.trim();
    if (!name) {
      setErrorMsg('Category name is required');
      return;
    }

    const budget = parseFloat(newCatBudget);
    if (isNaN(budget) || budget <= 0) {
      setErrorMsg('Please enter a valid monthly budget limit');
      return;
    }

    try {
      mockDb.addCategory({
        name,
        color: newCatColor,
        budget
      });

      loadCategories();
      setNewCatName('');
      setNewCatBudget('5000');
      setNewCatColor('gray');
      setSuccessMsg(`Category "${name}" created successfully`);
      setTimeout(() => setSuccessMsg(''), 3000);
      refetch(); // Invalidate react query cache
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create category');
    }
  };

  const handleDeleteCategory = (name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"? Expenses under this category will display as Uncategorized.`)) {
      try {
        mockDb.deleteCategory(name);
        loadCategories();
        setSuccessMsg(`Category "${name}" deleted`);
        setTimeout(() => setSuccessMsg(''), 3000);
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="page-container">
      <div className="categories-page">
        <div className="page-header">
          <div>
            <h1>🏷️ Workspace Categories</h1>
            <p className="page-header-desc">
              Manage transaction categorization tags and allocation boundaries
            </p>
          </div>
        </div>

        {errorMsg && (
          <Alert
            type="error"
            message={errorMsg}
            onClose={() => setErrorMsg('')}
          />
        )}

        {successMsg && (
          <Alert
            type="success"
            message={successMsg}
            onClose={() => setSuccessMsg('')}
          />
        )}

        <div className="categories-grid">
          {categories.map((cat) => {
            const count = categoryCounts[cat.name] || 0;
            const colorKey = cat.color || CATEGORY_COLORS[cat.name] || 'gray';

            return (
              <div key={cat.name} className="category-card">
                <div>
                  <div className="category-card-header">
                    <div className="category-badge-wrapper">
                      <span className={`notion-tag notion-tag-${colorKey}`}>
                        {cat.name}
                      </span>
                    </div>
                    <span className="category-count">{count} items</span>
                  </div>
                  
                  <div style={{ marginTop: '12px' }}>
                    <p className="category-budget-text">
                      Monthly allocation limit: <strong>₹{cat.budget.toLocaleString('en-IN')}</strong>
                    </p>
                  </div>
                </div>

                <button 
                  className="category-delete-btn"
                  onClick={() => handleDeleteCategory(cat.name)}
                >
                  Delete Tag
                </button>
              </div>
            );
          })}
        </div>

        {/* Create new category form panel */}
        <div className="create-category-panel">
          <h3>Create New Category Tag</h3>
          <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            <div className="form-group">
              <label>Tag Name</label>
              <input
                type="text"
                placeholder="e.g., Office Supplies, Subscriptions"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Monthly Budget Limit (₹)</label>
              <input
                type="number"
                placeholder="5000"
                value={newCatBudget}
                onChange={(e) => setNewCatBudget(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Tag Color</label>
              <div className="color-option-grid">
                {COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-radio-btn notion-tag notion-tag-${color} ${newCatColor === color ? 'selected' : ''}`}
                    onClick={() => setNewCatColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" style={{ marginTop: '8px' }}>
              Create Tag
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;