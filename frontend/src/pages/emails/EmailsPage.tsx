/**
 * Emails Page Component
 * Sync mock transactions inbox and extract bills/receipts dynamically using AI simulation
 */

import React, { useState } from 'react';
import { useEmailMessages, useProcessEmailMessage, useSyncGmailEmails, useGmailConnection } from '../../hooks/useApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';
import { Link } from 'react-router-dom';
import ROUTES from '../../routes/routes';
import './EmailsPage.css';

export const EmailsPage: React.FC = () => {
  const { data: messages, isLoading: loadingMessages, refetch } = useEmailMessages();
  const { data: gmailConnection } = useGmailConnection();
  const processEmail = useProcessEmailMessage();
  const syncEmails = useSyncGmailEmails();
  
  const [successMsg, setSuccessMsg] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleProcessEmail = async (msgId: string) => {
    setProcessingId(msgId);
    try {
      await processEmail.mutateAsync(msgId);
      setSuccessMsg('Receipt processed! New expense added to workspace.');
      setTimeout(() => setSuccessMsg(''), 4000);
      refetch();
    } catch (err) {
      console.error(err);
      alert('Failed to parse receipts from email');
    } finally {
      setProcessingId(null);
    }
  };

  const handleSyncEmails = async () => {
    try {
      await syncEmails.mutateAsync();
      setSuccessMsg('Gmail inbox sync complete. Checked for unread bills.');
      setTimeout(() => setSuccessMsg(''), 3000);
      refetch();
    } catch (err: any) {
      alert(err.message || 'Failed to sync Gmail inbox');
    }
  };

  if (loadingMessages) {
    return <LoadingSpinner text="Connecting to synced mail inbox..." />;
  }

  const isConnected = !!gmailConnection;

  return (
    <div className="page-container">
      <div className="emails-page">
        <div className="emails-header-actions">
          <div>
            <h1>📧 Email Receipts Inbox</h1>
            <p className="page-header-desc">
              Extract invoices and bills directly from synced merchant transaction emails
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              variant="primary"
              onClick={handleSyncEmails}
              isLoading={syncEmails.isPending}
              disabled={!isConnected}
            >
              🔄 Sync Inbox
            </Button>
            <Link to={ROUTES.GMAIL}>
              <Button variant="secondary">Configure Sync</Button>
            </Link>
          </div>
        </div>

        {successMsg && (
          <Alert
            type="success"
            message={successMsg}
            onClose={() => setSuccessMsg('')}
          />
        )}

        {!isConnected && (
          <div className="notion-callout" style={{ backgroundColor: 'var(--accent-yellow-bg)', borderColor: 'var(--accent-yellow)' }}>
            <span className="notion-callout-emoji">⚠️</span>
            <div className="notion-callout-text">
              <strong>Gmail Sync Agent Inactive:</strong> Connect your Google account in the <Link to={ROUTES.GMAIL}>Gmail Setup panel</Link> to sync receipts.
            </div>
          </div>
        )}

        {messages && messages.length > 0 ? (
          <div className="emails-list">
            {messages.map((msg) => (
              <div key={msg.id} className="email-card">
                <div className="email-card-header">
                  <div>
                    <h3 className="email-subject">{msg.subject || 'No Subject'}</h3>
                    <span className="email-sender">From: {msg.sender || 'Unknown'}</span>
                  </div>
                  
                  {/* Status Indicator */}
                  <span className={`notion-tag notion-tag-${msg.processed ? 'green' : 'blue'}`}>
                    {msg.processed ? 'Processed' : 'Unprocessed'}
                  </span>
                </div>

                {/* Snippet body */}
                <p className="email-snippet">{msg.snippet || 'No preview available'}</p>

                <div className="email-footer">
                  <span className="email-date">
                    Received: {msg.receivedAt ? new Date(msg.receivedAt).toLocaleString() : 'Unknown date'}
                  </span>
                  
                  <div className="email-action-area">
                    {!msg.processed ? (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleProcessEmail(msg.id)}
                        isLoading={processingId === msg.id}
                      >
                        🤖 Extract Expense
                      </Button>
                    ) : (
                      <span style={{ color: 'var(--accent-green)', fontWeight: 500, fontSize: '13px' }}>
                        ✓ Added to Expenses
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No transaction emails synced in workspace.</p>
            <Button variant="primary" onClick={handleSyncEmails} disabled={!isConnected}>
              Sync Inbox
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailsPage;