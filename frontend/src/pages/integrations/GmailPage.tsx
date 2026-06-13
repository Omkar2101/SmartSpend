/**
 * Gmail Integration Page Component
 * Connect and manage Gmail integration simulation
 */

import React from 'react';
import { useGmailConnection, useConnectGmail, useDisconnectGmail } from '../../hooks/useApi';
import Button from '../../components/common/Button';
import './GmailPage.css';

export const GmailPage: React.FC = () => {
  const { data: gmailConnection, refetch } = useGmailConnection();
  const connectGmail = useConnectGmail();
  const disconnectGmail = useDisconnectGmail();

  const handleConnect = async () => {
    try {
      await connectGmail.mutateAsync();
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisconnect = async () => {
    if (confirm('Disconnect Gmail synchronization? You will no longer be able to sync new receipts.')) {
      try {
        await disconnectGmail.mutateAsync();
        refetch();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const isConnected = !!gmailConnection;

  return (
    <div className="page-container">
      <div className="gmail-page">
        <div className="page-header">
          <div>
            <h1>📨 Gmail Synchronization</h1>
            <p className="page-header-desc">
              Connect Google account to automatically check for transaction email receipts
            </p>
          </div>
        </div>

        <div className="gmail-card">
          {isConnected ? (
            <>
              <h2 style={{ color: 'var(--accent-green)' }}>✓ Synced Securely</h2>
              <p>Email: <strong>{gmailConnection.googleEmail}</strong></p>
              <p className="connected-info">
                Authorization token granted on {new Date(gmailConnection.createdAt).toLocaleDateString()}
              </p>
              <Button
                variant="danger"
                onClick={handleDisconnect}
                isLoading={disconnectGmail.isPending}
                style={{ marginTop: '8px' }}
              >
                Disconnect Gmail
              </Button>
            </>
          ) : (
            <>
              <h2>Connect Your Gmail Inbox</h2>
              <p>
                Automatically import, parse, and categorize billing statements and shopping invoices.
              </p>
              <Button
                variant="primary"
                onClick={handleConnect}
                isLoading={connectGmail.isPending}
              >
                Connect Gmail Account
              </Button>
            </>
          )}
        </div>

        <div className="features-info">
          <h3>Integration Features</h3>
          <ul>
            <li>📧 Auto-scans for order confirmations and booking receipts</li>
            <li>🤖 Simulates AI-powered vendor and total amount extraction</li>
            <li>💾 Creates structured expense entries in your workspace</li>
            <li>🔒 Read-only email receipt scopes</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GmailPage;