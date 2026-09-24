import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="status-page">
      <h1>Page not found</h1>
      <p>There is no page at this address. It may have been moved, or the link has a typo.</p>
      <div className="status-page-actions">
        <Link to="/">Go to the home page</Link>
        <Link to="/dashboard">Open the tracker</Link>
      </div>
    </div>
  );
}

export default NotFound;
