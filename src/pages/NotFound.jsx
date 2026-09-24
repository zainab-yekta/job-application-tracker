import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import '../components/StatusPage.css';

function NotFound() {
  return (
    <main className="status-page">
      <div className="status-page-card card">
        <span className="status-page-icon" aria-hidden="true">
          <Compass size={28} />
        </span>
        <p className="status-page-code">404</p>
        <h1>Page not found</h1>
        <p>There is no page at this address. It may have been moved, or the link has a typo.</p>
        <div className="status-page-actions">
          <Link to="/" className="btn btn-primary">
            Go to the home page
          </Link>
          <Link to="/dashboard" className="btn btn-secondary">
            Open the tracker
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
