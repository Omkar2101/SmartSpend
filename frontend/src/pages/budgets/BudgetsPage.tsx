/**
 * Budgets Page Component
 * Workspace budget limit management with reactive progress bars
 */

import React, { useState, useEffect } from 'react';
import mockDb, { type MockCategory } from '../../utils/mockDb';
import { useInvoices, useExpenseStats } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './BudgetsPage.css';

// Map categories to color keywords
const CATEGORY_COLORS: Record<string, string> = {
  'Food & Drinks': 'var(--accent-orange)',
  'Transportation': 'var(--accent-blue)',
  'Hosting & Cloud': 'var(--accent-purple)',
  'Software Tools': 'var(--accent-pink)',
  'Shopping': 'var(--accent-yellow)',
  'Utilities': 'var(--accent-gray)',
};

const CATEGORY_EMOJIS: Record<string, string> = {
  'Food & Drinks': '🍔',
  'Transportation': '🚗',
  'Hosting & Cloud': '☁️',
  'Software Tools': '🛠️',
  'Shopping': '🛒',
  'Utilities': '🔌',
};

export const BudgetsPage: React.FC = () => {
  const { data: invoices, isLoading: loadingInvoices, refetch } = useInvoices();
  const { data: stats, isLoading: loadingStats } = useExpenseStats();
  
  const [categories, setCategories] = useState<MockCategory[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editLimitValue, setEditLimitValue] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch categories from mockDb
  const loadCategories = () => {
    setCategories(mockDb.getCategories());
  };

  useEffect(() => {
    loadCategories();
  }, [invoices]);

  if (loadingInvoices || loadingStats) {
    return <LoadingSpinner text="Calculating budget consumption..." />;
  }

  // Calculate spent amounts for each category
  const categorySpends: Record<string, number> = {};
  invoices?.forEach(inv => {
    const category = inv.category || 'Uncategorized';
    categorySpends[category] = (categorySpends[category] || 0) + inv.totalAmount;
  });

  const handleStartEdit = (cat: MockCategory) => {
    setEditingCategory(cat.name);
    setEditLimitValue(cat.budget.toString());
  };

  const handleSaveEdit = (categoryName: string) => {
    const limit = parseFloat(editLimitValue);
    if (isNaN(limit) || limit <= 0) {
      alert('Please enter a valid budget limit');
      return;
    }
    
    try {
      mockDb.updateCategoryBudget(categoryName, limit);
      loadCategories();
      setEditingCategory(null);
      setSuccessMsg(`Budget for "${categoryName}" updated successfully`);
      setTimeout(() => setSuccessMsg(''), 3000);
      refetch(); // Invalidate cache
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="budgets-page">
        <div className="page-header">
          <div>
            <h1>📈 Monthly Budgets</h1>
            <p className="page-header-desc">
              Manage allocations and spending boundaries for active expense categories
            </p>
          </div>
        </div>

        {successMsg && (
          <Alert
            type="success"
            message={successMsg}
            onClose={() => setSuccessMsg('')}
          />
        )}

        <div className="notion-callout">
          <span className="notion-callout-emoji">💡</span>
          <div className="notion-callout-text">
            <strong>Budget Tip:</strong> Limits are evaluated monthly. Try adjusting limits to control SaaS tool subscriptions and travel costs.
          </div>
        </div>

        <div className="budgets-grid">
          {categories.map((cat) => {
            const spent = categorySpends[cat.name] || 0;
            const percentage = cat.budget > 0 ? Math.round((spent / cat.budget) * 100) : 0;
            const barFillWidth = Math.min(percentage, 100);
            const isOver = spent > cat.budget;
            const color = CATEGORY_COLORS[cat.name] || 'var(--accent-blue)';
            const emoji = CATEGORY_EMOJIS[cat.name] || '🏷️';

            return (
              <div key={cat.name} className="budget-card">
                <div className="budget-card-header">
                  <span className="budget-category-title">
                    <span>{emoji}</span> {cat.name}
                  </span>
                  
                  <div className="budget-progress-numbers">
                    <strong>₹{spent.toFixed(2)}</strong> spent / 
                    <span style={{ color: 'var(--text-secondary)' }}> ₹{cat.budget} limit</span>
                  </div>
                </div>

                {/* Progress bar indicator */}
                <div className="budget-progress-bar-container">
                  <div 
                    className="budget-progress-bar-fill"
                    style={{
                      width: `${barFillWidth}%`,
                      backgroundColor: isOver ? 'var(--accent-red)' : color
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                  {/* Overbudget warning tag */}
                  <div>
                    {isOver ? (
                      <span className="budget-warning">
                        ⚠️ Over limit by ₹{(spent - cat.budget).toFixed(2)}!
                      </span>
                    ) : (
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {percentage}% consumed ({100 - percentage}% remaining)
                      </span>
                    )}
                  </div>

                  {/* Inline Editor */}
                  {editingCategory === cat.name ? (
                    <div className="budget-edit-form">
                      <input
                        type="number"
                        className="budget-edit-input"
                        value={editLimitValue}
                        onChange={(e) => setEditLimitValue(e.target.value)}
                        placeholder="Limit"
                      />
                      <Button variant="primary" size="sm" onClick={() => handleSaveEdit(cat.name)}>
                        Save
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => setEditingCategory(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => handleStartEdit(cat)}>
                      Change Limit
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BudgetsPage;
