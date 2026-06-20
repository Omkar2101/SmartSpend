/**
 * Emails Page Component
 * Real email inbox from the database — synced from Gmail via the backend
 */

import React from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { useEmailMessages, useGmailConnection } from '../../hooks/useApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';
import ROUTES from '../../routes/routes';
import './EmailsPage.css';

export const EmailsPage: React.FC = () => {
  const { data: messages, isLoading: loadingMessages, refetch } = useEmailMessages();
  const { data: gmailConnection } = useGmailConnection();
  const { getToken } = useAuth();
  const [isSyncing, setIsSyncing] = React.useState(false);

  const isConnected = !!gmailConnection;

  const handleSyncEmails = async () => {
    setIsSyncing(true);
    const toastId = toast.loading('Syncing Gmail inbox…');
    try {
      const token = await getToken();
      const res = await fetch('http://localhost:5000/api/v1/emails/sync', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message || `Server error (${res.status})`);
      }
      const body = await res.json();
      const { fetched = 0, inserted = 0 } = body?.data ?? {};
      toast.success(
        `Sync complete — ${inserted} new email${inserted !== 1 ? 's' : ''} imported (${fetched} fetched).`,
        { id: toastId, duration: 5000, icon: '📨' }
      );
      refetch();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sync failed. Please try again.';
      toast.error(message, { id: toastId, duration: 6000 });
    } finally {
      setIsSyncing(false);
    }
  };

  const processExpense = async (emailId: string) => {
    const toastId = toast.loading("Processing expense...");
    try {
      const token = await getToken();
      await fetch(
        `http://localhost:5000/api/v1/expenses/process/${emailId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Processing enqueued!", { id: toastId });
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Failed to process", { id: toastId });
    }
  };


  if (loadingMessages) {
    return <LoadingSpinner text="Loading your email inbox…" />;
  }

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
              isLoading={isSyncing}
              disabled={!isConnected || isSyncing}
            >
              🔄 Sync Inbox
            </Button>
            <Link to={ROUTES.GMAIL}>
              <Button variant="secondary">Configure Sync</Button>
            </Link>
          </div>
        </div>

        {!isConnected && (
          <div className="notion-callout" style={{ backgroundColor: 'var(--accent-yellow-bg)', borderColor: 'var(--accent-yellow)' }}>
            <span className="notion-callout-emoji">⚠️</span>
            <div className="notion-callout-text">
              <strong>Gmail Sync Agent Inactive:</strong> Connect your Google account in the{' '}
              <Link to={ROUTES.GMAIL}>Gmail Setup panel</Link> to sync receipts.
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

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`notion-tag notion-tag-${
                      msg.processingStatus === 'PROCESSED' || msg.processed ? 'green' :
                      msg.processingStatus === 'PROCESSING' ? 'yellow' :
                      msg.processingStatus === 'FAILED' ? 'red' : 'blue'
                    }`}>
                      {msg.processingStatus === 'PROCESSED' || msg.processed ? 'Processed' :
                       msg.processingStatus === 'PROCESSING' ? 'Processing...' :
                       msg.processingStatus === 'FAILED' ? 'Failed' : 'Unprocessed'}
                    </span>
                    {msg.processingStatus !== 'PROCESSED' && msg.processingStatus !== 'PROCESSING' && !msg.processed && (
                      <button
                        className="btn-process-expense"
                        onClick={() => processExpense(msg.gmailMessageId || msg.id)}
                      >
                        {msg.processingStatus === 'FAILED' ? 'Retry' : 'Process'}
                      </button>
                    )}
                  </div>
                </div>

                <p className="email-snippet">{msg.snippet || 'No preview available'}</p>

                <div className="email-footer">
                  <span className="email-date">
                    Received: {msg.receivedAt ? new Date(msg.receivedAt).toLocaleString() : 'Unknown date'}
                  </span>

                  <div className="email-action-area">
                    {msg.processingStatus === 'PROCESSED' || msg.processed ? (
                      <span style={{ color: 'var(--accent-green)', fontWeight: 500, fontSize: '13px' }}>
                        ✓ Added to Expenses
                      </span>
                    ) : msg.processingStatus === 'PROCESSING' ? (
                      <span style={{ color: 'var(--accent-yellow)', fontWeight: 500, fontSize: '13px' }}>
                        ⏳ Processing...
                      </span>
                    ) : msg.processingStatus === 'FAILED' ? (
                      <span style={{ color: 'var(--accent-red)', fontWeight: 500, fontSize: '13px' }}>
                        ❌ Processing Failed
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                        Not yet processed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No transaction emails synced yet.</p>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '8px 0 16px' }}>
              Connect Gmail and click <strong>Sync Inbox</strong> to import your receipt emails.
            </p>
            <Button variant="primary" onClick={handleSyncEmails} disabled={!isConnected || isSyncing} isLoading={isSyncing}>
              Sync Inbox
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailsPage;