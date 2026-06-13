/**
 * 404 Not Found Page Component
 */

import React from 'react';
import { Link } from 'react-router-dom';
import ROUTES from '../routes/routes';
import './NotFoundPage.css';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="not-found-page">
      <h1>404</h1>
      <p>Page Not Found</p>
      <Link to={ROUTES.DASHBOARD}>← Back to Dashboard</Link>
    </div>
  );
};

export default NotFoundPage;